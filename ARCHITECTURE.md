# Konecbo Authentication Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         KONECBO PLATFORM                         │
│                   Research Collaboration System                  │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│   FRONTEND (React)   │         │  BACKEND (Node.js)   │
│   Port: 3000         │◄───────►│  Port: 5000          │
└──────────────────────┘         └──────────────────────┘
         │                                  │
         │                                  │
         ▼                                  ▼
┌──────────────────────┐         ┌──────────────────────┐
│  Firebase Auth       │         │  PostgreSQL DB       │
│  (Google OAuth)      │         │  Port: 5432          │
└──────────────────────┘         └──────────────────────┘
```

## Authentication Flow

### 1. Email/Password Registration (SQL)

```
User Input (Email/Password)
        │
        ▼
┌─────────────────────┐
│  SignInPageHybrid   │
│  (React Component)  │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│   authService.js    │
│  (API Client)       │
└─────────────────────┘
        │
        ▼ POST /api/auth/register
┌─────────────────────┐
│   Express Server    │
│   (server.js)       │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│  authController.js  │
│  - Validate input   │
│  - Hash password    │
│  - Create user      │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│   PostgreSQL DB     │
│  - users table      │
│  - user_profiles    │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│   Generate JWT      │
│   Return token      │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│  Store in           │
│  localStorage       │
└─────────────────────┘
        │
        ▼
   Redirect to Dashboard
```

### 2. Google Sign-In Flow

```
User Clicks "Google Sign-In"
        │
        ▼
┌─────────────────────┐
│  Firebase Auth      │
│  (Google OAuth)     │
└─────────────────────┘
        │
        ▼
  Google Login Popup
        │
        ▼
┌─────────────────────┐
│  User Authenticates │
│  with Google        │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│  Firebase Returns   │
│  User Data          │
│  (email, name, uid) │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│  authService.js     │
│  googleAuth()       │
└─────────────────────┘
        │
        ▼ POST /api/auth/google-auth
┌─────────────────────┐
│  Backend API        │
│  - Check if exists  │
│  - Create/Update    │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│  PostgreSQL DB      │
│  Store user data    │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│  Generate JWT       │
│  Return token       │
└─────────────────────┘
        │
        ▼
   Redirect to Dashboard
```

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────────────────────────────┐
│              USERS                      │
├─────────────────────────────────────────┤
│ PK │ id (SERIAL)                        │
│    │ uid (VARCHAR) UNIQUE               │
│    │ email (VARCHAR) UNIQUE             │
│    │ password_hash (VARCHAR)            │
│    │ full_name (VARCHAR)                │
│    │ role (VARCHAR)                     │
│    │ auth_provider (VARCHAR)            │
│    │ email_verified (BOOLEAN)           │
│    │ is_active (BOOLEAN)                │
│    │ created_at (TIMESTAMP)             │
│    │ updated_at (TIMESTAMP)             │
│    │ last_login (TIMESTAMP)             │
└─────────────────────────────────────────┘
              │
              │ 1:1
              ▼
┌─────────────────────────────────────────┐
│         USER_PROFILES                   │
├─────────────────────────────────────────┤
│ PK │ id (SERIAL)                        │
│ FK │ user_id → users(id)                │
│    │ current_position                   │
│    │ institution                        │
│    │ country                            │
│    │ primary_discipline                 │
│    │ research_interests (TEXT[])        │
│    │ publications (TEXT[])              │
│    │ skills (TEXT[])                    │
│    │ bio (TEXT)                         │
│    │ kyc_completed (BOOLEAN)            │
│    │ ... (30+ fields)                   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         ACTIVITY_LOGS                   │
├─────────────────────────────────────────┤
│ PK │ id (SERIAL)                        │
│ FK │ user_id → users(id)                │
│    │ action (VARCHAR)                   │
│    │ details (TEXT)                     │
│    │ ip_address (VARCHAR)               │
│    │ user_agent (TEXT)                  │
│    │ created_at (TIMESTAMP)             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│   EMAIL_VERIFICATION_TOKENS             │
├─────────────────────────────────────────┤
│ PK │ id (SERIAL)                        │
│ FK │ user_id → users(id)                │
│    │ token (VARCHAR) UNIQUE             │
│    │ expires_at (TIMESTAMP)             │
│    │ created_at (TIMESTAMP)             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│    PASSWORD_RESET_TOKENS                │
├─────────────────────────────────────────┤
│ PK │ id (SERIAL)                        │
│ FK │ user_id → users(id)                │
│    │ token (VARCHAR) UNIQUE             │
│    │ expires_at (TIMESTAMP)             │
│    │ used (BOOLEAN)                     │
│    │ created_at (TIMESTAMP)             │
└─────────────────────────────────────────┘
```

