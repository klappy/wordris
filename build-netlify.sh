#!/bin/bash
set -e

echo "🚀 Starting Biblical Word Tetris build process..."

echo "📂 Current directory: $(pwd)"
echo "📋 Directory contents:"
ls -la

echo "🧹 Nuclear yarn cleanup (root and subdirectory)..."
rm -rf yarn.lock .yarn .yarnrc.yml .yarnrc .pnp.* || true
rm -rf wordris-svelte/yarn.lock wordris-svelte/.yarn wordris-svelte/.yarnrc.yml wordris-svelte/.yarnrc wordris-svelte/.pnp.* || true
find . -name "yarn.lock" -type f -delete || true

echo "🔒 Disabling yarn globally..."
export YARN_ENABLED=false
export USE_NPM=true
export NETLIFY_USE_YARN=false
export FORCE_NPM=true

echo "📁 Navigating to wordris-svelte directory..."
cd wordris-svelte

echo "📦 Installing dependencies with npm in wordris-svelte..."
npm ci --verbose

echo "🏗️ Building the application..."
npm run build

echo "✅ Build completed successfully!"

echo "📁 Listing build directory contents..."
ls -la build/

echo "🎉 Biblical Word Tetris is ready for deployment!"