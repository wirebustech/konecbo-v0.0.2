# Deployment Guide: GitHub → Azure

## 📋 Prerequisites Checklist

Before deploying, ensure you have:
- [ ] GitHub account
- [ ] Azure account
- [ ] Git installed locally
- [ ] Azure CLI installed (optional, for CLI deployment)
- [ ] All changes tested locally

---

## 🚀 Part 1: Push to GitHub

### Step 1: Initialize Git (if not already done)

```bash
cd /home/oputa/konecbo-v0.0.2

# Check if git is initialized
git status

# If not initialized, run:
git init
```

### Step 2: Configure Git (First Time Only)

```bash
# Set your name and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Create .gitignore (if not exists)

Make sure you have a `.gitignore` file to exclude sensitive files:

```bash
# Check if .gitignore exists
cat .gitignore

# If it doesn't exist or needs updating, create/update it
```

**Important files to ignore:**
```
# Dependencies
node_modules/
server/node_modules/

# Environment variables
.env
.env.local
server/.env

# Build files
build/
dist/

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
```

### Step 4: Stage Your Changes

```bash
# Add all changes
git add .

# Or add specific files
git add src/
git add server/
git add package.json
```

### Step 5: Commit Your Changes

```bash
# Commit with a descriptive message
git commit -m "feat: Implement modern sign-up/sign-in with SQL backend, admin dashboard, and T&C acceptance"

# Or use a more detailed message
git commit -m "feat: Major authentication and UI updates

- Implemented simplified sign-up with SQL backend
- Created hybrid sign-in (SQL + Firebase)
- Updated admin dashboard with hybrid data sources
- Added Terms & Conditions acceptance flow
- Applied #e6f4ff color theme
- Made pages mobile-responsive
- Added footer to auth pages"
```

### Step 6: Create GitHub Repository

**Option A: Via GitHub Website**
1. Go to https://github.com
2. Click "+" → "New repository"
3. Name it (e.g., "konecbo-v0.0.2")
4. Choose Public or Private
5. **Don't** initialize with README (you already have code)
6. Click "Create repository"

**Option B: Via GitHub CLI** (if installed)
```bash
gh repo create konecbo-v0.0.2 --public --source=. --remote=origin
```

### Step 7: Connect Local Repo to GitHub

```bash
# Add GitHub as remote (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/konecbo-v0.0.2.git

# Verify remote
git remote -v
```

### Step 8: Push to GitHub

```bash
# Push to main branch
git push -u origin main

# If your default branch is 'master', use:
git push -u origin master
```

**If you get an error about branch names:**
```bash
# Rename branch to main
git branch -M main
git push -u origin main
```

---

## ☁️ Part 2: Deploy to Azure

### Option A: Deploy via Azure Portal (Recommended for Beginners)

#### 1. **Create Azure Web App**

1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Web App"
4. Click "Create"

**Configuration:**
- **Subscription**: Choose your subscription
- **Resource Group**: Create new or use existing
- **Name**: `konecbo-app` (must be globally unique)
- **Publish**: Code
- **Runtime stack**: Node 18 LTS (or Node 20)
- **Operating System**: Linux
- **Region**: Choose nearest region
- **Pricing Plan**: Choose appropriate tier (Free F1 for testing, B1 or higher for production)

5. Click "Review + Create"
6. Click "Create"

#### 2. **Configure Deployment**

**Method 1: GitHub Actions (Recommended)**

1. In your Web App, go to "Deployment Center"
2. Choose "GitHub" as source
3. Authorize Azure to access GitHub
4. Select:
   - **Organization**: Your GitHub username
   - **Repository**: konecbo-v0.0.2
   - **Branch**: main
5. Azure will automatically create a GitHub Actions workflow
6. Click "Save"

**Method 2: Local Git**

1. In "Deployment Center", choose "Local Git"
2. Click "Save"
3. Copy the Git Clone URI
4. Add as remote:
```bash
git remote add azure <Git-Clone-URI>
git push azure main
```

#### 3. **Configure Environment Variables**

1. Go to your Web App
2. Click "Configuration" → "Application settings"
3. Add these variables:

**Frontend Variables:**
```
REACT_APP_API_URL=https://your-backend-url.azurewebsites.net/api
```

**Backend Variables (if deploying backend separately):**
```
NODE_ENV=production
PORT=8080
DATABASE_URL=your-postgresql-connection-string
JWT_SECRET=your-secret-key-here
CLIENT_URL=https://your-frontend-url.azurewebsites.net
```

4. Click "Save"

#### 4. **Configure Build Settings**

1. In "Configuration" → "General settings"
2. Set:
   - **Stack**: Node
   - **Major version**: 18 LTS
   - **Startup Command**: `npm start` (or `node server/server.js` for backend)

3. Click "Save"

### Option B: Deploy via Azure CLI

```bash
# Login to Azure
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
  --runtime "NODE|18-lts"

