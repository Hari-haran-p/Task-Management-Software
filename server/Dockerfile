FROM node:slim

WORKDIR /app/server/

COPY /package*.json /app/server/

RUN npm install

RUN npm install -g nodemon

COPY . /app/server/

EXPOSE 4000

CMD ["npm", "start"]