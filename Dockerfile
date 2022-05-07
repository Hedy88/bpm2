FROM node:alpine

RUN cd /home/node/bpm2 && npm install

USER node