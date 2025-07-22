# JCU Gym Management System

A web application for managing gym memberships, bookings, and administration at James Cook University Singapore campus.

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- npm (comes with Node.js)
- Supabase account (for database)

### Database Setup
1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project
3. Copy your database credentials from the project settings
4. Update `.env.local` with your credentials

### Running the Application

#### Windows Users
```powershell
# Run the start script
./start.ps1
```

#### Mac/Linux Users
```bash
# Make the script executable
chmod +x start.sh

# Run the start script
./start.sh
```

The application will be available at: http://localhost:3000

## 👤 Default Login Credentials

### Admin Account
- **Email:** admin@my.jcu.edu.au
- **Password:** admin123
- **URL:** http://localhost:3000/admin/login

### Demo Student Account
- **Email:** demo@my.jcu.edu.au
- **Password:** demo123
- **URL:** http://localhost:3000/auth/login

## 🎯 Features

### For Students
- Book gym sessions
- View and manage bookings
- Track fitness progress
- Receive notifications
- Manage membership

### For Administrators
- Manage user registrations
- Track gym usage
- View booking statistics
- Send announcements
- Manage sessions

## 🔧 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   npm run dev -- --port 3001
   ```

2. **Dependencies Issues**
   ```bash
   # Remove node_modules and reinstall
   rm -rf node_modules
   npm install
   ```

3. **Database Connection Error**
   - Check if `.env.local` exists
   - Verify your Supabase credentials in `.env.local`
   - Make sure your IP is allowed in Supabase dashboard
   - Run `npm run db:test` to check connection
   - Check Supabase dashboard for database status

### Getting Help
- Check error messages in the console
- Look for solutions in the error output
- Check Supabase status page
- Contact system administrator if issues persist

## 📱 Access Points

- **Student Portal:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3000/admin/login
- **User Login:** http://localhost:3000/auth/login

## 🛑 Stopping the Server

Press `Ctrl+C` in the terminal to stop the server.

## 🔐 Security Note

The default credentials are for testing only. In a production environment:
- Change all default passwords
- Use secure environment variables
- Enable proper authentication
- Set up SSL/TLS

## 📚 Additional Resources

For more detailed information:
- [Cloud Database Setup](./CLOUD_DATABASE_SETUP.md)
- [Node.js Documentation](https://nodejs.org/docs)
- [Next.js Documentation](https://nextjs.org/docs) 