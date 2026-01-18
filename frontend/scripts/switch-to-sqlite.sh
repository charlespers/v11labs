#!/bin/bash
# Script to switch Prisma schema from PostgreSQL back to SQLite for local dev

echo "Switching Prisma schema to SQLite..."

# Restore from backup if exists, or replace manually
if [ -f prisma/schema.prisma.sqlite.backup ]; then
  cp prisma/schema.prisma.sqlite.backup prisma/schema.prisma
  echo "✅ Schema restored to SQLite from backup"
else
  sed -i '' 's/provider = "postgresql"/provider = "sqlite"/' prisma/schema.prisma
  echo "✅ Schema switched to SQLite"
fi

echo "⚠️  Remember to set DATABASE_URL='file:./dev.db' in your .env file"
