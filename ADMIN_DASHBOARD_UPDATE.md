# Admin Dashboard - Hybrid SQL & Firebase Integration

## 🎯 Overview
The Admin Dashboard has been updated to support **hybrid data sources**, displaying users from both the **SQL database** (new users) and **Firebase** (legacy users) in a unified interface.

## 🚀 What's New

### Backend API Endpoints (`/api/admin/*`)
Created comprehensive admin API endpoints for SQL database management:

1. **GET `/api/admin/users`** - Fetch all SQL users with profile data
2. **GET `/api/admin/stats`** - Get dashboard statistics (user counts, role breakdown, activity)
3. **PUT `/api/admin/users/:id/role`** - Update user role with audit logging
4. **DELETE `/api/admin/users/:id`** - Delete a user account
5. **GET `/api/admin/logs`** - Fetch activity logs with filtering

### Frontend Updates

#### Dashboard (`src/pages/Admin/Dashboard.jsx`)
- **Hybrid Data Fetching**: Merges data from SQL and Firebase
- **New Metrics**:
  - Total Users (SQL + Firebase combined)
  - SQL Users (new sign-ups)
  - Firebase Users (legacy accounts)
  - Unified login/logout tracking
- **Smart Engagement Chart**: Combines activity logs from both sources

#### Admin Service (`src/services/adminService.js`)
- Axios-based API client for admin endpoints
- Automatic JWT token injection
- Error handling with auto-redirect on 401

### Security Features
- **JWT Authentication**: All admin routes require valid token
- **Role-Based Access**: Middleware enforces admin role
- **Audit Logging**: Role changes and deletions are logged
- **CORS Protection**: Configured for secure cross-origin requests

## 📊 Dashboard Metrics

The dashboard now shows:
- **Total Users**: Combined count from SQL + Firebase
- **SQL Users**: Users registered via new sign-up flow
- **Firebase Users**: Legacy users from original system
- **Logins/Logouts**: Aggregated from both databases
- **Listings Posted**: Research listings count
- **Reviewer Applications**: In-progress applications
- **7-Day Engagement**: Activity logs from both sources

## 🔧 Files Created/Modified

### Backend
- ✅ `server/controllers/adminController.js` (New)
- ✅ `server/routes/adminRoutes.js` (New)
- ✅ `server/middleware/auth.js` (New)
- ✅ `server/server.js` (Updated - added admin routes)

### Frontend
- ✅ `src/services/adminService.js` (New)
- ✅ `src/pages/Admin/Dashboard.jsx` (Updated - hybrid data)

## 🛠️ Setup Instructions

### 1. Database Setup
Ensure PostgreSQL is running and the database is initialized:
```bash
cd server
npm run init-db
```

### 2. Start Backend Server
```bash
cd server
npm run dev
```

### 3. Access Admin Dashboard
1. Sign in as an admin user
2. Navigate to `/admin`
3. View unified dashboard with SQL + Firebase data

## 🔐 Admin Access

To access admin features, your user account must have `role = 'admin'` in the SQL database.

You can manually set this via SQL:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

## 📝 API Usage Examples

### Get All Users
```javascript
import adminService from './services/adminService';

const users = await adminService.getAllUsers();
console.log(users); // { success: true, users: [...], count: 10 }
```

### Get Dashboard Stats
```javascript
const stats = await adminService.getDashboardStats();
console.log(stats.stats.totalUsers); // 150
```

### Update User Role
```javascript
await adminService.updateUserRole(userId, 'reviewer', 'Promoted to reviewer');
```

## 🎨 UI Features

- **Responsive Design**: Works on desktop and mobile
- **Hover Effects**: Cards animate on hover
- **Loading States**: Shows loading indicator while fetching
- **Error Handling**: Graceful fallback if SQL unavailable
- **Real-time Data**: Fetches fresh data on each visit

## 🔄 Data Flow

```
Frontend (Dashboard)
    ↓
    ├─→ adminService.getDashboardStats() → SQL Database
    │   (New users, activity logs)
    │
    └─→ Firebase getDocs() → Firestore
        (Legacy users, listings, reviewers)
    ↓
Merge & Display
```

## 🚨 Important Notes

1. **Backward Compatible**: Firebase data still works for legacy users
2. **Gradual Migration**: New users go to SQL, old users remain in Firebase
3. **Admin Role Required**: All admin endpoints check for admin role
4. **JWT Required**: Must be signed in to access admin features
5. **Activity Logs**: Both SQL and Firebase logs are combined for analytics

## 🔮 Next Steps

Consider updating:
- **ManageResearchers.jsx** - Show SQL users alongside Firebase users
- **ManageAdmins.jsx** - Hybrid admin management
- **ManageReviewers.jsx** - Unified reviewer management
- **ViewLogs.jsx** - Combined activity log viewer

---

**Status**: ✅ Complete & Ready to Use
