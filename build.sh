#!/bin/bash
set -e

# Biblical Word Tetris - Build Script
# Ensures clean npm-only build for Netlify

echo "🧹 Cleaning up any yarn artifacts..."
rm -rf yarn.lock .yarn .yarnrc.yml .yarnrc .pnp.* || true

echo "📦 Installing dependencies with npm..."
npm ci

echo "🏗️ Building the application..."
npm run build

echo "✅ Build completed successfully!"