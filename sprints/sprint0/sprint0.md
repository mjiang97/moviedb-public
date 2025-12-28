# **Project Overview**

## **Application Vision/Goal:**
[Describe the overall purpose and vision of the application. What problem does it solve? Who is the target audience?]
Purpose
- Keep track of shows already watched and wanted to watch
	- Possibly link with streaming site accounts
- Recommend shows based on previously watched shows
	- Possibly use AI, not social based
- Convenient tool for managing downtime
Target Audience
- Personal use, not collaborative (no accounts)
## **Scope:**
[List the major features and functionalities that define the scope of the project. Keep this high-level to avoid feature creep.]
- Allow manual input and alteration of data
- Database of shows and movies
	- Content Information
		- Fixed
			- genres
			- Image(s)
			- year released
			- title
			- Aliases
			- type (movie, show, webseries, anime)
			- number of episodes
			- summaries (included if based on a book or some other source material)
		- Dynamic (modifiable by user or webscrapable?)
			- Popularity ratings (webscraping from existing review sites? Rotten Tomatoes, MAL)
			- Hiatus/Updates from the author (webscraping from social media)
	- Personal Information
		- Reviews (journal entries on each episode?)
		- Ratings (out of 5 stars, out of 10)
		- If friend recommended it (access to contacts?) maybe add this later
		- What episode/timestamp you left off at
		- When you finished each episode
		- Ranking system for watched content
		- data import/export (to backup/transfer their watchlist? or like a share link)
	- Maintenance
		- User input (manually)
		- Taking information from existing content databases
- Recommendation system
	- Keeps track of recommendations from your friends
		- Uses personally inputted information
	- Personalized AI recommendation
	- webscrape from existing movie databases
- Primarily for PC
	- Hopefully accessible for mobile use, but not necessary
- Visually appealing and engaging to encourage regular use
	- Watching shows buddy (love this idea, i feel like this could be our main project instead)
		- Option to start automatically when you turn on your device
		- Like talking to a friend about the show, but this friend also keeps track of everything
			- tell it "Rebecca recommends Wicked" -> makes an entry for wicked in your personal database
		- When you open a streaming site, the buddy will watch with you.
			- when you pause it records the pause as the marker
			- when you finish an episode it records that episode as finished watching
			- If you leave in the middle: saves time stamp, episode number, last watched date
				- possibly give you online reviews of last ep?
		- https://samperson.itch.io/desktop-goose (just a little buddy on our screens while we watch)
		- On mobile, uses notifications to tell you if it records info?
	- Minimal database interface (for when the speed of the chatbot does not work)
## **Deliverables:**
[List what will be delivered by the end of the project, such as a working MVP (Minimum Viable Product), specific features, documentation, etc.]

MVP Deliverables
- [ ] Database of watchable content
	- [ ] Movie Information
		- [ ] Title
		- [ ] Images
	- [ ] Personal Information
		- [ ] Finished watching/On episode \#/Not started
	- [ ] Add/get/modify information
- [ ] Recommendation system
	- [ ] Friend recommendations (given by user)
- [ ] Database Interface
	- [ ] Add/get/modify movie entries
	- [ ] Prepare for database
	- [ ] Show movie images
 
## **Success Criteria:**
[Define what will make this project successful. Examples include meeting deadlines, delivering core functionality, or achieving performance benchmarks.]
Minimal viable product (MVP) by (insert deadline) with:
- Working database (1 sprint)
	- command line?
- Simple database interface (1 sprints)
	- visuals
- Basic tracking functionality (1 sprint)
	- (manual entry into interface --> updates database)
	- combined functionality

Expanded functionality after MVP:
- more database information (1 sprint)
- automated tracking bc people are lazy (2-3 sprints)
	- watching buddy
- Webscrape recommendations from existing databases (1 sprint)
- personalized AI recs based on watch history (2 sprints)
- mobile access (1 sprint)

**Final Project Due by Friday, May 2nd, 11:59 pm (midnight)**

## **Assumptions:**
[List any assumptions about the technology, users, or resources that could impact development.]
Users
- Too lazy to input information into their own database or research info
- Long term use
## **Risks:**
[Identify potential risks and challenges, such as technical limitations, resource constraints, or dependency issues.]
Resources
- database gets really large esp after long term use --> memory/storage problems
Privacy issues if database is stored online
## **Design / Architectural Review:**
[Outline the initial thoughts on application architecture. Will it be monolithic or microservices? Will it use a database? What major components will be included?]
Needs database
Needs interface to present and update database information
Microservices architecture
## **Test Environment:**
[Define how the application will be tested. Will you use automated tests? What environment will the tests run in?]
Scripted tests to test database functionality
- Automated construct database
- Retrieve database information
	- Item requested not found
	- multiple items found for one query
- Modifying database information
	- adding new item
	- changing existing item
	- deleting existing item
	- grouping existing items
		- merging duplicate items
		- grouping sequels, prequels, personal collections, etc
Scripted tests for database to interface functionality
- request database info, parse queried info, display
- package new database info/changes for database to parse
Human testing for interface convenience and visuals
- color schemes
- bugs
- UI/UX layouts



---

# **Team Setup**

## **Team Members:**
[List all team members involved in the project.]
Macy Jiang, Sarah Leong, Nikki Tan
## **Team Roles:**
[Define roles for each team member, such as developer, designer, project manager, QA tester, etc.]
Developers: Everyone :D
## **Team Norms:**
[Establish how the team will communicate, how often meetings will happen, and any other ground rules for collaboration.]
Discord group chat
	Meetings about once a week
Tuesdays 1PM-3PM In Person Meetings

## **Application Stack:**
[List all the technologies being used in the project, including programming languages, frameworks, and tools.]

**Frontend**
- JavaScript
**Backend**
- **Python (Alpine)** → [python:3.12-alpine](https://hub.docker.com/_/python)
**Web Server**
- **Nginx** → [nginx:latest](https://hub.docker.com/_/nginx)
**Database**
- **PostgreSQL** → [postgres:15](https://hub.docker.com/_/postgres)
- MongoDB
- SQLite
**Cache**
- **Redis** → [redis:latest](https://hub.docker.com/_/redis)
**Organizational Tools**
- Jira
- Google Docs
- Figma

**Additional Dependencies**
- Any other dependencies can be listed here, such as Celery, Node.js, or worker services.


### **Libraries/Frameworks:**
[List any specific libraries or frameworks your application will use, such as React, Flask, Django, etc.]
- React
- Flask