FROM                      node:latest
MAINTAINER                Jonnie Spratley <jonnie.spratley@ge.com>

# System Env Vars
ENV PROXY                 http://proxy-src.research.ge.com:8080
ENV http_proxy            $PROXY
ENV https_proxy           $PROXY
ENV no_proxy              *.ge.com

# Application Env Vars
ENV DEBUG                 apphub-microapp-seed:*
ENV PORT                  8080
ENV NODE_ENV              production
ENV REQUEST_LIMIT         2500kb
ENV SESSION_SECRET        mySecret
ENV COOKIE_NAME           myCookie
ENV SWAGGER_API_SPEC      /spec


ENV ENABLE_CLUSTER_MODE   true
#ENV API_DATABASE_ADAPTER  file

# Redis data store
#ENV ENABLE_REDIS_STORE   true
#ENV REDIS_HOST           0.0.0.0
#ENV REDIS_PORT           6379
#ENV REDIS_PASSWORD       test
#ENV REDIS_DB             0


WORKDIR                   /usr/src/app

COPY                      ./dist      ./

#RUN apt-get update && apt-get install -y redis-server

# Setup npm and install dependencies
RUN npm config set strict-ssl false
RUN npm config set proxy $PROXY
RUN npm config set https-proxy $PROXY
RUN npm config ls

RUN npm -v
RUN node -v
RUN npm install --production


EXPOSE 8080

CMD [ "node", "server" ]
