#!/bin/bash

# Check if migration name is provided
if [ -z "$1" ]; then
  echo "Error: Migration name is required"
  echo "Usage: npm run migration:create MigrationName"
  exit 1
fi

# Create migration
typeorm-ts-node-commonjs migration:create \
  "src/shared/infrastructure/database/migrations/$1"
