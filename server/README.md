# Konecbo Backend API

Backend server for Konecbo Research Collaboration Platform with SQL database authentication and Google Sign-In support.

## Features

- ✅ Email/Password Authentication
- ✅ Google Sign-In Integration
- ✅ JWT Token-based Authorization
- ✅ PostgreSQL Database
- ✅ User Profile Management (KYC)
- ✅ Activity Logging
- ✅ Secure Password Hashing
- ✅ Input Validation
- ✅ CORS Protection
- ✅ Security Headers (Helmet)

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Database Setup

Create a PostgreSQL database:

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE konecbo_db;

# Exit psql
\q
```

### 3. Environment Configuration

Create a `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Edit `.env` and update the values:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=konecbo_db
DB_USER=postgres
DB_PASSWORD=your_actual_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

### 4. Initialize Database

Run the database initialization script to create all tables:

```bash
npm run init-db
```

This will create:
- `users` table
- `user_profiles` table
- `activity_logs` table
- `email_verification_tokens` table
- `password_reset_tokens` table
- Necessary indexes and triggers

## Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will run on `http://localhost:5000` (or the PORT specified in .env)

## API Endpoints

### Authentication

#### Register with Email/Password
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "fullName": "John Doe"
}
```

#### Login with Email/Password
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

#### Google Authentication
```
POST /api/auth/google-auth
Content-Type: application/json

{
  "email": "user@gmail.com",
  "fullName": "John Doe",
  "googleId": "google-user-id",
  "photoURL": "https://..."
}
```

### Protected Routes (Require JWT Token)

#### Get User Profile
```
GET /api/auth/profile
Authorization: Bearer <jwt_token>
```

#### Update User Profile
```
PUT /api/auth/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "currentPosition": "PhD Student",
  "institution": "MIT",
  "primaryDiscipline": "Computer Science",
  ... (other profile fields)
}
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <jwt_token>
```

### Health Check
```
GET /api/health
```

## Database Schema

### Users Table
- `id` - Primary key
- `uid` - Unique identifier (for Firebase compatibility)
- `email` - User email (unique)
- `password_hash` - Hashed password (for email auth)
- `full_name` - User's full name
- `role` - User role (researcher, reviewer, admin)
- `auth_provider` - Authentication method (email, google)
- `email_verified` - Email verification status
- `is_active` - Account status
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp
- `last_login` - Last login timestamp

### User Profiles Table
- Complete KYC (Know Your Customer) data
- Research interests, publications, skills
- Collaboration preferences
- Academic background
- Social links

### Activity Logs Table
- User actions tracking
- IP addresses and user agents
- Timestamps for audit trail

## Security Features

1. **Password Hashing**: bcryptjs with salt rounds
2. **JWT Tokens**: Secure token-based authentication
3. **Input Validation**: express-validator for request validation
4. **SQL Injection Protection**: Parameterized queries
5. **CORS Protection**: Configured for specific client URL
6. **Security Headers**: Helmet middleware
7. **Rate Limiting**: (TODO: Add rate limiting)

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Success responses:

```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

## Development

### Project Structure

```
server/
├── config/
│   └── database.js          # PostgreSQL connection
├── controllers/
│   └── authController.js    # Authentication logic
├── middleware/
│   └── authMiddleware.js    # JWT verification
├── routes/
│   └── authRoutes.js        # API routes
├── scripts/
│   └── initDatabase.js      # Database initialization
├── .env.example             # Environment template
├── package.json
└── server.js                # Main server file
```

### Adding New Features

1. Create controller in `controllers/`
2. Create routes in `routes/`
3. Add middleware if needed in `middleware/`
4. Update database schema in `scripts/initDatabase.js`

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql
```

### Port Already in Use

Change the PORT in `.env` file or kill the process:

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

## License

Educational purposes only - COMS3003A Software Design course, University of the Witwatersrand, 2025.
