#!/bin/sh

echo "Waiting for database to be ready..."

until pg_isready -h db -p 5432 -U "$POSTGRES_USER" -d "$POSTGRES_DB"; do
  sleep 2
done

echo "Database is ready! Running the application..."
exec pnpm run start:dev
