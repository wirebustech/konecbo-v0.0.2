# Azure Deployment Checklist for Konecbo

## 📋 Pre-Deployment Checklist

### ✅ **1. Code Preparation**
- [x] Code pushed to GitHub
- [x] README.md updated with platform information
- [x] Environment variables template created (`.env.azure.example`)
- [x] Web.config created for Azure App Service
- [x] GitHub Actions workflow configured
- [x] .gitignore properly configured

### ✅ **2. Azure Account Setup**
- [ ] Azure account created
- [ ] Subscription active
- [ ] Resource group created or planned
- [ ] Region selected (recommend: East US, West Europe, or Southeast Asia)

### ✅ **3. Database Preparation**
- [ ] PostgreSQL database provider chosen:
  - [ ] Azure Database for PostgreSQL, OR
  - [ ] External provider (ElephantSQL, Supabase, etc.)
- [ ] Database created
- [ ] Connection string obtained
- [ ] Database initialized with schema

---

## 🗄️ Step 1: Set Up PostgreSQL Database

### **Option A: Azure Database for PostgreSQL (Recommended)**

#### Via Azure Portal:
1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Azure Database for PostgreSQL"
4. Select "Flexible Server"
5. Configure:
   - **Server name**: `konecbo-db`
   - **Region**: Same as your web app
   - **PostgreSQL version**: 14 or 15
   - **Compute + storage**: Burstable, B1ms (1 vCore, 2 GB RAM) for testing
   - **Admin username**: `konecboadmin`
   - **Password**: Create a strong password
6. **Networking**:
   - Select "Public access"
   - Add firewall rule: "Allow Azure services" (0.0.0.0 - 0.0.0.0)
7. Click "Review + create"

#### Via Azure CLI:
```bash
# Login to Azure
az login

# Create PostgreSQL server
az postgres flexible-server create \
  --resource-group konecbo-rg \
  --name konecbo-db \
  --location eastus \
  --admin-user konecboadmin \
  --admin-password 'YourSecurePassword123!' \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 14 \
  --storage-size 32

# Create database
az postgres flexible-server db create \
  --resource-group konecbo-rg \
  --server-name konecbo-db \
  --database-name konecbo

# Configure firewall
az postgres flexible-server firewall-rule create \
  --resource-group konecbo-rg \
  --name konecbo-db \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

#### Get Connection String:
```
postgresql://konecboadmin:YourPassword@konecbo-db.postgres.database.azure.com:5432/konecbo?sslmode=require
```

### **Option B: External PostgreSQL Provider**

#### ElephantSQL (Free Tier Available):
1. Go to [ElephantSQL](https://www.elephantsql.com/)
2. Sign up and create a new instance
3. Select "Tiny Turtle" (free tier)
4. Copy the connection URL

#### Supabase (Free Tier Available):
1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string

---

## 🌐 Step 2: Create Azure Web App

### Via Azure Portal:

1. **Navigate to Azure Portal**
   - Go to https://portal.azure.com
   - Click "Create a resource"

2. **Create Web App**
   - Search for "Web App"
   - Click "Create"

3. **Basic Configuration**:
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new `konecbo-rg` or use existing
   - **Name**: `konecbo-app` (must be globally unique)
   - **Publish**: Code
   - **Runtime stack**: Node 18 LTS
   - **Operating System**: Linux
   - **Region**: East US (or your preferred region)

4. **App Service Plan**:
   - **Linux Plan**: Create new or use existing
   - **Pricing Plan**: 
     - Free F1 (for testing)
     - Basic B1 (for production - $13/month)
     - Standard S1 (for better performance - $70/month)

5. **Deployment**:
   - Skip for now (we'll configure later)

6. **Networking**:
   - Leave default settings

7. **Monitoring**:
   - Enable Application Insights: Yes (recommended)

8. **Review + Create**:
   - Review settings
   - Click "Create"
   - Wait for deployment (2-3 minutes)

### Via Azure CLI:

```bash
# Login
az login

# Create resource group
az group create --name konecbo-rg --location eastus

# Create App Service plan
az appservice plan create \
  --name konecbo-plan \
  --resource-group konecbo-rg \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --resource-group konecbo-rg \
  --plan konecbo-plan \
  --name konecbo-app \
  --runtime "NODE:18-lts"
