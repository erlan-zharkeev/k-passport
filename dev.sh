pkill node
docker-compose --env-file .env.development down -v
docker-compose --env-file .env.development up -d database
pnpm run start:dev