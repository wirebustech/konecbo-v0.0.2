#!/bin/bash

# GitHub Sync Script for Konecbo v0.0.2
# This script will help you sync your local changes with GitHub

echo "🚀 Konecbo GitHub Sync Script"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check git configuration
echo "📋 Step 1: Checking Git Configuration..."
if ! git config user.name > /dev/null 2>&1; then
    echo -e "${YELLOW}Git user.name not set.${NC}"
    read -p "Enter your name: " git_name
    git config --global user.name "$git_name"
    echo -e "${GREEN}✓ Name set to: $git_name${NC}"
fi

if ! git config user.email > /dev/null 2>&1; then
    echo -e "${YELLOW}Git user.email not set.${NC}"
    read -p "Enter your email: " git_email
    git config --global user.email "$git_email"
    echo -e "${GREEN}✓ Email set to: $git_email${NC}"
fi

echo -e "${GREEN}✓ Git configured${NC}"
echo ""

# Step 2: Check current status
echo "📊 Step 2: Checking Repository Status..."
git status
echo ""

# Step 3: Add all changes
echo "➕ Step 3: Staging All Changes..."
read -p "Do you want to stage all changes? (y/n): " stage_all
if [ "$stage_all" = "y" ]; then
    git add .
    echo -e "${GREEN}✓ All changes staged${NC}"
else
    echo -e "${YELLOW}⚠ Skipping staging. You can manually add files with: git add <file>${NC}"
fi
echo ""

# Step 4: Commit changes
echo "💾 Step 4: Committing Changes..."
read -p "Enter commit message (or press Enter for default): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="feat: Major updates - Modern auth system, admin dashboard, and UI improvements"
fi

git commit -m "$commit_msg"
echo -e "${GREEN}✓ Changes committed${NC}"
echo ""

# Step 5: Set up remote
echo "🔗 Step 5: Setting Up GitHub Remote..."
if git remote | grep -q "origin"; then
    echo -e "${YELLOW}Remote 'origin' already exists${NC}"
    git remote -v
    read -p "Do you want to update the remote URL? (y/n): " update_remote
    if [ "$update_remote" = "y" ]; then
        read -p "Enter GitHub repository URL: " repo_url
        git remote set-url origin "$repo_url"
        echo -e "${GREEN}✓ Remote URL updated${NC}"
    fi
else
    read -p "Enter GitHub repository URL (e.g., https://github.com/username/konecbo-v0.0.2.git): " repo_url
    git remote add origin "$repo_url"
    echo -e "${GREEN}✓ Remote added${NC}"
fi
echo ""

# Step 6: Set main branch
echo "🌿 Step 6: Setting Main Branch..."
git branch -M main
echo -e "${GREEN}✓ Branch set to 'main'${NC}"
echo ""

# Step 7: Push to GitHub
echo "⬆️  Step 7: Pushing to GitHub..."
read -p "Ready to push to GitHub? (y/n): " ready_push
if [ "$ready_push" = "y" ]; then
    git push -u origin main
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Successfully pushed to GitHub!${NC}"
        echo ""
        echo "🎉 Your code is now on GitHub!"
        echo "Next steps:"
        echo "1. Go to your GitHub repository"
        echo "2. Verify all files are there"
        echo "3. Set up Azure deployment (see DEPLOYMENT_GUIDE.md)"
    else
        echo -e "${RED}✗ Push failed. Please check the error message above.${NC}"
        echo ""
        echo "Common issues:"
        echo "- Wrong repository URL"
        echo "- Authentication required (use GitHub token or SSH)"
        echo "- Branch protection rules"
    fi
else
    echo -e "${YELLOW}⚠ Push cancelled. Run 'git push -u origin main' when ready.${NC}"
fi

echo ""
echo "================================"
echo "Script completed!"
