#!/bin/bash

# Smart Farming Dashboard - Quick Setup Script
echo "🌱 Smart Farming Dashboard Setup"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Setup frontend
echo "📦 Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Setup backend
echo "🐍 Setting up backend..."
cd Backend/api

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

cd ../..

# Create environment files if they don't exist
if [ ! -f ".env.local" ]; then
    echo "📄 Creating frontend environment file..."
    cp .env.example .env.local
    echo "⚠️  Please edit .env.local with your Firebase configuration"
fi

if [ ! -f "Backend/api/.env" ]; then
    echo "📄 Creating backend environment file..."
    cp Backend/api/.env.example Backend/api/.env
    echo "⚠️  Please edit Backend/api/.env with your configuration"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your Firebase frontend configuration"
echo "2. Edit Backend/api/.env with your backend configuration"
echo "3. Place your Firebase service account JSON as Backend/api/firebase-credentials.json"
echo "4. Run 'npm run dev' to start the frontend development server"
echo "5. Run 'cd Backend/api && source venv/bin/activate && python app.py' to start the backend"
echo ""
echo "For deployment instructions, see DEPLOYMENT.md"