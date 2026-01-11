# Quick GitHub Sync Guide

## 🚀 Option 1: Use the Automated Script (Easiest)

```bash
cd /home/oputa/konecbo-v0.0.2
./sync-github.sh
```

The script will guide you through:
1. Git configuration
2. Staging changes
3. Committing
4. Setting up remote
5. Pushing to GitHub

---

## 📝 Option 2: Manual Commands (Step-by-Step)

### Step 1: Configure Git (First Time Only)

```bash
cd /home/oputa/konecbo-v0.0.2

# Set your name and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 2: Check What's Changed

```bash
git status
```

### Step 3: Stage All Changes

```bash
# Add all files
git add .

# Or add specific files
git add src/
git add server/
git add package.json
```

### Step 4: Commit Changes

```bash
git commit -m "feat: Modern authentication system with SQL backend

- Implemented simplified sign-up with SQL database
- Created hybrid sign-in (SQL + Firebase)
- Updated admin dashboard with hybrid data sources
- Added Terms & Conditions acceptance flow
- Applied #e6f4ff color theme throughout
- Made pages mobile-responsive
- Added footer to authentication pages"
```

### Step 5: Connect to GitHub Repository

**First, create the repository on GitHub:**
1. Go to https://github.com
2. Click "+" → "New repository"
3. Name it: `konecbo-v0.0.2`
4. Choose Public or Private
5. **Don't** initialize with README
6. Click "Create repository"

**Then connect your local repo:**

```bash
# Add GitHub as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/konecbo-v0.0.2.git

# Verify remote
git remote -v
```

### Step 6: Push to GitHub

```bash
# Set branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## 🔐 Authentication Options

### Option A: HTTPS with Personal Access Token (Recommended)

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "Konecbo Deployment"
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)

When pushing, use:
```bash
git push -u origin main
# Username: your-github-username
# Password: paste-your-token-here
```

### Option B: SSH (More Secure, Requires Setup)

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key
# Then use SSH URL instead:
git remote set-url origin git@github.com:YOUR_USERNAME/konecbo-v0.0.2.git
```

---

## ⚠️ Troubleshooting

### Issue: "fatal: remote origin already exists"
```bash
# Remove existing remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/YOUR_USERNAME/konecbo-v0.0.2.git
```

### Issue: "Authentication failed"
- Use Personal Access Token instead of password
- Or set up SSH keys

### Issue: "Updates were rejected"
```bash
# Pull first, then push
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Issue: "Large files detected"
```bash
# Check file sizes
find . -type f -size +50M

# If you have large files, add them to .gitignore
echo "path/to/large/file" >> .gitignore
```

---

## 📊 Verify Your Push

After pushing, verify on GitHub:
1. Go to https://github.com/YOUR_USERNAME/konecbo-v0.0.2
2. Check that all files are there
3. Verify the commit message
4. Check the file count matches your local repo

---

## 🔄 Future Updates

After initial push, updating is simple:

```bash
# Make changes to your code
# Then:

git add .
git commit -m "your update message"
git push origin main
```

---

## 🎯 Next Steps After GitHub Sync

1. ✅ Verify all files are on GitHub
2. 🔧 Set up GitHub Actions (optional)
3. ☁️ Deploy to Azure (see DEPLOYMENT_GUIDE.md)
4. 🗄️ Set up Azure PostgreSQL database
5. 🔐 Configure environment variables in Azure

---

## 📞 Need Help?

- Check git status: `git status`
- View commit history: `git log --oneline`
- See remote URL: `git remote -v`
- Undo last commit: `git reset --soft HEAD~1`

---

**Ready to sync? Run:** `./sync-github.sh` or follow the manual steps above!
