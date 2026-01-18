#!/bin/bash
# Script to switch Prisma schema from SQLite to PostgreSQL for Vercel deployment

echo "Switching Prisma schema to PostgreSQL..."

# Backup original schema
cp prisma/schema.prisma prisma/schema.prisma.sqlite.backup

# Replace provider
sed -i '' 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma

echo "✅ Schema switched to PostgreSQL"
echo "⚠️  Remember to:"
echo "   1. Set DATABASE_URL in Vercel to your PostgreSQL connection string"
echo "   2. Run: npx prisma migrate deploy"
echo ""
echo "To switch back to SQLite, run: scripts/switch-to-sqlite.sh"