```

---

## 🔗 Step 3: Connect GitHub to Azure

### Method 1: Deployment Center (Recommended)

1. **Go to your Web App** in Azure Portal
2. Click **"Deployment Center"** in the left menu
3. **Source**: Select "GitHub"
4. **Authorize**: Sign in to GitHub and authorize Azure
5. **Organization**: Select your GitHub username
6. **Repository**: Select `konecbo-v0.0.2`
7. **Branch**: Select `main`
8. **Build Provider**: GitHub Actions
9. Click **"Save"**

Azure will automatically:
- Create a GitHub Actions workflow
- Deploy your app
- Set up continuous deployment (auto-deploy on push)

### Method 2: Manual GitHub Actions Setup

1. **Get Publish Profile**:
   - In Azure Portal, go to your Web App
   - Click "Get publish profile"
   - Download the file

2. **Add to GitHub Secrets**:
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
   - Value: Paste the entire contents of the publish profile file
   - Click "Add secret"

3. **Update Workflow**:
   - The workflow file is already created at `.github/workflows/azure-deploy.yml`
   - Update `AZURE_WEBAPP_NAME` to your actual app name

---

## ⚙️ Step 4: Configure Environment Variables

### In Azure Portal:

1. Go to your Web App
2. Click **"Configuration"** → **"Application settings"**
3. Click **"+ New application setting"** for each variable:

#### Required Variables:

```
DATABASE_URL = postgresql://konecboadmin:YourPassword@konecbo-db.postgres.database.azure.com:5432/konecbo?sslmode=require

JWT_SECRET = your-super-secret-jwt-key-minimum-32-characters-long

CLIENT_URL = https://konecbo-app.azurewebsites.net

NODE_ENV = production

PORT = 8080
```

#### Optional Variables (if using Firebase):

```
FIREBASE_API_KEY = your-firebase-api-key
FIREBASE_AUTH_DOMAIN = your-project.firebaseapp.com
FIREBASE_PROJECT_ID = your-project-id
FIREBASE_STORAGE_BUCKET = your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID = your-sender-id
FIREBASE_APP_ID = your-app-id
```

4. Click **"Save"** at the top
5. Click **"Continue"** to restart the app

### Via Azure CLI:

```bash
az webapp config appsettings set \
  --resource-group konecbo-rg \
  --name konecbo-app \
  --settings \
    DATABASE_URL="postgresql://konecboadmin:YourPassword@konecbo-db.postgres.database.azure.com:5432/konecbo?sslmode=require" \
    JWT_SECRET="your-super-secret-jwt-key" \
    CLIENT_URL="https://konecbo-app.azurewebsites.net" \
    NODE_ENV="production" \
    PORT="8080"
```

---

## 🔧 Step 5: Configure Startup Command

1. Go to your Web App in Azure Portal
2. Click **"Configuration"** → **"General settings"**
3. **Startup Command**: Enter one of the following:

   **For combined frontend + backend:**
   ```
   npm start
   ```

   **For backend only:**
   ```
   cd server && npm start
   ```

   **For production build:**
   ```
   npm run build && npm start
   ```

4. Click **"Save"**

---

## 🗃️ Step 6: Initialize Database

### Option A: Via Azure Cloud Shell

1. Go to Azure Portal
2. Click the Cloud Shell icon (>_) at the top
3. Run:
```bash
# SSH into your web app
az webapp ssh --resource-group konecbo-rg --name konecbo-app

# Navigate to server directory
cd server

# Run database initialization
npm run init-db

# Exit
exit
```

### Option B: Via Local Machine

```bash
# Set DATABASE_URL environment variable locally
export DATABASE_URL="postgresql://konecboadmin:YourPassword@konecbo-db.postgres.database.azure.com:5432/konecbo?sslmode=require"

# Run initialization
cd server
npm run init-db
```

---

## ✅ Step 7: Verify Deployment

### Check Deployment Status:

1. **GitHub Actions**:
   - Go to your GitHub repository
   - Click "Actions" tab
   - Check the latest workflow run
   - Ensure it completed successfully (green checkmark)

2. **Azure Portal**:
   - Go to your Web App
   - Click "Deployment Center"
   - Check deployment logs
   - Look for "Deployment successful"

### Test Your Application:

1. **Visit Your App**:
   - URL: `https://konecbo-app.azurewebsites.net`
   - Or: `https://YOUR_APP_NAME.azurewebsites.net`

2. **Test Key Features**:
   - [ ] Homepage loads
   - [ ] Sign-up page works
   - [ ] Sign-in page works
   - [ ] Can create an account
   - [ ] Can sign in
   - [ ] Database connection works
   - [ ] Admin dashboard accessible (if admin user created)

3. **Check Logs**:
```bash
# Stream logs
az webapp log tail --resource-group konecbo-rg --name konecbo-app

# Download logs
az webapp log download --resource-group konecbo-rg --name konecbo-app
```

---

## 🔐 Step 8: Security Configuration

### Enable HTTPS Only:

1. Go to your Web App
2. Click **"TLS/SSL settings"**
3. **HTTPS Only**: Turn ON
4. **Minimum TLS Version**: 1.2

### Configure CORS:

1. Go to your Web App
2. Click **"CORS"**
3. Add allowed origins:
   - `https://konecbo-app.azurewebsites.net`
   - Your custom domain (if applicable)