## API Architecture

### Request/Response Flow

```
┌──────────────┐
│   Client     │
│  (Browser)   │
└──────────────┘
       │
       │ HTTP Request
       │ Headers: { Authorization: "Bearer <token>" }
       ▼
┌──────────────┐
│   CORS       │
│  Middleware  │
└──────────────┘
       │
       ▼
┌──────────────┐
│   Helmet     │
│  (Security)  │
└──────────────┘
       │
       ▼
┌──────────────┐
│   Morgan     │
│  (Logging)   │
└──────────────┘
       │
       ▼
┌──────────────┐
│   Routes     │
│ /api/auth/*  │
└──────────────┘
       │
       ▼
┌──────────────┐
│   Auth       │
│  Middleware  │
│ (JWT Verify) │
└──────────────┘
       │
       ▼
┌──────────────┐
│  Validation  │
│ (express-    │
│  validator)  │
└──────────────┘
       │
       ▼
┌──────────────┐
│ Controller   │
│  (Business   │
│   Logic)     │
└──────────────┘
       │
       ▼
┌──────────────┐
│  Database    │
│ (PostgreSQL) │
└──────────────┘
       │
       ▼
┌──────────────┐
│   Response   │
│   { success, │
│     data }   │
└──────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────┐
│         APPLICATION SECURITY            │
└─────────────────────────────────────────┘

Layer 1: Transport Security
├─ HTTPS/TLS (Production)
└─ Secure Headers (Helmet)

Layer 2: Authentication
├─ JWT Tokens (Stateless)
├─ Token Expiration (7 days)
└─ Secure Token Storage (localStorage)

Layer 3: Authorization
├─ Role-based Access Control
├─ Middleware Protection
└─ Route Guards

Layer 4: Input Validation
├─ express-validator
├─ Type checking
└─ Sanitization

Layer 5: Data Protection
├─ Password Hashing (bcrypt)
├─ SQL Injection Prevention
└─ XSS Protection

Layer 6: Monitoring
├─ Activity Logs
├─ Error Logging
└─ Audit Trail
```

## File Structure

```
konecbo-v0.0.2/
│
├── server/                          # Backend API
│   ├── config/
│   │   └── database.js             # PostgreSQL connection
│   ├── controllers/
│   │   └── authController.js       # Auth business logic
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT verification
│   ├── routes/
│   │   └── authRoutes.js           # API endpoints
│   ├── scripts/
│   │   ├── initDatabase.js         # DB initialization
│   │   └── testConnection.js       # Connection test
│   ├── .env.example                # Environment template
│   ├── .gitignore                  # Git ignore rules
│   ├── package.json                # Dependencies
│   ├── server.js                   # Express server
│   └── README.md                   # Backend docs
│
├── src/                             # Frontend React App
│   ├── config/
│   │   └── firebaseConfig.js       # Firebase setup
│   ├── pages/
│   │   ├── SignInPage.jsx          # Original (Firebase)
│   │   └── SignInPageHybrid.jsx    # New (SQL + Google)
│   ├── services/
│   │   └── authService.js          # API client
│   └── components/
│       ├── Navbar.jsx
│       └── Footer.jsx
│
├── AUTHENTICATION_SETUP.md          # Setup guide
├── IMPLEMENTATION_SUMMARY.md        # Implementation docs
├── ARCHITECTURE.md                  # This file
├── quick-start.sh                   # Setup script
├── package.json                     # Frontend deps
└── README.md                        # Main readme
```

