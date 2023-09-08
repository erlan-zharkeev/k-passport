pkill node
docker-compose --env-file .env.development down -v
docker-compose --env-file .env.development up -d db
pnpm run start:dev