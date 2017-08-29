FROM node:latest

RUN mkdir -p /usr/src/www

WORKDIR /usr/src/www

COPY . /usr/src/www

WORKDIR /usr/src/server

RUN npm install

