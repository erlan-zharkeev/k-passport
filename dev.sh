pkill node
docker-compose --env-file .env.development down -v
docker-compose --env-file .env.development up -d database
yarn start:dev