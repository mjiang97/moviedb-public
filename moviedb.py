from classes.movie import Movie
from classes.list import List
from classes.search import Search
from flask import Flask, request, jsonify
from flask_cors import CORS
from urllib.parse import unquote 

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import requests
import json
import os
from dotenv import load_dotenv

app = Flask(__name__)
cors = CORS(app)

# =================================================================================
# connect to MongoDB
# =================================================================================
load_dotenv()
MDB_DB_USERNAME = os.getenv('MDB_db_username')
MDB_DB_PASSWORD = os.getenv('MDB_db_password')

uri = f"mongodb+srv://{MDB_DB_USERNAME}:{MDB_DB_PASSWORD}@moviedb.xktef.mongodb.net/?retryWrites=true&w=majority&appName=moviedb"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

# ========================================================
# Connect to collections
# ========================================================
db = client["mydatabase"]
list_collection = db["lists"]
movie_collection = db["movies"]
# tv_collection = db["tvshows"]

# ========================================================
# List functionality
# ========================================================
def addList(name="NewList"):
    l = list_collection.find_one({"name":name})
    if l == None:
        l = List(name)
        list_collection.insert_one(l.getDictFormat())
    else:
        print(f"List {name} exists already. adding new movies to existing list")
    # addMoviestoList(name, movieids) 
    return l

def getList(name):
    return list_collection.find_one({"name":name})

def addMoviestoList(listname, movieid=[]):
    l = list_collection.find_one({"name":listname})
    if l == None:
        print("List does not exist") # might change to add list automatically
        return False
    l = List(l)
    for i in movieid:
        if i not in l.getIDs():
            m = movie_collection.find_one({"id":i})
            if m == None:
                addMovie(Search.fetch_movie_data(i))
            l.addEntry(i)
    list_collection.find_one_and_update({"name":listname}, {"$set": l.getDictFormat()})
    return True
        
def removeMoviesfromList(listname, movieid=[]):
    l = list_collection.find_one({"name":listname})
    if l == None:
        print("List does not exist") # might change to add list automatically
        return False
    l = List(l)
    for i in movieid:
        l.removeEntry(i)
    list_collection.find_one_and_update({"name":listname}, {"$set": l.getDictFormat()})
    return True
    
def renameList(name,new_name):
    try:
        list_collection.find_one_and_update({"name":name},{ '$set': {"name":new_name}})
        return True
    except:
        print("Error renaming list")
        return False
    
def deleteList(name):
    return list_collection.delete_one({"name":name})


# ========================================================
# Movie functionality
# ========================================================
def addMovie(movie): # can redo
    if type(movie)==Movie:
        exists = movie_collection.count_documents({"id":movie.getID()})
        if exists > 0:
            print("Movie already in database")
            return False
        
        movie_collection.insert_one(movie.getDictFormat())
        return True
    elif type(movie)==dict:
        temp = Movie(movie)
        movie_collection.insert_one(temp.getDictFormat())
        return True
    print("Error: addMovie only accepts Movie or dict type")
    return False

def getMovie(movieID):
    try:
        cursor = movie_collection.find({"id":movieID})
        return cursor[0]
    except:
        print(f"Error: movieID {movieID} not in database")
        return None

def updateMovie(movieID): 
    movie = getMovie(movieID)
    if movie != None:
        data = Search.fetch_movie_data(movieID)
        movie = Movie(data)
        movie_collection.find_one_and_update({"id":movieID},{ '$set': movie.getDictFormat()})
        return True
    else:
        print("movie not found in database. Adding new entry")
        return addMovie(movieID)
    return False

def deleteMovie(id, title=""):
    exists = movie_collection.count_documents({"id":id})
    if exists == 1:
        movie_collection.delete_one({"id":id})
        return True
    elif exists > 1:
        print("Multiple entries match this id. Deletion terminated.")
        return False
    print("No entry with id",id)
    return False

# ========================================================
# API Endpoints for Movie Functionality
# ========================================================

@app.route('/api/movies/<int:movie_id>', methods=['GET'])
def api_get_movie(movie_id):
    movie = getMovie(str(movie_id))
    if not movie:
        return jsonify({"error": f"Movie with ID {movie_id} not found"}), 404
    
    if '_id' in movie:
        del movie['_id']
        
    return jsonify({"movie": movie}), 200

@app.route('/api/movies/add', methods=['POST'])
def api_add_movie():
    # add a new movie to the database
    data = request.get_json()
    if not data or 'movie' not in data:
        return jsonify({"error": "Movie data is required"}), 400
    
    movie_data = data['movie']
    required_fields = ['id', 'title']
    for field in required_fields:
        if field not in movie_data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    # check if movie already exists
    existing_movie = getMovie(str(movie_data['id']))
    if existing_movie:
        return jsonify({"message": "Movie already exists", "movie": existing_movie}), 200
    
    success = addMovie(movie_data)
    if success:
        # add to appropriate list based on watch status
        if 'watch_status' in movie_data:
            if movie_data['watch_status'] == "Watching":
                addMoviestoList("Continue Watching", [str(movie_data['id'])])
            elif movie_data['watch_status'] == "Not Started":
                addMoviestoList("Start Watching", [str(movie_data['id'])])
        return jsonify({"message": "Movie added successfully", "movie": getMovie(movie_data['id'])}), 201
    else:
        return jsonify({"error": "Failed to add movie"}), 500
    