# Configure deployment from GitHub
az webapp deployment source config \
  --name konecbo-app \
  --resource-group konecbo-rg \
  --repo-url https://github.com/YOUR_USERNAME/konecbo-v0.0.2 \
  --branch main \
  --manual-integration

# Set environment variables
az webapp config appsettings set \
  --resource-group konecbo-rg \
  --name konecbo-app \
  --settings REACT_APP_API_URL="https://your-backend.azurewebsites.net/api"
```

---

## 🗄️ Part 3: Deploy PostgreSQL Database to Azure

### Option 1: Azure Database for PostgreSQL

```bash
# Create PostgreSQL server
az postgres flexible-server create \
  --resource-group konecbo-rg \
  --name konecbo-db \
  --location eastus \
  --admin-user konecboadmin \
  --admin-password YourSecurePassword123! \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 14

# Create database
az postgres flexible-server db create \
  --resource-group konecbo-rg \
  --server-name konecbo-db \
  --database-name konecbo

# Configure firewall (allow Azure services)
az postgres flexible-server firewall-rule create \
  --resource-group konecbo-rg \
  --name konecbo-db \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### Option 2: Use External PostgreSQL (e.g., ElephantSQL, Supabase)

1. Sign up for a PostgreSQL hosting service
2. Create a database
3. Copy the connection string
4. Add to Azure environment variables

---

## 🔧 Part 4: Post-Deployment Configuration

### 1. **Initialize Database**

After deployment, run the database initialization:

```bash
# SSH into your Azure Web App
az webapp ssh --resource-group konecbo-rg --name konecbo-app

# Navigate to server directory
cd server

# Run database initialization
npm run init-db
```

### 2. **Verify Deployment**

1. Go to your Web App URL: `https://konecbo-app.azurewebsites.net`
2. Test sign-up flow
3. Test sign-in flow
4. Check admin dashboard
5. Verify database connections

### 3. **Set Up Custom Domain (Optional)**

1. In Azure Portal, go to your Web App
2. Click "Custom domains"
3. Click "Add custom domain"
4. Follow instructions to configure DNS

---

## 📝 Quick Command Reference

### Push Updates to GitHub
```bash
git add .
git commit -m "your commit message"
git push origin main
```

### Trigger Azure Deployment
If using GitHub Actions, pushing to GitHub automatically triggers deployment.

If using Local Git:
```bash
git push azure main
```

### View Logs
```bash
# Stream logs
az webapp log tail --resource-group konecbo-rg --name konecbo-app

# Download logs
az webapp log download --resource-group konecbo-rg --name konecbo-app
```

### Restart App
```bash
az webapp restart --resource-group konecbo-rg --name konecbo-app
```

---

## ⚠️ Important Notes

### Environment Variables
Make sure to set these in Azure:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLIENT_URL` - Frontend URL
- `NODE_ENV=production`

### CORS Configuration
Update `server/server.js` to allow your Azure frontend URL:
```javascript
app.use(cors({
    origin: process.env.CLIENT_URL || 'https://konecbo-app.azurewebsites.net',
    credentials: true
}));
```

### Build Configuration
For React apps, you may need to add a build step in Azure:
1. Go to "Configuration" → "General settings"
2. Set "Startup Command": `npm run build && npm start`

Or create a custom deployment script.

---

## 🐛 Troubleshooting

### Issue: App not starting
**Solution**: Check logs with `az webapp log tail`

### Issue: Database connection failed
**Solution**: 
- Verify DATABASE_URL is correct
- Check firewall rules
- Ensure database is running

### Issue: 404 errors on routes
**Solution**: Add a `web.config` or configure URL rewriting for SPA

### Issue: Environment variables not working
**Solution**: 
- Restart the app after adding variables
- Check variable names (case-sensitive)

---

## 📚 Additional Resources

- [Azure Web Apps Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [GitHub Actions for Azure](https://docs.microsoft.com/en-us/azure/app-service/deploy-github-actions)
- [Azure PostgreSQL Documentation](https://docs.microsoft.com/en-us/azure/postgresql/)

---

**Need Help?** Check the Azure Portal logs or run `az webapp log tail` for real-time debugging.

Good luck with your deployment! 🚀
