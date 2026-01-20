# Azure Environment Variables - Exact Input Format

## 🔴 CRITICAL: "Basic Authentication is disabled" Error
If you cannot download the publish profile, you must enable Basic Auth:
1. Go to **Azure Portal** → **Your Web App** → **Configuration** → **General settings**.
2. Set **SCM Basic Auth Publishing Credentials** to **On**.
3. Click **Save**.

---


## 📝 How to Input in Azure Portal

Go to: **Azure Portal → Your Web App → Configuration → Application settings → + New application setting**

For each variable below, click "+ New application setting" and enter:

---

## 🔴 REQUIRED VARIABLES (Must Set All 5)

### Variable 1: Database Connection
```
Name: DATABASE_URL
Value: postgresql://konecboadmin:YOUR_PASSWORD@YOUR_DB_HOST.postgres.database.azure.com:5432/konecbo?sslmode=require
```

**Replace:**
- `YOUR_PASSWORD` with your actual PostgreSQL password
- `YOUR_DB_HOST` with your PostgreSQL server name (e.g., `konecbo-db`)

**Example:**
```
Name: DATABASE_URL
Value: postgresql://konecboadmin:SecurePass123!@konecbo-db.postgres.database.azure.com:5432/konecbo?sslmode=require
```

---

### Variable 2: JWT Secret
```
Name: JWT_SECRET
Value: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4
```

**How to generate the value:**
1. Open terminal/command prompt
2. Run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. Copy the output
4. Paste as the Value

**Example output:**
```
Name: JWT_SECRET
Value: 8f3a9c2e1d5b7a4f6e8c0d2b9a7e5c3f1a8d6b4e2c0f9a7e5d3b1c8f6a4e2
```

---

### Variable 3: Node Environment
```
Name: NODE_ENV
Value: production
```

**Exactly as shown** - no changes needed

---

### Variable 4: Client URL
```
Name: CLIENT_URL
Value: https://YOUR_APP_NAME.azurewebsites.net
```

**Replace:**
- `YOUR_APP_NAME` with your actual Azure Web App name

**Example:**
```
Name: CLIENT_URL
Value: https://konecbo-app.azurewebsites.net
```

**Or if using custom domain:**
```
Name: CLIENT_URL
Value: https://www.konecbo.com
```

---

### Variable 5: Server Port
```
Name: PORT
Value: 8080
```

**Exactly as shown** - no changes needed

---

## 🟡 OPTIONAL - Firebase Variables (Only if using Firebase)

### Variable 6: Firebase API Key
```
Name: REACT_APP_FIREBASE_API_KEY
Value: AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Where to find:**
Firebase Console → Project Settings → General → Your apps → Config

---

### Variable 7: Firebase Auth Domain
```
Name: REACT_APP_FIREBASE_AUTH_DOMAIN
Value: your-project-id.firebaseapp.com
```

---

### Variable 8: Firebase Project ID
```
Name: REACT_APP_FIREBASE_PROJECT_ID
Value: your-project-id
```

---

### Variable 9: Firebase Storage Bucket
```
Name: REACT_APP_FIREBASE_STORAGE_BUCKET
Value: your-project-id.appspot.com
```

---

### Variable 10: Firebase Messaging Sender ID
```
Name: REACT_APP_FIREBASE_MESSAGING_SENDER_ID
Value: 123456789012
```

---

### Variable 11: Firebase App ID
```
Name: REACT_APP_FIREBASE_APP_ID
Value: 1:123456789012:web:abcdef1234567890abcdef
```

---

## 🟢 RECOMMENDED - API URL

### Variable 12: API URL
```
Name: REACT_APP_API_URL
Value: https://YOUR_APP_NAME.azurewebsites.net/api
```

**Replace:**
- `YOUR_APP_NAME` with your actual Azure Web App name

**Example:**
```
Name: REACT_APP_API_URL
Value: https://konecbo-app.azurewebsites.net/api
```

---

## 📋 Complete Example Setup

Here's a complete example with actual values (you'll need to replace with yours):

```
Name: DATABASE_URL
Value: postgresql://konecboadmin:MySecurePassword123!@konecbo-db.postgres.database.azure.com:5432/konecbo?sslmode=require

