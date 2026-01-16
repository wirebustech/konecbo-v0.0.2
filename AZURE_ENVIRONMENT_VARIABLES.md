# Required Environment Variables for Konecbo v0.0.2 Azure Deployment

## 🔴 CRITICAL - Required for Application to Start

These variables MUST be set in Azure App Service Configuration → Application Settings:

### 1. DATABASE_URL
**Purpose:** PostgreSQL database connection string
**Format:** 
```
postgresql://username:password@hostname:5432/database_name?sslmode=require
```

**Example:**
```
postgresql://konecboadmin:YourPassword123@konecbo-db.postgres.database.azure.com:5432/konecbo?sslmode=require
```

**How to get it:**
- If using Azure PostgreSQL: Azure Portal → Your PostgreSQL Server → Connection strings
- If using ElephantSQL: Copy from dashboard
- If using Supabase: Settings → Database → Connection string

---

### 2. JWT_SECRET
**Purpose:** Secret key for JWT token generation and validation
**Format:** Random string (minimum 32 characters recommended)

**Example:**
```
your-super-secret-jwt-key-minimum-32-characters-long-change-this
```

**How to generate:**
```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 32

# Option 3: Manual (use a password generator)
# Generate a random 32+ character string
```

---

### 3. NODE_ENV
**Purpose:** Tells the application it's running in production
**Value:** 
```
production
```

---

### 4. CLIENT_URL
**Purpose:** Frontend URL for CORS and redirects
**Format:** Your Azure Web App URL

**Example:**
```
https://konecbo-app.azurewebsites.net
```

**Or if using custom domain:**
```
https://www.konecbo.com
```

---

### 5. PORT
**Purpose:** Port for the backend server (Azure sets this automatically, but good to specify)
**Value:**
```
8080
```

**Note:** Azure may override this with its own PORT variable, but setting it ensures consistency.

---

## 🟡 OPTIONAL - Firebase Integration (If Using Firebase Features)

If you're using Firebase for authentication or storage, add these:

### 6. REACT_APP_FIREBASE_API_KEY
```
AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 7. REACT_APP_FIREBASE_AUTH_DOMAIN
```
your-project.firebaseapp.com
```

### 8. REACT_APP_FIREBASE_PROJECT_ID
```
your-project-id
```

### 9. REACT_APP_FIREBASE_STORAGE_BUCKET
```
your-project.appspot.com
```

### 10. REACT_APP_FIREBASE_MESSAGING_SENDER_ID
```
123456789012
```

### 11. REACT_APP_FIREBASE_APP_ID
```
1:123456789012:web:abcdef1234567890
```

**Where to find these:**
- Firebase Console → Project Settings → General → Your apps → SDK setup and configuration

---

## 🟢 RECOMMENDED - For Production Features

### 12. REACT_APP_API_URL
**Purpose:** Backend API endpoint for frontend
**Value:**
```
https://konecbo-app.azurewebsites.net/api
```

**Note:** If frontend and backend are on the same domain, this might not be needed.

---

## 📋 Quick Copy-Paste Template for Azure

Go to Azure Portal → Your Web App → Configuration → Application settings

Click "+ New application setting" and add each of these:

```
Name: DATABASE_URL
Value: postgresql://konecboadmin:YOUR_PASSWORD@konecbo-db.postgres.database.azure.com:5432/konecbo?sslmode=require

Name: JWT_SECRET
Value: [Generate using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]

Name: NODE_ENV
Value: production

Name: CLIENT_URL
Value: https://YOUR_APP_NAME.azurewebsites.net

Name: PORT
Value: 8080
```

**If using Firebase, also add:**
```
Name: REACT_APP_FIREBASE_API_KEY
Value: [Your Firebase API Key]

Name: REACT_APP_FIREBASE_AUTH_DOMAIN
Value: [Your Firebase Auth Domain]

Name: REACT_APP_FIREBASE_PROJECT_ID
Value: [Your Firebase Project ID]

