# Cloud Database Setup Guide

This guide will help you set up your own Supabase database for the JCU Gym Management System.

## 1. Create Supabase Account

1. Go to [Supabase](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended)

## 2. Create New Project

1. Click "New project"
2. Fill in project details:
   - **Name:** `jcu-gym-management` (or any name you prefer)
   - **Database Password:** Save this password!
   - **Region:** Choose Singapore (closest to JCU)
   - **Pricing Plan:** Free tier

## 3. Get Database Credentials

1. After project creation, go to:
   - Project Settings (⚙️ icon) → Database
   - Look for "Connection string" section

2. Copy these values:
   - **Database URL:** Looks like `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres`
   - **Project URL:** Find in API settings, looks like `https://[YOUR-PROJECT-ID].supabase.co`
   - **Anon Key:** Find in API settings, starts with `eyJ...`

## 4. Update Environment Variables

1. Open `.env.local` in your project
2. Replace these values:

```env
# Replace with your values
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
```


## 5. Test Connection

1. Run the test command:
```bash
npm run db:test
```

2. If successful, you'll see:
```
✅ Database connected successfully!
```

## 6. Start the Application

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
   - Check for typos in project ID
   - Make sure password is correct

2. **Check Network**
   - Make sure you're connected to internet
   - Try accessing Supabase dashboard

3. **Common Fixes**
   - Double-check all credentials in `.env.local`
   - Make sure you copied the full connection string
   - Verify your IP is not blocked in Supabase dashboard

Need help? Check the [Supabase Documentation](https://supabase.com/docs) 