@app.route('/api/movies/search', methods=['GET'])
def api_search_movie():
    movie_keyword = request.args.get('query', '').strip()
    if not movie_keyword:
        return jsonify({"error": "No search query provided"}), 400
    query = Search()

    if not query.searchTitle(movie_keyword):
        return jsonify({"results": []}), 200 
    results = []

    for movie in query.movie_results:
        results.append({
            'id': movie.get('id'),
            'title': movie.get('title'),
            'release_date': movie.get('release_date'),
            'watch_status': movie.get('watch_status'),
            'backdrop_path': movie.get('backdrop_path'),
            'poster_path': movie.get('poster_path'),
            'summary': movie.get('overview'),
            'type': movie.get('type'),
        })
    # if not results:
    #     return jsonify({"error": f"No movies found for query '{movie_keyword}'"}), 404
    
    return jsonify({"results": results}), 200

@app.route('/api/movies/<movie_id>/watch_status', methods=['PUT'])
def api_update_watch_status(movie_id):
    data = request.get_json()
    if not data or 'watch_status' not in data:
        return jsonify({"error": "Watch status is required"}), 400

    watch_status = data['watch_status']
    print(f"Received watch_status: {watch_status}")
    movie = getMovie(movie_id)
    if not movie:
        print(f"Movie with ID '{movie_id}' not found. No update performed.")
        return jsonify({"error": f"Movie with ID '{movie_id}' not found"}), 404

    print(f"Retrieved movie: {movie}")
    movie_obj = Movie(movie)
    if not movie_obj.updateWatchStatus(watch_status):
        print(f"Invalid watch status: {watch_status}")
        return jsonify({"error": "Invalid watch status"}), 400

    print(f"Updating movie with new watch_status: {watch_status}")
    movie_collection.find_one_and_update({"id": movie_id}, {"$set": movie_obj.getDictFormat()})
    if watch_status == "Watching":
        # add to Continue Watching list
        addMoviestoList("Continue Watching", [movie_id])
        # remove from Start Watching list if it's in the list
        removeMoviesfromList("Start Watching", [movie_id])
    elif watch_status == "Not Started":
        # add to Start Watching list
        addMoviestoList("Start Watching", [movie_id])
        # remove from Continue Watching list if it's in the list
        removeMoviesfromList("Continue Watching", [movie_id])
    elif watch_status == "Done":
        # remove from both lists
        removeMoviesfromList("Continue Watching", [movie_id])
        removeMoviesfromList("Start Watching", [movie_id])
    
    return jsonify({
        "message": "Watch status updated successfully", 
        "movie": movie_obj.getDictFormat()
    }), 200

# ========================================================
# API Endpoints for List Functionality
# ========================================================

@app.route('/api/lists/add', methods=['POST'])
def api_add_list():
    data = request.get_json()
    if not data or 'name' not in data: 
        return jsonify({"error": "List name is required"}), 400
    name = data['name']

    existingList = getList(name)
    if existingList:
        if '_id' in existingList:
            existingList['_id'] = str(existingList['_id'])
        return jsonify({"error": f"List with name '{name}' already exists", "list": existingList}), 409

    newList = addList(name)
    if newList: 
        created_list = getList(name)
        # Remove or convert the _id field for JSON serialization
        if created_list and '_id' in created_list:
            created_list['_id'] = str(created_list['_id'])
        return jsonify({"message": f"List '{name}' created successfully"}), 201
    else:
        return jsonify({"error": "Failed to create list"}), 500
    
@app.route('/api/lists', methods=['GET'])
def api_get_lists():
    lists = list(list_collection.find({}, {"_id": 0}))
    return jsonify({"lists": lists}), 200

@app.route('/api/lists/<list_name>', methods=['GET'])
def api_get_list(list_name):
    list_name = unquote(list_name)
    list_data = getList(list_name)
    if not list_data:
        return jsonify({"error": f"List '{list_name}' not found"}), 404
    
    # convert ObjectId to string for JSON serialization
    if '_id' in list_data:
        list_data['_id'] = str(list_data['_id'])

    movie_details = []
    for movie_id in list_data['ids']:
        movie = getMovie(movie_id)
        if movie:
            # remove MongoDB _id for serialization
            if '_id' in movie:
                del movie['_id']
            movie_details.append(movie)
    
    list_data['movies'] = movie_details
    return jsonify({"list": list_data}), 200

def initialize_default_lists():
        default_lists = ["Continue Watching", "Start Watching"]
        for list_name in default_lists:
            existing_list = getList(list_name)
            if not existing_list:
                print(f"Creating default list: {list_name}")
                addList(list_name)

@app.route('/api/lists/<list_name>/movies', methods=['POST'])
def api_add_movie_to_list(list_name):
    list_name = unquote(list_name)
    data = request.get_json()
    movie_id = data['_id']
    
    # check if list exists
    existing_list = getList(list_name)
    if not existing_list:
        addList(list_name)
        
    success = addMoviestoList(list_name, [str(movie_id)])
    if (success):
        return jsonify({"message": f"Movies added to list '{list_name}'"}), 200
    else:
        return jsonify({"error": f"Failed to add movies to list '{list_name}'"}), 500
    
# =================================================================================
# run backend server with Flask
# =================================================================================
if __name__ == '__main__':
    print("Starting Flask app...")
    initialize_default_lists()
    cors.init_app(app)
    # app.run(debug=True)
    
    # # Production Server Launch
    # https://stackoverflow.com/questions/51025893/flask-at-first-run-do-not-use-the-development-server-in-a-production-environmen
    from waitress import serve
    serve(app, host="0.0.0.0", port=5000)
    print("Running!")