Name: REACT_APP_FIREBASE_STORAGE_BUCKET
Value: [Your Firebase Storage Bucket]

Name: REACT_APP_FIREBASE_MESSAGING_SENDER_ID
Value: [Your Firebase Sender ID]

Name: REACT_APP_FIREBASE_APP_ID
Value: [Your Firebase App ID]
```

---

## ⚙️ How to Set Environment Variables in Azure

### Method 1: Azure Portal (Recommended)

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Web App
3. Click **"Configuration"** in the left menu
4. Click **"Application settings"** tab
5. Click **"+ New application setting"**
6. Enter **Name** and **Value**
7. Click **"OK"**
8. Repeat for each variable
9. Click **"Save"** at the top
10. Click **"Continue"** to restart the app

### Method 2: Azure CLI

```bash
az webapp config appsettings set \
  --resource-group YOUR_RESOURCE_GROUP \
  --name YOUR_APP_NAME \
  --settings \
    DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require" \
    JWT_SECRET="your-secret-key" \
    NODE_ENV="production" \
    CLIENT_URL="https://your-app.azurewebsites.net" \
    PORT="8080"
```

---

## ✅ Verification Checklist

After setting environment variables:

- [ ] DATABASE_URL is set with correct credentials
- [ ] JWT_SECRET is set (32+ characters)
- [ ] NODE_ENV is set to "production"
- [ ] CLIENT_URL matches your Azure URL
- [ ] PORT is set to 8080
- [ ] Firebase variables set (if using Firebase)
- [ ] Clicked "Save" in Azure Configuration
- [ ] App restarted automatically
- [ ] Checked deployment logs for errors

---

## 🐛 Troubleshooting

### App won't start after setting variables?

**Check logs:**
```bash
az webapp log tail --resource-group YOUR_RG --name YOUR_APP
```

**Common issues:**

1. **DATABASE_URL format wrong**
   - Must include `?sslmode=require` at the end
   - Check username, password, hostname are correct
   - Ensure database name is correct

2. **JWT_SECRET too short**
   - Must be at least 32 characters
   - Use the generation command provided

3. **CLIENT_URL doesn't match**
   - Must be your actual Azure URL
   - Include `https://`
   - No trailing slash

4. **Forgot to click "Save"**
   - Variables won't apply until you save
   - App must restart after saving

---

## 🔒 Security Best Practices

1. **Never commit .env files to Git** ✅ (Already in .gitignore)
2. **Use strong JWT_SECRET** (32+ random characters)
3. **Rotate secrets periodically** (every 90 days recommended)
4. **Use Azure Key Vault** for sensitive data (advanced)
5. **Enable HTTPS only** in Azure settings
6. **Restrict database firewall** to Azure IPs only

---

## 📝 Summary

**Minimum required variables for successful deployment:**

| Variable | Required | Purpose |
|----------|----------|---------|
| DATABASE_URL | ✅ Yes | Database connection |
| JWT_SECRET | ✅ Yes | Authentication |
| NODE_ENV | ✅ Yes | Production mode |
| CLIENT_URL | ✅ Yes | CORS & redirects |
| PORT | ✅ Yes | Server port |
| Firebase vars | ⚠️ If using Firebase | Firebase features |
| REACT_APP_API_URL | 🟢 Recommended | API endpoint |

---

## 🎯 Next Steps After Setting Variables

1. **Save configuration** in Azure Portal
2. **Wait for app restart** (automatic)
3. **Check deployment logs** for success
4. **Initialize database**:
   ```bash
   az webapp ssh --resource-group YOUR_RG --name YOUR_APP
   cd server
   npm run init-db
   ```
5. **Test your application** at your Azure URL
6. **Create admin user** (if needed)

---

**Need help?** Check the deployment logs or review AZURE_DEPLOYMENT_CHECKLIST.md for detailed troubleshooting.
