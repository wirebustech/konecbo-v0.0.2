#!/bin/bash

# Quick GitHub Push Script
# Run this after creating your GitHub repository

echo "🚀 Konecbo - Quick GitHub Push"
echo "================================"
echo ""

# Check if remote already exists
if git remote | grep -q "origin"; then
    echo "✓ Remote 'origin' already configured"
    echo "Current remote:"
    git remote -v
    echo ""
    read -p "Do you want to update the remote URL? (y/n): " update
    if [ "$update" = "y" ]; then
        read -p "Enter new GitHub repository URL: " repo_url
        git remote set-url origin "$repo_url"
        echo "✓ Remote URL updated"
    fi
else
    echo "⚠ No remote configured yet"
    echo ""
    echo "Please enter your GitHub repository URL"
    echo "Example: https://github.com/wirebuslab/konecbo-v0.0.2.git"
    echo ""
    read -p "GitHub Repository URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ Error: Repository URL cannot be empty"
        exit 1
    fi
    
    git remote add origin "$repo_url"
    echo "✓ Remote added successfully"
fi

echo ""
echo "📤 Ready to push to GitHub..."
echo ""
read -p "Push to GitHub now? (y/n): " push_now

if [ "$push_now" = "y" ]; then
    echo ""
    echo "Pushing to GitHub..."
    echo "You may be prompted for your GitHub credentials:"
    echo "  Username: Your GitHub username"
    echo "  Password: Your Personal Access Token (NOT your GitHub password)"
    echo ""
    
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ SUCCESS! Your code is now on GitHub!"
        echo ""
        echo "🎉 Next steps:"
        echo "1. Visit your repository on GitHub"
        echo "2. Verify all files are there"
        echo "3. Proceed with Azure deployment (see DEPLOYMENT_GUIDE.md)"
        echo ""
    else
        echo ""
        echo "❌ Push failed. Common issues:"
        echo ""
        echo "1. Authentication Error:"
        echo "   - Make sure you're using a Personal Access Token, not your password"
        echo "   - Create one at: https://github.com/settings/tokens"
        echo ""
        echo "2. Repository doesn't exist:"
        echo "   - Create it at: https://github.com/new"
        echo "   - Name it: konecbo-v0.0.2"
        echo ""
        echo "3. Wrong URL:"
        echo "   - Check the repository URL is correct"
        echo "   - Run: git remote -v"
        echo ""
        echo "Try again with: git push -u origin main"
    fi
else
    echo ""
    echo "⏸ Push cancelled"
    echo "When ready, run: git push -u origin main"
fi

echo ""
echo "================================"
