#!/bin/bash

# Biblical Word Tetris - Build Script
# Ensures clean npm-only build for Netlify

echo "🧹 Cleaning yarn artifacts..."
rm -f yarn.lock
rm -f .yarnrc.yml
rm -rf .yarn/
rm -rf .pnp.*

echo "📦 Installing dependencies with npm..."
npm ci

echo "🏗️ Building project..."
npm run build

echo "✅ Build complete!"