Name: JWT_SECRET
Value: 8f3a9c2e1d5b7a4f6e8c0d2b9a7e5c3f1a8d6b4e2c0f9a7e5d3b1c8f6a4e2

Name: NODE_ENV
Value: production

Name: CLIENT_URL
Value: https://konecbo-app.azurewebsites.net

Name: PORT
Value: 8080
```

---

## ⚙️ Step-by-Step Input Process

### In Azure Portal:

1. **Navigate to Configuration**
   - Azure Portal → Your Web App → Configuration

2. **For Each Variable:**
   - Click **"+ New application setting"**
   - **Name field**: Enter the exact name (e.g., `DATABASE_URL`)
   - **Value field**: Enter the value (e.g., your connection string)
   - Click **"OK"**

3. **After Adding All Variables:**
   - Click **"Save"** button at the top
   - Click **"Continue"** when prompted
   - Wait for app to restart (30-60 seconds)

---

## ✅ Verification

After saving, you should see all variables listed like this:

```
DATABASE_URL          postgresql://konecboadmin:***@konecbo-db.postgres...
JWT_SECRET            ************************************************
NODE_ENV              production
CLIENT_URL            https://konecbo-app.azurewebsites.net
PORT                  8080
```

**Note:** Azure hides sensitive values with asterisks for security.

---

## 🎯 Quick Checklist

Before clicking "Save", verify:

- [ ] DATABASE_URL includes `?sslmode=require` at the end
- [ ] JWT_SECRET is at least 32 characters long
### Error: "getaddrinfo ENOTFOUND"
**Reason:** The application cannot find your database server.
**Fix:**
1. Go to **Azure Portal** -> **Your Web App** -> **Configuration**.
2. Find the `DB_HOST` (or `DATABASE_URL`) setting.
3. **Current Status**: It is using the default placeholder `konecbo-db.postgres.database.azure.com`.
4. **Action**: Update the value to your **ACTUAL** PostgreSQL server hostname.
   - Example: `my-real-db-server.postgres.database.azure.com`
5. Save and Restart.
- [ ] NODE_ENV is exactly `production` (lowercase)
- [ ] CLIENT_URL starts with `https://`
- [ ] CLIENT_URL matches your actual Azure app name
- [ ] PORT is `8080`
- [ ] No extra spaces before or after values
- [ ] All required variables are present

---

## 🚨 Common Mistakes to Avoid

❌ **Wrong:**
```
Name: DATABASE_URL
Value: postgresql://user:pass@host:5432/db
```
Missing `?sslmode=require`

✅ **Correct:**
```
Name: DATABASE_URL
Value: postgresql://user:pass@host:5432/db?sslmode=require
```

---

❌ **Wrong:**
```
Name: CLIENT_URL
Value: konecbo-app.azurewebsites.net
```
Missing `https://`

✅ **Correct:**
```
Name: CLIENT_URL
Value: https://konecbo-app.azurewebsites.net
```

---

❌ **Wrong:**
```
Name: NODE_ENV
Value: Production
```
Wrong capitalization

✅ **Correct:**
```
Name: NODE_ENV
Value: production
```

---

## 🔧 Need Help Getting Values?

### For DATABASE_URL:
1. Go to Azure Portal → Your PostgreSQL Server
2. Click "Connection strings"
3. Copy the connection string
4. Replace `{your_password}` with your actual password
5. Add `?sslmode=require` at the end

### For JWT_SECRET:
Run this in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### For CLIENT_URL:
1. Go to Azure Portal → Your Web App
2. Click "Overview"
3. Copy the "URL" shown
4. That's your CLIENT_URL

### For Firebase Values:
1. Go to Firebase Console
2. Click Project Settings (gear icon)
3. Scroll to "Your apps"
4. Copy each value from the config object

---

## 📞 Still Need Help?

If you're stuck on any variable:
1. Check the full guide: `AZURE_ENVIRONMENT_VARIABLES.md`
2. Review deployment checklist: `AZURE_DEPLOYMENT_CHECKLIST.md`
3. Check Azure logs for specific errors

---

**Ready to input?** Copy the Name:Value pairs above and paste them into Azure Portal!
