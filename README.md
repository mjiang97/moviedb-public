[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/vfKrPwQS)
# MovieDB
## Software Engineering Capstone Project
### Spring 2025

### Team:
Macy Jiang, Sarah Leong, Nikki Tan

## Getting Started
This project is a movie tracking system built as an MVP, using the TMDB API to pull accurate movie info like titles, release dates, and posters. Users can search for movies by title or keyword, track their watch status, and organize everything into custom lists. Each movie is stored as an Entry with details like aliases, platform links, and keywords. Everything’s saved with MongoDB so users can come back and update or review their lists anytime. The goal was to keep things simple and easy to use while making it feel personal and organized.

### Roadmap
- [ ] Add TV show tracking
- [ ] Add automatic tracking
- [ ] Add watch buddy
- [ ] Add Ai recommender

## SRS
https://docs.google.com/document/d/1w9qXsy9yhLMFH73KBoNPoN3TB6LCbn4LQAPkUQ4VZEo/edit?usp=sharing
  
### Prerequisites
* [Docker](https://www.docker.com/)
* [Node.js](https://nodejs.org/) (version 18.x or higher)
* [npm](https://www.npmjs.com/) (comes with Node.js)
* [Python](https://www.python.org/) (version 3.9 or higher)

### Installing
Build the Docker containers: docker compose build
Start the containers: docker compose up
Access the app: Open your browser and go to http://localhost:8081 for the frontend.
Stop the containers: docker compose dowwn
Example:
When the app is running, you'll see the homescreen displaying a “Continue Watching” list and a “Start Watching” list. You can also use the search bar to search for any movie in the database.

## Built With
* [requests](https://docs.python-requests.org/en/latest/user/quickstart/#make-a-request) - request for humans
* [Python](https://www.python.org/)
* [Node.js](https://nodejs.org/)
* [Docker](https://www.docker.com/)
* [unittest](https://docs.python.org/3/library/unittest.html)
* [Figma](https://www.figma.com/) – Used for UI/UX design
* [MongoDB] (https://www.mongodb.com/) – NoSQL database
* [TMDB API](https://developer.themoviedb.org/docs)


## License
MIT License
