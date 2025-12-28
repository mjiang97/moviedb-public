FROM node:23
# https://www.milanwittpohl.com/projects/tutorials/full-stack-web-app/dockerizing-our-front-and-backend

# The /app directory should act as the main application directory
WORKDIR /var/app/moviedb-frontend
# Copy the app package and package-lock.json file
COPY /moviedb-frontend/package*.json .
COPY /moviedb-frontend/App.tsx .

# Install node packages
RUN npm install

# Copy or project directory (locally) in the current directory of our docker image (/app)
COPY moviedb-frontend/ .

# # Build the app
# RUN npm run start

# # # Start the app
# # CMD [ "npm", "start" ]

ENTRYPOINT ["npm", "run"]
CMD ["web"]