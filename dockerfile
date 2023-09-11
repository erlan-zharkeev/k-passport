FROM  --platform=linux/amd64 node:18.13.0

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . .

RUN yarn build

ENV PORT $SERVER_PORT

EXPOSE $SERVER_PORT

CMD [ "yarn", "start:prod" ]