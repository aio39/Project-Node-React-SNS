FROM node:alpine

WORKDIR /app

COPY ./package.json ./

RUN npm install
RUN npm install pm2 -g

COPY . .

RUN chmod 777 log
RUN chmod 777 node_modules
RUN chown -R node:node /root

CMD [ "pm2-runtime", "ecosystem.config.js", "--env", "production" ]