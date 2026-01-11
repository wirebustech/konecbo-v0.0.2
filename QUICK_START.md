# 🚀 Quick Start Guide - Konecbo Authentication

Get up and running with Konecbo's hybrid authentication system in **5 minutes**!

## ⚡ Prerequisites Check

Before starting, ensure you have:

```bash
# Check Node.js (need v14+)
node --version

# Check PostgreSQL (need v12+)
psql --version

# Check npm
npm --version
```

If any are missing, install them first:
- **Node.js**: https://nodejs.org/
- **PostgreSQL**: https://www.postgresql.org/download/

## 🎯 5-Minute Setup

### Step 1: Create Database (2 minutes)

```bash
# Start PostgreSQL (if not running)
sudo systemctl start postgresql  # Linux
# OR
brew services start postgresql   # macOS

# Create database
sudo -u postgres psql -c "CREATE DATABASE konecbo_db;"

# Verify
sudo -u postgres psql -c "\l" | grep konecbo_db
```

### Step 2: Configure Backend (1 minute)

```bash
cd server

# Copy environment template
cp .env.example .env

# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Edit .env and paste the generated secret
nano .env  # or use your preferred editor
```

**Update these in `.env`:**
```env
DB_PASSWORD=your_postgres_password
JWT_SECRET=paste_generated_secret_here
```

### Step 3: Install & Initialize (2 minutes)

```bash
# Install backend dependencies
npm install

# Initialize database tables
npm run init-db

# Test connection
npm run test-db
```

You should see:
```
✅ Successfully connected to PostgreSQL database
✓ users
✓ user_profiles
✓ activity_logs
...
```

### Step 4: Start Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
# From project root
npm start
```

### Step 5: Test It! 🎉

1. Open http://localhost:3000
2. Navigate to Sign In page
3. Toggle between "SQL Database" and "Firebase"
4. Try registering a new account!

## 🧪 Quick Test

Test the API directly:

```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@konecbo.com",
    "password": "TestPass123",
    "fullName": "Test User"
  }'

# You should get back a JWT token!
```

## 📁 What Was Created?

```
konecbo-v0.0.2/
├── server/                    ← NEW! Backend API
│   ├── config/               ← Database config
│   ├── controllers/          ← Business logic
│   ├── middleware/           ← Auth middleware
│   ├── routes/               ← API routes
│   ├── scripts/              ← DB scripts
│   └── server.js             ← Main server
│
├── src/
│   ├── services/
│   │   └── authService.js    ← NEW! API client
│   └── pages/
│       └── SignInPageHybrid.jsx ← NEW! Hybrid sign-in
│
└── Documentation/
    ├── AUTHENTICATION_SETUP.md    ← Detailed setup
    ├── IMPLEMENTATION_SUMMARY.md  ← What was built
    ├── ARCHITECTURE.md            ← System design
    └── QUICK_START.md            ← This file!
```

## 🎨 Features You Can Now Use

### 1. **Email/Password Authentication**
- User registration with validation
- Secure login with JWT tokens
- Password hashing with bcrypt

### 2. **Google Sign-In**
- OAuth via Firebase
- Automatic account creation
- Stored in SQL database

### 3. **User Profiles**
- Complete KYC data storage
- Research profile management
- Activity logging

## 🔧 Common Commands

```bash
# Backend
cd server
npm run dev          # Start with auto-reload
npm start            # Start production mode
npm run init-db      # Initialize database
npm run test-db      # Test database connection

# Frontend
npm start            # Start React app
npm run build        # Build for production
npm test             # Run tests
```

## 🐛 Troubleshooting

### "Database connection failed"
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check credentials in server/.env
cat server/.env | grep DB_
```

### "Port 5000 already in use"
```bash
# Find and kill the process
lsof -i :5000
kill -9 <PID>

# Or change port in server/.env
PORT=5001
```

### "CORS error"
Make sure backend is running and `CLIENT_URL` in `server/.env` is correct:
```env
CLIENT_URL=http://localhost:3000
```

### "JWT token invalid"
Clear browser localStorage:
```javascript
// In browser console
localStorage.clear()
```

## 📚 Next Steps

1. **Read the docs:**
   - `AUTHENTICATION_SETUP.md` - Complete setup guide
   - `ARCHITECTURE.md` - System architecture
   - `server/README.md` - API documentation

2. **Customize:**
   - Update branding in `SignInPageHybrid.jsx`
   - Add custom validation rules
   - Extend user profile fields

3. **Deploy:**
   - Set up production database
   - Configure HTTPS
   - Deploy to Azure/AWS/Heroku

## 🎓 Learning Resources

- **JWT**: https://jwt.io/introduction
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Express**: https://expressjs.com/
- **React**: https://react.dev/

## ✅ Verification Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `konecbo_db` created
- [ ] Backend dependencies installed
- [ ] Database tables initialized
- [ ] Backend server running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Google Sign-In works
- [ ] JWT token stored in localStorage

## 🆘 Need Help?

1. Check server logs in terminal
2. Check browser console for errors
3. Review `AUTHENTICATION_SETUP.md` for detailed troubleshooting
4. Verify all environment variables are set

## 🎉 Success!

If you can:
- ✅ Register a new account
- ✅ Login with email/password
- ✅ Login with Google
- ✅ See your profile data

**Congratulations!** Your hybrid authentication system is working! 🎊

---

**Time to complete**: ~5 minutes  
**Difficulty**: Beginner-friendly  
**Support**: See `AUTHENTICATION_SETUP.md` for detailed help

Happy coding! 🚀
