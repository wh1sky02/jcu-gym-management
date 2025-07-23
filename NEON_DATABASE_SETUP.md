# Neon Database Setup Guide

This guide will help you set up your own Neon database for the JCU Gym Management System.

## 1. Create Neon Account

1. Go to [Neon](https://neon.tech)
2. Click "Sign Up"
3. Sign up with GitHub (recommended)

## 2. Create New Project

1. Click "New Project"
2. Fill in project details:
   - **Name:** `jcu-gym-management` (or any name you prefer)
   - **Region:** Choose the closest region to JCU
   - **Postgres Version:** 15 (recommended)
   - **Project Type:** Free tier

## 3. Get Database Credentials

1. After project creation:
   - Go to the project dashboard
   - Click on "Connection Details"
   - Switch to "Postgres Connection"

2. Copy these values:
   - **Database URL:** Looks like `postgres://[USER]:[PASSWORD]@[HOST]/[DATABASE]`
   - Make sure to use the connection string with SSL enabled

## 4. Update Environment Variables

1. Open `.env.local` in your project
2. Replace the old database values with your Neon credentials:

```env
# Replace with your Neon values
DATABASE_URL=postgres://[USER]:[PASSWORD]@[HOST]/[DATABASE]?sslmode=require
```

## 5. Initialize Database Schema

1. Connect to your database using the connection string
2. Run the schema file:
```bash
psql "your-connection-string" < neon-schema.sql
```

## 6. Test Connection

1. Run the test command:
```bash
npm run db:test
```

2. If successful, you'll see:
```
✅ Database connected successfully!
```

## 7. Start the Application

1. Windows:
```powershell
./start.ps1
```

2. Mac/Linux:
```bash
./start.sh
```

## Troubleshooting

If you see database connection errors:

1. **Check Credentials**
   - Verify DATABASE_URL is correct
   - Make sure to include `?sslmode=require` in the connection string
   - Check for typos in credentials

2. **Check Network**
   - Make sure you're connected to internet
   - Try accessing Neon dashboard
   - Check if your IP is allowed (Neon has no IP restrictions by default)

3. **Common Fixes**
   - Double-check the connection string format
   - Ensure SSL is enabled in the connection string
   - Try connecting with psql to verify credentials

Need help? Check the [Neon Documentation](https://neon.tech/docs) 