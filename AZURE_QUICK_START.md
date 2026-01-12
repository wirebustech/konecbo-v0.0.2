# 🚀 Quick Start: Deploy Konecbo to Azure

This is a simplified guide to get your Konecbo Research Platform deployed to Azure quickly.

## ⚡ Prerequisites

- [ ] Azure account ([Sign up free](https://azure.microsoft.com/free/))
- [ ] Code already on GitHub ✅
- [ ] 30 minutes of your time

---

## 📝 3-Step Deployment

### **Step 1: Create PostgreSQL Database** (5 minutes)

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **"Create a resource"** → Search **"PostgreSQL"**
3. Select **"Azure Database for PostgreSQL Flexible Server"**
4. Fill in:
   - Server name: `konecbo-db`
   - Admin username: `konecboadmin`
   - Password: (create a strong password)
   - Region: East US
   - Compute: Burstable, B1ms
5. **Networking** → Select **"Public access"**
6. Add firewall rule: **"Allow Azure services"**
7. Click **"Review + create"** → **"Create"**
8. **Save your connection string**:
   ```
   postgresql://konecboadmin:YOUR_PASSWORD@konecbo-db.postgres.database.azure.com:5432/postgres?sslmode=require
   ```

### **Step 2: Create Web App** (5 minutes)

1. In Azure Portal, click **"Create a resource"** → Search **"Web App"**
2. Fill in:
   - Name: `konecbo-app` (must be unique)
   - Runtime: **Node 18 LTS**
   - Operating System: **Linux**
   - Region: **East US** (same as database)
   - Pricing: **Basic B1** ($13/month) or **Free F1** (for testing)
3. Click **"Review + create"** → **"Create"**
4. Wait 2-3 minutes for deployment

### **Step 3: Connect GitHub & Configure** (10 minutes)

1. Go to your new Web App
2. Click **"Deployment Center"**
3. Source: **GitHub**
4. Authorize and select:
   - Organization: `wirebustech`
   - Repository: `konecbo-v0.0.2`
   - Branch: `main`
5. Click **"Save"**

6. Click **"Configuration"** → **"Application settings"**
7. Add these settings (click **"+ New application setting"** for each):

   ```
   DATABASE_URL = postgresql://konecboadmin:YOUR_PASSWORD@konecbo-db.postgres.database.azure.com:5432/postgres?sslmode=require
   
   JWT_SECRET = your-super-secret-key-at-least-32-characters-long
   
   CLIENT_URL = https://konecbo-app.azurewebsites.net
   
   NODE_ENV = production
   
   PORT = 8080
   ```

8. Click **"Save"** → **"Continue"** (app will restart)

---

## ✅ Initialize Database

1. In Azure Portal, click the **Cloud Shell** icon (>_) at the top
2. Run these commands:

```bash
# SSH into your app
az webapp ssh --resource-group YOUR_RESOURCE_GROUP --name konecbo-app

# Navigate to server folder
cd server

# Initialize database
npm run init-db

# Exit
exit
```

---

## 🎉 You're Live!

Visit your app at: **https://konecbo-app.azurewebsites.net**

Test:
- Sign up page
- Sign in page
- Create an account
- Admin dashboard (create admin user first)

---

## 🔧 Common Issues

### App won't start?
- Check logs: Azure Portal → Your Web App → **"Log stream"**
- Verify all environment variables are set correctly

### Database connection fails?
- Double-check `DATABASE_URL` is correct
- Ensure firewall allows Azure services

### Need help?
- See full guide: [AZURE_DEPLOYMENT_CHECKLIST.md](AZURE_DEPLOYMENT_CHECKLIST.md)
- Check Azure logs
- Review GitHub Actions workflow status

---

## 📚 Next Steps

- [ ] Set up custom domain
- [ ] Enable HTTPS only
- [ ] Configure Application Insights
- [ ] Set up alerts
- [ ] Create admin user
- [ ] Test all features

---

**🎊 Congratulations!** Your Konecbo Research Platform is live on Azure!

For detailed instructions, see [AZURE_DEPLOYMENT_CHECKLIST.md](AZURE_DEPLOYMENT_CHECKLIST.md)
