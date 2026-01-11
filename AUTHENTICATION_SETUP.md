# Konecbo Authentication Setup Guide

This guide will help you set up the hybrid authentication system (SQL Database + Google Sign-In) for Konecbo.

## Overview

Konecbo now supports **two authentication methods**:

1. **SQL Database Authentication** (Email/Password) - NEW ✨
2. **Google Sign-In** (OAuth) - Integrated with SQL backend

Both methods store user data in a PostgreSQL database for consistency and better data management.

## Prerequisites

Before you begin, ensure you have:

- ✅ Node.js (v14 or higher)
- ✅ PostgreSQL (v12 or higher)
- ✅ npm or yarn
- ✅ Git

## Step-by-Step Setup

### 1. Install PostgreSQL

#### On Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### On macOS:
```bash
brew install postgresql
brew services start postgresql
```

#### On Windows:
Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

### 2. Create Database

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database
CREATE DATABASE konecbo_db;

# Create user (optional, or use default postgres user)
CREATE USER konecbo_admin WITH PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE konecbo_db TO konecbo_admin;

# Exit
\q
```

### 3. Backend Setup

#### Install Dependencies

```bash
cd server
npm install
```

#### Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual values
nano .env
```

Update the `.env` file:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=konecbo_db
DB_USER=postgres
DB_PASSWORD=your_actual_password_here

# JWT Configuration (CHANGE THIS!)
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:3000

# Firebase (for Google Sign-In)
FIREBASE_PROJECT_ID=syntellect-9ca3e
```

**Important**: Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Initialize Database

```bash
npm run init-db
```

You should see:
```
✅ Connected to PostgreSQL database
🔄 Creating database tables...
✅ Database tables created successfully!
✅ Database triggers created successfully!
🎉 Database initialization complete!
```

#### Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

You should see:
```
🚀 Konecbo API server running on port 5000
📍 Environment: development
🌐 Client URL: http://localhost:3000
✅ Connected to PostgreSQL database
```

### 4. Frontend Setup

#### Install Dependencies (if not already done)

```bash
cd ..  # Go back to root directory
npm install
```

#### Configure Environment

Create a `.env` file in the root directory:

```bash
# In /home/oputa/konecbo-v0.0.2/
touch .env
```

Add the following:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### Update Routes (Optional)

If you want to use the new hybrid sign-in page, update your routes in `App.js` or wherever routes are defined:

```javascript
import SignInPageHybrid from './pages/SignInPageHybrid';

// In your routes:
<Route path="/signin" element={<SignInPageHybrid />} />
```

### 5. Test the Setup

#### Test Backend API

```bash
# Health check
curl http://localhost:5000/api/health

# Expected response:
{
  "success": true,
  "message": "Konecbo API is running",
  "timestamp": "2026-01-11T..."
}
```

#### Test Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123",
    "fullName": "Test User"
  }'
```

#### Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'
```

### 6. Run the Application

#### Terminal 1: Backend Server
```bash
cd server
npm run dev
```

#### Terminal 2: Frontend Application
```bash
npm start
```

The application should open at `http://localhost:3000`

## Usage

### Sign Up Flow

1. Navigate to `/signup`
2. Choose authentication method:
   - **Email/Password**: Fill in email, password, and complete KYC form
   - **Google Sign-In**: Click "Continue with Google" and complete KYC form

### Sign In Flow

1. Navigate to `/signin`
2. Toggle between "SQL Database" or "Firebase" (legacy)
3. For SQL Database:
   - Enter email and password
   - Click "Sign In"
4. For Google:
   - Click "Continue with Google"
   - Authenticate with Google account

## Database Schema

### Users Table
Stores basic authentication information:
- Email, password hash, full name
- Authentication provider (email/google)
- Role (researcher/reviewer/admin)
- Account status and timestamps

### User Profiles Table
Stores detailed KYC information:
- Research profile (position, institution, discipline)
- Academic background (degrees, publications)
- Collaboration preferences
- Social links and bio

### Activity Logs Table
Tracks all user actions:
- Login/logout events
- Profile updates
- IP addresses and user agents

## Security Best Practices

1. **Never commit `.env` files** - They contain sensitive credentials
2. **Use strong JWT secrets** - Minimum 32 characters
3. **Enable HTTPS in production** - Use SSL/TLS certificates
4. **Implement rate limiting** - Prevent brute force attacks
5. **Regular database backups** - Protect user data
6. **Input validation** - Already implemented with express-validator
7. **Password requirements** - Minimum 8 characters, mixed case, numbers

## Troubleshooting

### Database Connection Failed

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -U postgres -d konecbo_db -c "SELECT 1;"
```

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change PORT in .env
```

### CORS Errors

Make sure `CLIENT_URL` in server `.env` matches your frontend URL:
```env
CLIENT_URL=http://localhost:3000
```

### JWT Token Errors

1. Check if `JWT_SECRET` is set in `.env`
2. Clear browser localStorage
3. Try logging in again

### Google Sign-In Not Working

1. Verify Firebase configuration in `src/config/firebaseConfig.js`
2. Check if Google provider is enabled in Firebase Console
3. Ensure authorized domains include `localhost`

## Migration from Firebase

If you have existing Firebase users and want to migrate:

1. Export user data from Firebase
2. Create a migration script to import into PostgreSQL
3. Hash passwords if migrating password users
4. Update `uid` field to match Firebase UIDs

## Production Deployment

### Environment Variables

Update for production:

```env
NODE_ENV=production
DB_HOST=your-production-db-host
DB_PASSWORD=strong-production-password
JWT_SECRET=very-strong-production-secret
CLIENT_URL=https://your-production-domain.com
```

### Database

1. Use managed PostgreSQL (AWS RDS, Azure Database, etc.)
2. Enable SSL connections
3. Set up automated backups
4. Configure connection pooling

### Security

1. Enable HTTPS
2. Set up firewall rules
3. Implement rate limiting
4. Enable database encryption
5. Regular security audits

## API Documentation

Full API documentation available in `server/README.md`

### Key Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/google-auth` - Google authentication
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `POST /api/auth/logout` - Logout (protected)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review server logs: `server/logs/` (if configured)
3. Check database logs: `sudo journalctl -u postgresql`
4. Review browser console for frontend errors

## Next Steps

- [ ] Implement email verification
- [ ] Add password reset functionality
- [ ] Set up rate limiting
- [ ] Add refresh tokens
- [ ] Implement 2FA (Two-Factor Authentication)
- [ ] Add social login (GitHub, LinkedIn)
- [ ] Set up monitoring and logging

---

**Congratulations!** 🎉 You now have a fully functional hybrid authentication system with SQL database and Google Sign-In support!
