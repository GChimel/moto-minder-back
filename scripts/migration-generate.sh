#!/bin/bash

# Check if migration name is provided
if [ -z "$1" ]; then
  echo "Error: Migration name is required"
  echo "Usage: npm run migration:generate MigrationName"
  exit 1
fi

# Generate migration
typeorm-ts-node-commonjs migration:generate \
  -d typeorm.config.ts \
  "src/shared/infrastructure/database/migrations/$1"
