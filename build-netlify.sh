#!/bin/bash
set -e

echo "🚀 Starting Biblical Word Tetris build process..."

# Navigate to the wordris-svelte directory
cd wordris-svelte

echo "🧹 Nuclear yarn cleanup..."
rm -rf ../yarn.lock ../node_modules/.yarn* yarn.lock .yarn .yarnrc.yml .yarnrc .pnp.* || true
find . -name "yarn.lock" -type f -delete || true
find .. -name "yarn.lock" -type f -delete || true

echo "🔒 Disabling yarn globally..."
export YARN_ENABLED=false
export USE_NPM=true
export NETLIFY_USE_YARN=false
export FORCE_NPM=true

echo "📦 Installing dependencies with npm..."
npm ci --verbose

echo "🏗️ Building the application..."
npm run build

echo "✅ Build completed successfully!"

echo "📁 Listing build directory contents..."
ls -la build/

echo "🎉 Biblical Word Tetris is ready for deployment!"