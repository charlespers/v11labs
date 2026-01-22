# Quick Setup for Vercel with PostgreSQL

## ✅ Step 1: Schema Updated
The Prisma schema has been switched to PostgreSQL.

## Step 2: Set Environment Variables in Vercel

Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

Add these variables:

### Required:
1. **DATABASE_URL**
   ```
   postgres://68ebad88ae03a8aa075f9fa653ef41f48712ee9f555ab9628ac79ebd62382339:sk_-Wuq2-7r6-LYVcI3WnhlY@db.prisma.io:5432/postgres?sslmode=require
   ```

2. **ADMIN_PASSWORD**
   ```
   your-secure-password-here
   ```

**Note:** You can also use `PRISMA_DATABASE_URL` if you want to use Prisma Accelerate for better performance on Vercel.

## Step 3: Run Database Migrations

You need to create the database tables. Run this command locally (with DATABASE_URL set):

```bash
cd frontend

# Set the DATABASE_URL temporarily
export DATABASE_URL="postgres://68ebad88ae03a8aa075f9fa653ef41f48712ee9f555ab9628ac79ebd62382339:sk_-Wuq2-7r6-LYVcI3WnhlY@db.prisma.io:5432/postgres?sslmode=require"

# Generate Prisma client for PostgreSQL
npx prisma generate

# Create and apply migration for PostgreSQL
npx prisma migrate dev --name init_postgres
```

Or if you prefer to use the production migration command:

```bash
npx prisma migrate deploy
```

## Step 4: Commit and Push

```bash
git add prisma/schema.prisma
git add prisma/migrations/
git commit -m "Switch to PostgreSQL for Vercel deployment"
git push
```

## Step 5: Verify Deployment

After pushing, Vercel will automatically:
1. Build your app
2. Generate Prisma client
3. Deploy

Check your Vercel deployment logs to ensure everything builds successfully.

## Troubleshooting

### If migrations fail:
- Make sure DATABASE_URL is correct
- Verify you can connect: `npx prisma db pull` (should show your schema)
- Check SSL mode is set: `?sslmode=require`

### If build fails:
- Check Vercel logs for specific errors
- Verify `DATABASE_URL` is set in Vercel environment variables
- Make sure `ADMIN_PASSWORD` is set

### To switch back to SQLite for local dev:
```bash
# Edit prisma/schema.prisma and change:
# provider = "postgresql" → provider = "sqlite"
# Then set DATABASE_URL="file:./dev.db" in .env
```
