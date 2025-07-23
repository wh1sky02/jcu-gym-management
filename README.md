# 🏋️‍♂️ JCU Gym Management System

A web application for managing gym bookings at James Cook University Singapore.

## 🚀 Quick Setup (5 Steps)

### Step 1: Install Node.js
- Go to [https://nodejs.org](https://nodejs.org)
- Download and install the LTS version
- Restart your computer

### Step 2: Get Database URL
- Sign up at [https://neon.tech](https://neon.tech) (free)
- Create new project
- Copy the connection string (looks like: `postgresql://user:pass@host/db?sslmode=require`)

### Step 3: Setup Environment File
- Rename `env.example` to `.env.local`
- Open `.env.local` in any text editor
- Replace `DATABASE_URL=postgresql://[USER]:[PASSWORD]@[HOST]/[DATABASE]?sslmode=require` with your connection string
- Save file

### Step 4: Start Application
**Windows:** Run `powershell -ep bypass` then run `./start.ps1`
**Mac/Linux:** Run `chmod +x start.sh && ./start.sh`

**Or manually:**
```bash
npm install
npm run dev
```

### Step 5: Access Application
Open browser: http://localhost:3000

## 🔑 Login Accounts
- **Admin:** admin@my.jcu.edu.au / admin123
- **Student:** demo@my.jcu.edu.au / demo123

## 🔄 Change Database URL
1. Open `.env.local` file
2. Find line starting with `DATABASE_URL=`
3. Replace with your new database URL
4. Save file
5. Restart application (`Ctrl+C` then restart)

## ❌ Common Problems
- **Port in use:** Add `-- --port 3001` to npm command
- **Can't connect:** Check your database URL in `.env.local`
- **Module errors:** Run `rm -rf node_modules && npm install`
   - Keep all default settings

#### For Mac Users:
1. Download and install **Node.js** from [https://nodejs.org](https://nodejs.org)
   - Choose the "LTS" version (recommended)
   - Run the `.pkg` file and follow the installer

#### For Linux Users:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# CentOS/RHEL
sudo yum install nodejs npm
```

### Step 2: Set Up Your Database (FREE)

The application uses **Neon** - a free cloud database service. Here's how to set it up:

1. **Create a Free Neon Account**
   - Go to [https://neon.tech](https://neon.tech)
   - Click "Sign Up" 
   - Use your email or sign up with GitHub/Google

2. **Create Your Database**
   - After logging in, click "Create Project"
   - Choose a project name (e.g., "jcu-gym-system")
   - Select a region close to you
   - Click "Create Project"

3. **Get Your Database Connection String**
   - In your Neon dashboard, look for "Connection Details"
   - Copy the connection string that looks like:
     ```
     postgresql://username:password@hostname/database?sslmode=require
     ```
   - Save this - you'll need it in the next step!

### Step 3: Configure the Application

1. **Rename the Environment File**
   - In your project folder, find the file called `env.example`
   - Rename it to `.env.local` (note the dot at the beginning)

2. **Add Your Database Connection**
   - Open `.env.local` with any text editor (Notepad, VS Code, etc.)
   - Find the line that says:
     ```
     DATABASE_URL=postgresql://[USER]:[PASSWORD]@[HOST]/[DATABASE]?sslmode=require
     ```
   - Replace the entire line with your Neon connection string from Step 2
   - Save the file

### Step 4: Start the Application

#### Super Easy Method (Recommended):

**For Windows:**
- Double-click the `start.ps1` file
- If Windows blocks it, right-click → "Run with PowerShell"

**For Mac/Linux:**
- Open Terminal
- Navigate to your project folder
- Run: `chmod +x start.sh && ./start.sh`

#### Manual Method:
If the scripts don't work, you can start manually:

1. Open Terminal/Command Prompt
2. Navigate to your project folder
3. Run these commands one by one:
   ```bash
   npm install
   npm run dev
   ```

### Step 5: Access Your Application

Once started, open your web browser and go to:
- **Main Application:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin/login

---

## � Default Login Accounts

### 👨‍💼 Administrator Account
- **Email:** `admin@my.jcu.edu.au`
- **Password:** `admin123`
- **What you can do:** Manage users, view statistics, control bookings

### 👨‍🎓 Demo Student Account  
- **Email:** `demo@my.jcu.edu.au`
- **Password:** `demo123`
- **What you can do:** Book gym sessions, view your bookings

---

## 🎯 What This System Does

### For Students:
- 📅 **Book Gym Sessions** - Reserve your spot in advance
- 📋 **Manage Bookings** - View, cancel, or modify your reservations
- 📊 **Track Progress** - See your gym usage history
- 🔔 **Get Notifications** - Stay updated on important announcements
- 👤 **Profile Management** - Update your personal information

### For Gym Staff/Administrators:
- ✅ **Approve Registrations** - Review and approve new student accounts
- 📈 **View Statistics** - Track gym usage, popular times, and trends
- 👥 **Manage Users** - Handle student accounts and permissions
- 📢 **Send Announcements** - Communicate important information
- 🕐 **Session Management** - Control available booking slots

---

## 🔧 Common Issues & Solutions

### ❌ "Port 3000 is already in use"
**Solution:** Another application is using that port
```bash
# Try running on a different port
npm run dev -- --port 3001
```
Then visit: http://localhost:3001

### ❌ "Cannot connect to database"
**Solutions:**
1. Check if your `.env.local` file exists and has the correct database URL
2. Make sure your Neon database is active (check the Neon dashboard)
3. Verify your internet connection
4. Test the connection:
   ```bash
   npm run db:test
   ```

### ❌ "Module not found" or "Dependencies error"
**Solution:** Reinstall all dependencies
```bash
# Delete old files and reinstall
rm -rf node_modules
npm install
```

### ❌ Application won't start
**Solutions:**
1. Make sure Node.js is properly installed:
   ```bash
   node --version
   npm --version
   ```
2. Both commands should show version numbers
3. If not, reinstall Node.js from the official website

---

## 🔄 How to Change Database URL

If you need to switch to a different database or update your connection:

### Method 1: Edit Configuration File
1. Open the `.env.local` file in any text editor
2. Find the line starting with `DATABASE_URL=`
3. Replace the entire URL with your new database connection string
4. Save the file
5. Restart the application

### Method 2: Use a New Neon Database
1. Go to your Neon dashboard at [https://neon.tech](https://neon.tech)
2. Create a new project or use an existing one
3. Copy the new connection string
4. Update your `.env.local` file as described in Method 1

### Example Connection String Format:
```
DATABASE_URL=postgresql://username:password@hostname/database_name?sslmode=require
```

**Important:** Never share your database URL publicly - it contains your password!

---

## 🔐 Security Important Notes

### For Testing/Development:
- The default passwords are fine for local testing
- Your database is secure in the cloud with Neon

### For Production Use:
- **ALWAYS** change the default admin password
- Use strong, unique passwords
- Consider additional security measures
- Keep your `.env.local` file private

---

## 📱 Quick Access Links

When your application is running:

| What | Where to Go |
|------|-------------|
| Student Login | http://localhost:3000/auth/login |
| Admin Login | http://localhost:3000/admin/login |
| Main Page | http://localhost:3000 |
| Student Dashboard | http://localhost:3000/dashboard |
| Admin Dashboard | http://localhost:3000/admin/dashboard |

---

## � Checklist for First-Time Setup

- [ ] Node.js installed
- [ ] Neon account created
- [ ] Database project created in Neon
- [ ] Connection string copied
- [ ] `env.example` renamed to `.env.local`
- [ ] Database URL added to `.env.local`
- [ ] Application started successfully
- [ ] Can access http://localhost:3000
- [ ] Can login with default credentials

---

*This README is designed for non-technical users. If you're a developer looking for technical documentation, please refer to the code comments and API documentation.* 