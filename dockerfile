FROM  --platform=linux/amd64 node:18.13.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV PORT $SERVER_PORT

EXPOSE $SERVER_PORT

CMD [ "npm", "run",  "start:prod" ]