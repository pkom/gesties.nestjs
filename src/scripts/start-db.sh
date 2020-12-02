#!/bin/bash
set -e

# ARTICLE: https://medium.com/@gausmann.simon/nestjs-typeorm-and-postgresql-full-example-development-and-project-setup-working-with-database-c1a2b1b11b8f

SERVER="postgres_server";
PW="postgres";
DB="gesties_dev";
DB_USER="gesties";
DB_PASSWORD="gesties";

echo "echo stop & remove old docker [$SERVER] and starting new fresh instance of [$SERVER]"
(docker kill $SERVER || :) && \
  (docker rm $SERVER || :) && \
  docker run --name $SERVER -e POSTGRES_PASSWORD=$PW \
  -e PGPASSWORD=$PW \
  -p 5432:5432 \
  -d postgres

# wait for pg to start
echo "sleep wait for pg-server [$SERVER] to start";
sleep 3;

# create the db 
echo "CREATE DATABASE $DB ENCODING 'UTF-8';" | docker exec -i $SERVER psql -U postgres
echo "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';" | docker exec -i $SERVER psql -U postgres
echo "ALTER DATABASE $DB OWNER TO $DB_USER;" | docker exec -i $SERVER psql -U postgres
# echo "GRANT ALL PRIVILEGES ON DATABASE $DB TO $DB_USER;" | docker exec -i $SERVER psql -U postgres
echo "\l" | docker exec -i $SERVER psql -U postgres