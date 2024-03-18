FROM node:18-alpine

MAINTAINER abz

RUN mkdir /app

COPY backend/package.json /app

COPY backend/package-lock.json /app/

WORKDIR /app

RUN npm install


