#!/bin/bash

APP_NAME="konecbo-main"
SECRET_NAME="AZURE_WEBAPP_PUBLISH_PROFILE"

echo "Using App Name: $APP_NAME"

# 1. Get Resource Group
echo "🔍 Finding Resource Group..."
RESOURCE_GROUP=$(az webapp show --name $APP_NAME --query "resourceGroup" -o tsv 2>/dev/null)

if [ -z "$RESOURCE_GROUP" ]; then
    echo "❌ Could not find App Service '$APP_NAME'. Checking 'konecbo-app'..."
    APP_NAME="konecbo-app"
    RESOURCE_GROUP=$(az webapp show --name $APP_NAME --query "resourceGroup" -o tsv 2>/dev/null)
    
    if [ -z "$RESOURCE_GROUP" ]; then
        echo "❌ Could not find app. Please log in with 'az login' and ensure the app exists."
        exit 1
    fi
fi
echo "✅ Found Resource Group: $RESOURCE_GROUP"

# 2. Enable Basic Auth (The Fix)
echo "🔓 Enabling SCM Basic Authentication (Fixing 'Disabled' error)..."
# This command specifically enables Basic Auth for the SCM (deployment) endpoint
az resource update \
    --resource-group $RESOURCE_GROUP \
    --name scm \
    --namespace Microsoft.Web \
    --resource-type basicPublishingCredentialsPolicies \
    --parent sites/$APP_NAME \
    --set properties.allow=true \
    --verbose

if [ $? -eq 0 ]; then
    echo "✅ SCM Basic Auth enabled successfully."
else
    echo "⚠️  Failed to enable Basic Auth. You might need to do this in the Portal."
fi

# 3. Fetch Profile
echo "📥 Fetching Publish Profile XML..."
PROFILE_XML=$(az webapp deployment list-publishing-profiles --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --xml)

if [ -z "$PROFILE_XML" ]; then
    echo "❌ Failed to download profile. Please check permissions."
    exit 1
fi

# 4. Set Secret
echo "🔑 Updating GitHub Secret..."
echo "$PROFILE_XML" | gh secret set "$SECRET_NAME"

echo "✅ SUCCESS! Secret updated."
echo "🚀 You can now re-run the deployment in GitHub Actions."
