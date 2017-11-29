FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/

# Install Node Packages
RUN npm install --production

# Bundle app source
COPY . /usr/src/app

EXPOSE 9000
CMD [ "node", "app.js" ]
