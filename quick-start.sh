#!/bin/bash

# Konecbo Quick Start Script
# This script helps you set up the Konecbo application with SQL authentication

set -e  # Exit on error

echo "🚀 Konecbo Quick Start Setup"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if PostgreSQL is installed
echo "📋 Checking prerequisites..."
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed${NC}"
    echo "Please install PostgreSQL first:"
    echo "  Ubuntu/Debian: sudo apt install postgresql"
    echo "  macOS: brew install postgresql"
    exit 1
fi
echo -e "${GREEN}✅ PostgreSQL is installed${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✅ Node.js is installed ($(node --version))${NC}"

echo ""
echo "🔧 Setting up backend..."

# Navigate to server directory
cd server

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from template...${NC}"
    cp .env.example .env
    
    # Generate JWT secret
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    
    # Update .env with generated secret
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
    else
        # Linux
        sed -i "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
    fi
    
    echo -e "${GREEN}✅ Created .env file with generated JWT secret${NC}"
    echo -e "${YELLOW}⚠️  Please update database credentials in server/.env${NC}"
    echo ""
    read -p "Press Enter after updating .env file..."
fi

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

# Initialize database
echo "🗄️  Initializing database..."
echo "Please ensure PostgreSQL is running and database credentials in .env are correct"
read -p "Press Enter to continue..."

npm run init-db

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database initialized successfully${NC}"
else
    echo -e "${RED}❌ Database initialization failed${NC}"
    echo "Please check your database credentials in server/.env"
    exit 1
fi

# Go back to root
cd ..

# Setup frontend
echo ""
echo "🎨 Setting up frontend..."

# Create frontend .env if it doesn't exist
if [ ! -f .env ]; then
    echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
    echo -e "${GREEN}✅ Created frontend .env file${NC}"
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "🎉 Next steps:"
echo "1. Start the backend server:"
echo "   cd server && npm run dev"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   npm start"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For detailed documentation, see:"
echo "   - AUTHENTICATION_SETUP.md (complete setup guide)"
echo "   - server/README.md (backend API documentation)"
echo ""