4. Click **"Save"**

### Enable Managed Identity (Optional):

1. Go to your Web App
2. Click **"Identity"**
3. **System assigned**: Turn ON
4. Click **"Save"**

---

## 📊 Step 9: Monitoring & Logging

### Application Insights:

1. Go to your Web App
2. Click **"Application Insights"**
3. If not enabled, click **"Turn on Application Insights"**
4. Create new or use existing resource
5. Click **"Apply"**

### View Metrics:

1. Go to **"Metrics"**
2. Monitor:
   - CPU usage
   - Memory usage
   - Response time
   - HTTP requests
   - Errors

### Set Up Alerts:

1. Go to **"Alerts"**
2. Click **"+ Create"** → **"Alert rule"**
3. Configure alerts for:
   - High CPU usage (>80%)
   - High memory usage (>80%)
   - HTTP 5xx errors
   - Response time >2 seconds

---

## 🌐 Step 10: Custom Domain (Optional)

### Add Custom Domain:

1. Purchase a domain (e.g., from GoDaddy, Namecheap)
2. In Azure Portal, go to your Web App
3. Click **"Custom domains"**
4. Click **"+ Add custom domain"**
5. Enter your domain: `www.konecbo.com`
6. Follow DNS configuration instructions
7. Add required DNS records to your domain provider
8. Validate and add domain

### Add SSL Certificate:

1. Go to **"TLS/SSL settings"**
2. Click **"Private Key Certificates (.pfx)"**
3. Click **"+ Create App Service Managed Certificate"**
4. Select your custom domain
5. Click **"Create"**
6. Go to **"Bindings"**
7. Click **"+ Add TLS/SSL Binding"**
8. Select your domain and certificate
9. Click **"Add Binding"**

---

## 🚀 Step 11: Performance Optimization

### Enable Caching:

1. Add to your `web.config`:
```xml
<staticContent>
  <clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="7.00:00:00" />
</staticContent>
```

### Enable Compression:

1. Go to **"Configuration"** → **"General settings"**
2. **HTTP version**: 2.0
3. **ARR affinity**: OFF (for better load balancing)

### Scale Up (if needed):

1. Go to **"Scale up (App Service plan)"**
2. Choose a higher tier for better performance
3. Click **"Apply"**

### Scale Out (if needed):

1. Go to **"Scale out (App Service plan)"**
2. Configure autoscaling rules
3. Set minimum and maximum instances

---

## 📝 Post-Deployment Checklist

- [ ] Application is accessible at Azure URL
- [ ] Sign-up functionality works
- [ ] Sign-in functionality works
- [ ] Database connections successful
- [ ] Admin dashboard accessible
- [ ] Terms & Conditions page loads
- [ ] Privacy Policy page loads
- [ ] All API endpoints working
- [ ] HTTPS enabled
- [ ] Application Insights configured
- [ ] Alerts set up
- [ ] Backup strategy in place
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate installed (if applicable)

---

## 🐛 Troubleshooting

### Application Won't Start:

1. Check logs: `az webapp log tail`
2. Verify environment variables
3. Check startup command
4. Ensure `package.json` has correct start script

### Database Connection Fails:

1. Verify `DATABASE_URL` is correct
2. Check firewall rules allow Azure services
3. Test connection from local machine
4. Ensure database is initialized

### 404 Errors on Routes:

1. Check `web.config` is present
2. Verify SPA routing rules
3. Ensure build output is correct

### Slow Performance:

1. Upgrade App Service plan
2. Enable caching
3. Optimize database queries
4. Use CDN for static assets

---

## 📞 Support Resources

- **Azure Documentation**: https://docs.microsoft.com/azure
- **Azure Support**: https://azure.microsoft.com/support
- **GitHub Issues**: https://github.com/wirebustech/konecbo-v0.0.2/issues
- **Stack Overflow**: Tag questions with `azure-web-app-service`

---

## 🎯 Quick Commands Reference

```bash
# View logs
az webapp log tail --resource-group konecbo-rg --name konecbo-app

# Restart app
az webapp restart --resource-group konecbo-rg --name konecbo-app

# SSH into app
az webapp ssh --resource-group konecbo-rg --name konecbo-app

# Update environment variable
az webapp config appsettings set \
  --resource-group konecbo-rg \
  --name konecbo-app \
  --settings KEY=VALUE

# Deploy from local
az webapp up --name konecbo-app --resource-group konecbo-rg

# View deployment history
az webapp deployment list --resource-group konecbo-rg --name konecbo-app
```

---

**🎉 Congratulations!** Your Konecbo Research Platform is now deployed to Azure!

**Next Steps:**
1. Test all functionality thoroughly
2. Monitor performance and errors
3. Set up regular database backups
4. Plan for scaling as user base grows
5. Consider implementing CI/CD improvements
