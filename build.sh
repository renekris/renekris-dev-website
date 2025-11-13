#!/bin/bash

# Cloudflare Pages Build Script for Vite Projects
# This script ensures devDependencies are installed for production builds

echo "🔧 Starting Cloudflare Pages build process..."

# Install dependencies with devDependencies included for production builds
# This is necessary because Cloudflare Pages sets NODE_ENV=production
# which causes npm to skip devDependencies by default
if [ "$NODE_ENV" = "production" ]; then
	echo "📦 Production environment detected - installing with devDependencies..."
	npm install --include=dev
else
	echo "📦 Development/preview environment detected - installing normally..."
	npm install
fi

echo "🏗️  Building the application..."
npm run build

echo "✅ Build completed successfully!"
