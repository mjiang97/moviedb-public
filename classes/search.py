import requests
import json
import os
from dotenv import load_dotenv
from classes.movie import Movie

# =================================================================================
# connect to TMDB
# =================================================================================
load_dotenv()
TMDB_API_TOKEN = os.getenv('TMDB_API_TOKEN')
url = "https://api.themoviedb.org/3/authentication"
headers = {
    "accept": "application/json",
    "Authorization": f"Bearer {TMDB_API_TOKEN}"
}

response = requests.get(url, headers=headers)

print(response.text)

# ==================================================================

class Search:
    def __init__(self, query=""):
        self.phrase = str(query)
        self.movie_results = []
        # self.keyword_results = []
        # self.tv_results = [] # removed for simplicity
        
    def searchTitle(self, title=""):
        if title == "":
            if self.phrase == "":
                print("Error: no search phrase was provided")
                return False
            else:
                title = self.phrase
        else:
            self.phrase = title # keep track of search phrase
        
        url = f"https://api.themoviedb.org/3/search/movie?query={title}"
        response = requests.get(url,headers=headers)
        if response.status_code == 200:
            # print(json.dumps(response.json(), indent=4))
            self.movie_results = response.json()["results"] # only takes the first page of results i think
            return True
        else:
            print(f"Error searching {title}: {response.status_code}")
        return False
    
    
    def searchKeyword(self, keyword): # might void if we remove keyword entirely
        if keyword == "":
            keyword = self.phrase
            
        url = f"https://api.themoviedb.org/3/search/keyword?query={keyword}"
        response = requests.get(url,headers=headers)
        if response.status_code == 200:
            # print(json.dumps(response.json(), indent=4))
            self.keyword_results = response.json()["results"] # only takes the first page of results i think
            return True
        else:
            print(f"Error searching {keyword}: {response.status_code}")
        return False
    

    def makeEntry(self,index,type="movie"): # index will likely be given by the item id from front end?
        if index > len(self.movie_results):
            print("Error: selected movie not in results (index out of bounds)")
            return
        
        # data = self.movie_results[index]
        # data['watch_status'] = 0
        
        data = Search.fetch_movie_data(self.movie_results[index]["id"])
        m = Movie(data)     
        return m
    
    # def makeEntries(self,arr,type="movie",limit=50): # is bulk making entries necessary? a different way might be better
    #     return False
    
        # fetch movie data
    def fetch_movie_data(movie_id):
        # get general details
        url = f"https://api.themoviedb.org/3/movie/{movie_id}?language=en-US"
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            resp = response.json()
        else:
            print(f"Error fetching movie {movie_id}: {response.status_code}")
            return None
        
        # # get platform links
        # url = f"https://api.themoviedb.org/3/movie/{movie_id}/watch/providers"
        # response = requests.get(url, headers=headers)
        # if response.status_code == 200:
        #     resp["platform_links"] = response.json()["results"]
        #     # print(json.dumps(resp["platform_links"],indent=2))
        # else:
        #     print(f"Error fetching movie platforms {movie_id}: {response.status_code}")
        #     return None
                    
        data = {
                'id': resp["id"],
                'title': resp["title"],
                'release_date': resp["release_date"],
                'watch_status': 0,
                'backdrop_path': resp["backdrop_path"],
                'poster_path': resp["poster_path"],
                'summary': resp["overview"]
            }
        
        return data