#!/bin/bash

# Smart Farming Dashboard - Deployment Validation Script
echo "🔍 Smart Farming Dashboard - Deployment Validation"
echo "================================================="

failed_tests=0

# Function to run test and track failures
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -n "Testing $test_name... "
    
    if eval "$test_command" &>/dev/null; then
        echo "✅ PASS"
    else
        echo "❌ FAIL"
        ((failed_tests++))
    fi
}

# Check prerequisites
echo "📋 Checking Prerequisites:"
run_test "Node.js installation" "command -v node"
run_test "npm installation" "command -v npm"
run_test "Python 3 installation" "command -v python3"
run_test "pip installation" "command -v pip3"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "Backend/api" ]; then
    echo "❌ Please run this script from the Smart_Farming_Dashboard root directory"
    exit 1
fi

echo ""
echo "📦 Checking Dependencies:"

# Check if frontend dependencies are installed
if [ -d "node_modules" ]; then
    run_test "Frontend dependencies" "npm list --depth=0"
else
    echo "⚠️  Frontend dependencies not installed. Run 'npm install' first."
    ((failed_tests++))
fi

# Check if backend dependencies work
run_test "Backend imports" "cd Backend/api && python3 -c 'import app'"

echo ""
echo "🔧 Checking Configuration Files:"

# Check for configuration files
run_test "Environment template exists" "[ -f '.env.example' ]"
run_test "Backend environment template exists" "[ -f 'Backend/api/.env.example' ]"
run_test "Docker configuration exists" "[ -f 'Dockerfile' ]"
run_test "Docker Compose configuration exists" "[ -f 'docker-compose.yml' ]"
run_test "Deployment documentation exists" "[ -f 'DEPLOYMENT.md' ]"

echo ""
echo "🚀 Checking Deployment Configurations:"

# Check deployment configurations
run_test "Vercel configuration" "[ -f 'vercel.json' ]"
run_test "Netlify configuration" "[ -f 'netlify.toml' ]"
run_test "Railway configuration" "[ -f 'railway.json' ]"
run_test "Render configuration" "[ -f 'render.yaml' ]"
run_test "Heroku Procfile" "[ -f 'Procfile' ]"
run_test "GitHub Actions workflows" "[ -d '.github/workflows' ]"

echo ""
echo "🐳 Checking Docker Configurations:"

# Check Docker files
run_test "Main Dockerfile" "[ -f 'Dockerfile' ]"
run_test "Frontend Dockerfile" "[ -f 'Dockerfile.frontend' ]"
run_test "Backend Dockerfile" "[ -f 'Dockerfile.backend' ]"
run_test "Production Docker Compose" "[ -f 'docker-compose.prod.yml' ]"

echo ""
echo "📁 Checking Project Structure:"

# Check key directories and files
run_test "Source directory exists" "[ -d 'src' ]"
run_test "Backend API directory exists" "[ -d 'Backend/api' ]"
run_test "Public assets directory exists" "[ -d 'public' ]"
run_test "Vite config exists" "[ -f 'vite.config.ts' ]"
run_test "Backend requirements file exists" "[ -f 'Backend/api/requirements.txt' ]"
run_test "Backend app file exists" "[ -f 'Backend/api/app.py' ]"

echo ""
echo "⚙️  Optional Checks:"

# Optional environment files (shouldn't exist in repo)
if [ -f ".env.local" ]; then
    echo "📄 Frontend environment file found (.env.local)"
else
    echo "⚠️  Frontend environment file not found - create .env.local from .env.example"
fi

if [ -f "Backend/api/.env" ]; then
    echo "📄 Backend environment file found (Backend/api/.env)"
else
    echo "⚠️  Backend environment file not found - create Backend/api/.env from Backend/api/.env.example"
fi

if [ -f "Backend/api/firebase-credentials.json" ]; then
    echo "📄 Firebase credentials file found"
else
    echo "⚠️  Firebase credentials file not found - download from Firebase Console"
fi

echo ""
echo "📊 Validation Summary:"
echo "====================="

if [ $failed_tests -eq 0 ]; then
    echo "🎉 All tests passed! Your project is ready for deployment."
    echo ""
    echo "Next steps:"
    echo "1. Configure environment variables (.env.local and Backend/api/.env)"
    echo "2. Add Firebase credentials (Backend/api/firebase-credentials.json)"
    echo "3. Choose a deployment method from DEPLOYMENT.md"
    echo "4. Follow the deployment guide for your chosen platform"
else
    echo "❌ $failed_tests test(s) failed. Please fix the issues above before deploying."
    exit 1
fi

echo ""
echo "For detailed deployment instructions, see DEPLOYMENT.md"