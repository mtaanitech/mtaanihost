#!/bin/bash

# MtaaniHost Setup Script
# Installs dependencies and sets up local environment

echo "🚀 MtaaniHost Setup"
echo "==================="

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not installed. Please install Node.js 16+"
  exit 1
fi

echo "✅ Node.js $(node -v)"

# Check npm
if ! command -v npm &> /dev/null; then
  echo "❌ npm not installed. Please install npm"
  exit 1
fi

echo "✅ npm $(npm -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ ! -f .env ]; then
  echo ""
  echo "📝 Creating .env file from .env.example"
  cp .env.example .env
  echo "⚠️  Please edit .env with your real values:"
  echo "   - SMTP credentials"
  echo "   - Paystack keys"
  echo "   - Admin password hash"
  echo "   - JWT secret"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env with your configuration"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:5000"
echo ""