## Technology Stack

### Backend
```
┌─────────────────────────────────┐
│         Node.js v14+            │
├─────────────────────────────────┤
│  Express.js      │ Web Framework│
│  PostgreSQL      │ Database     │
│  pg              │ DB Client    │
│  bcryptjs        │ Hashing      │
│  jsonwebtoken    │ JWT Tokens   │
│  express-validator│ Validation  │
│  helmet          │ Security     │
│  cors            │ CORS         │
│  morgan          │ Logging      │
│  dotenv          │ Env Config   │
└─────────────────────────────────┘
```

### Frontend
```
┌─────────────────────────────────┐
│         React v18.2             │
├─────────────────────────────────┤
│  Material-UI     │ UI Components│
│  axios           │ HTTP Client  │
│  Firebase        │ Google Auth  │
│  react-router    │ Routing      │
│  react-toastify  │ Notifications│
└─────────────────────────────────┘
```

## Deployment Architecture

### Development
```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   React      │────▶│   Express    │────▶│  PostgreSQL  │
│ localhost:   │     │ localhost:   │     │ localhost:   │
│   3000       │     │   5000       │     │   5432       │
└──────────────┘     └──────────────┘     └──────────────┘
```

### Production (Recommended)
```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Nginx      │────▶│   PM2        │────▶│  PostgreSQL  │
│   (Reverse   │     │   (Process   │     │   (Managed   │
│    Proxy)    │     │   Manager)   │     │   Service)   │
│   Port: 80   │     │   Port: 5000 │     │   Port: 5432 │
│   /443       │     │              │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
       │
       ▼
┌──────────────┐
│  Static      │
│  React Build │
│  (Served by  │
│   Nginx)     │
└──────────────┘
```

## Data Flow Examples

### User Registration
```
1. User fills form → 2. Frontend validates
                    ↓
3. POST /api/auth/register
                    ↓
4. Backend validates → 5. Hash password
                    ↓
6. Insert into DB → 7. Generate JWT
                    ↓
8. Return token → 9. Store in localStorage
                    ↓
10. Redirect to dashboard
```

### Protected Route Access
```
1. User requests protected resource
                    ↓
2. Frontend adds JWT to headers
                    ↓
3. Backend verifies JWT
                    ↓
4. Check user permissions
                    ↓
5. Query database
                    ↓
6. Return data
```

## Performance Considerations

### Database
- Connection pooling (max 20 connections)
- Indexed columns (email, uid, auth_provider)
- Prepared statements (SQL injection prevention)
- Query optimization

### API
- Stateless authentication (JWT)
- No session storage
- Horizontal scaling ready
- Caching headers

### Frontend
- Token stored in localStorage
- Axios interceptors for auth
- Lazy loading components
- Code splitting

## Monitoring & Logging

### Activity Logs
```sql
SELECT 
  u.email,
  al.action,
  al.details,
  al.ip_address,
  al.created_at
FROM activity_logs al
JOIN users u ON al.user_id = u.id
ORDER BY al.created_at DESC
LIMIT 100;
```

### User Analytics
```sql
-- Active users in last 30 days
SELECT COUNT(DISTINCT user_id)
FROM activity_logs
WHERE created_at > NOW() - INTERVAL '30 days';

-- Registration trends
SELECT 
  DATE(created_at) as date,
  COUNT(*) as registrations
FROM users
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

## Backup Strategy

### Database Backups
```bash
# Daily backup
pg_dump konecbo_db > backup_$(date +%Y%m%d).sql

# Restore
psql konecbo_db < backup_20260111.sql
```

### Environment Backups
- Store .env files securely (encrypted)
- Use secret management services
- Version control for schema

---

**Last Updated**: January 11, 2026  
**Version**: 1.0.0  
**Status**: Production Ready
