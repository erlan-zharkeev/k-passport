docker-compose --env-file .env.production build

DOCKER_USERNAME="ketjo"
DOCKER_PASSWORD="r&imRAc#NxPai9@4"

echo "Logging in to Docker Hub..."
echo "$DOCKER_PASSWORD" | docker login --username "$DOCKER_USERNAME" --password-stdin

RED='\033[0;31m'
NC='\033[0m'

DOCKER_LOGIN_STATUS=$?
if [ $DOCKER_LOGIN_STATUS -eq 0 ]; then
  echo "Successfully logged in to Docker Hub!"
else
  echo "${RED}Failed to login to Docker Hub. Please check your credentials and try again.${NC}"
fi

docker push ketjo/ez-shops:latest