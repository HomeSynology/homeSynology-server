FROM node:latest

MAINTAINER Jesusalexander <brpoper@gmail.com>

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update
RUN apt-get install -y git

ADD https://api.github.com/repos/HomeSynology/homeSynology-server/git/refs/heads/rel version.json
RUN git clone -b rel https://github.com/HomeSynology/homeSynology-server.git /var/www/homeSynology-server
WORKDIR /var/www/homeSynology-server
RUN npm install
RUN ls node_modules

EXPOSE 8080
CMD ["/var/www/homeSynology-server/bin/www"]

