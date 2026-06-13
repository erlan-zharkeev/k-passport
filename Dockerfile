FROM --platform=linux/amd64 node:18.13.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV SERVER_PORT=5555

EXPOSE 5555

CMD ["npm", "run", "start:prod"]
