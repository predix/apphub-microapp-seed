FROM                      node:latest
MAINTAINER                Jonnie Spratley <jonnie.spratley@ge.com>

ENV DEBUG                 *
ENV PORT                  8080
ENV NODE_ENV              production
ENV PROXY                 http://proxy-src.research.ge.com:8080
ENV http_proxy            $PROXY
ENV https_proxy           $PROXY
ENV no_proxy              *.ge.com

# Create app directory
WORKDIR                   /usr/src/app

COPY  .      ./

RUN npm config set strict-ssl false
RUN npm config set proxy $PROXY
RUN npm config set https-proxy $PROXY
RUN npm config ls
RUN npm -v
RUN node -v
RUN npm install --production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]
