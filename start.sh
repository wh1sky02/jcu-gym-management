#!/bin/bash

echo "Starting JCU Gym Management System..."
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm is not installed!"
    exit 1
fi

# Display versions
echo "[OK] Node.js version: $(node --version)"
echo "[OK] npm version: $(npm --version)"
echo

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "[INFO] Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "[ERROR] Failed to install dependencies"
        exit 1
    fi
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "[INFO] Creating .env.local file..."
    cat > .env.local << EOL
DATABASE_URL=postgresql://postgres:Ko20l6ckCcOppeYM@db.trujadxwiwawipjkbduc.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://trujadxwiwawipjkbduc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
JWT_SECRET=jcu-gym-management-jwt-secret-change-in-production
EOL
    echo "[OK] Created .env.local file"
fi

# Start the server
echo
echo "[INFO] Starting development server..."
echo "[INFO] Server will be available at: http://localhost:3000"
echo
echo "Login Credentials:"
echo "   Admin - admin@my.jcu.edu.au / admin123"
echo "   Demo  - demo@my.jcu.edu.au / demo123"
echo
echo "Press Ctrl+C to stop the server"
echo "================================================"
echo

# Run the development server
npm run dev

# Check if server failed to start
if [ $? -ne 0 ]; then
    echo
    echo "[ERROR] Failed to start server"
    echo "Try these solutions:"
    echo "1. Make sure port 3000 is not in use"
    echo "2. Try running: npm run dev -- --port 3001"
    echo "3. Check for error messages above"
    exit 1
fi 