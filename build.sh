#!/bin/bash
# filepath: /media/ali/E440D30240D2D9FE/code/mern-auth-bp/build.sh

# Build script for MERN Authentication App
# Compatible with Railway, Render, Vercel, Heroku, DigitalOcean, and custom deployments

set -e  # Exit on any error

# Color codes for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

# Header
echo ""
echo -e "${PURPLE}🏗️  MERN Authentication App Build Script${NC}"
echo -e "${PURPLE}================================================${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Run this script from the project root."
    exit 1
fi

print_success "Found package.json - Starting build process..."

# Check Node.js version
NODE_VERSION=$(node --version)
print_info "Node.js version: $NODE_VERSION"

# Check npm version
NPM_VERSION=$(npm --version)
print_info "npm version: $NPM_VERSION"

# Check if client directory exists
if [ ! -d "client" ]; then
    print_error "Client directory not found. This script expects a MERN project structure."
    exit 1
fi

# Check if server directory exists
if [ ! -d "server" ]; then
    print_error "Server directory not found. This script expects a MERN project structure."
    exit 1
fi

# Set environment to production
export NODE_ENV=production
print_info "Environment set to: $NODE_ENV"

# Detect platform (optional)
if [ ! -z "$RAILWAY_ENVIRONMENT" ]; then
    print_info "Detected platform: Railway"
    PLATFORM="railway"
elif [ ! -z "$RENDER" ]; then
    print_info "Detected platform: Render"
    PLATFORM="render"
elif [ ! -z "$VERCEL" ]; then
    print_info "Detected platform: Vercel"
    PLATFORM="vercel"
elif [ ! -z "$HEROKU_APP_NAME" ]; then
    print_info "Detected platform: Heroku"
    PLATFORM="heroku"
else
    print_info "Platform: Custom/Local"
    PLATFORM="custom"
fi

# Clean previous builds (optional, can be skipped in CI/CD)
if [ "$1" != "--skip-clean" ]; then
    print_status "🧹 Cleaning previous builds..."
    
    # Remove client build directory
    if [ -d "client/dist" ]; then
        rm -rf client/dist
        print_success "Removed client/dist"
    fi
    
    # Only clean node_modules in local development
    if [ "$PLATFORM" = "custom" ] && [ "$2" = "--clean-deps" ]; then
        print_warning "Cleaning node_modules (this may take time)..."
        rm -rf node_modules
        rm -rf client/node_modules
        print_success "Cleaned dependencies"
    fi
else
    print_info "Skipping clean step"
fi

# Install dependencies
print_status "📦 Installing dependencies..."

# Install root dependencies
print_info "Installing server dependencies..."
if npm install --production=false; then
    print_success "Server dependencies installed"
else
    print_error "Failed to install server dependencies"
    exit 1
fi

# Install client dependencies
print_info "Installing client dependencies..."
if npm install --prefix client --production=false; then
    print_success "Client dependencies installed"
else
    print_error "Failed to install client dependencies"
    exit 1
fi

# Verify critical files exist
print_status "🔍 Verifying project structure..."

REQUIRED_FILES=(
    "server/index.js"
    "server/app.js"
    "client/package.json"
    "client/vite.config.js"
    "client/src/main.jsx"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_success "Found $file"
    else
        print_error "Missing required file: $file"
        exit 1
    fi
done

# Check environment variables (in production)
if [ "$NODE_ENV" = "production" ]; then
    print_status "🔐 Checking environment variables..."
    
    REQUIRED_ENV_VARS=("MONGO_URI" "JWT_SECRET")
    MISSING_VARS=()
    
    for var in "${REQUIRED_ENV_VARS[@]}"; do
        # Check both common naming conventions
        if [ -z "${!var}" ] && [ -z "${!var/MONGO_URI/MONGODB_URI}" ]; then
            MISSING_VARS+=("$var")
        fi
    done
    
    if [ ${#MISSING_VARS[@]} -gt 0 ]; then
        print_warning "Missing environment variables: ${MISSING_VARS[*]}"
        print_info "Make sure to set these in your deployment platform"
    else
        print_success "Required environment variables are set"
    fi
fi

# Build frontend
print_status "⚛️  Building React frontend..."

# Change to client directory and build
cd client

# Check if build script exists
if npm run build --silent 2>/dev/null; then
    print_success "Frontend build completed successfully"
else
    print_error "Frontend build failed"
    exit 1
fi

# Go back to root
cd ..

# Verify build output
if [ -d "client/dist" ]; then
    print_success "Build output directory created: client/dist"
    
    # Check build size
    BUILD_SIZE=$(du -sh client/dist 2>/dev/null | cut -f1)
    print_info "Build size: $BUILD_SIZE"
    
    # List key files
    if [ -f "client/dist/index.html" ]; then
        print_success "Found index.html"
    else
        print_error "index.html not found in build output"
        exit 1
    fi
    
    # Count assets
    ASSET_COUNT=$(find client/dist -type f | wc -l)
    print_info "Total files in build: $ASSET_COUNT"
    
else
    print_error "Build output directory not created"
    exit 1
fi

# Platform-specific post-build steps
case $PLATFORM in
    "railway")
        print_info "Railway-specific optimizations..."
        # Railway automatically handles the rest
        ;;
    "render")
        print_info "Render-specific optimizations..."
        # Render automatically handles the rest
        ;;
    "vercel")
        print_info "Vercel-specific optimizations..."
        # For Vercel, we might need to copy files to specific locations
        ;;
    "heroku")
        print_info "Heroku-specific optimizations..."
        # Heroku uses the start script from package.json
        ;;
    *)
        print_info "Custom deployment - no platform-specific steps"
        ;;
esac

# Health check (optional)
if command -v curl &> /dev/null; then
    print_status "🏥 Running health check preparation..."
    print_info "Health check endpoint will be available at: /api/v1/health"
else
    print_info "curl not available - skipping health check"
fi

# Create deployment info file
cat > deployment-info.json << EOF
{
  "buildTime": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "platform": "$PLATFORM",
  "nodeVersion": "$NODE_VERSION",
  "npmVersion": "$NPM_VERSION",
  "buildSize": "$BUILD_SIZE",
  "environment": "$NODE_ENV"
}
EOF

print_success "Created deployment-info.json"

# Final success message
echo ""
echo -e "${GREEN}🎉 Build completed successfully!${NC}"
echo -e "${GREEN}🚀 Ready for deployment!${NC}"
echo ""

# Deployment instructions
print_info "📋 Next steps:"
echo "   1. Set environment variables on your platform:"
echo "      - NODE_ENV=production"
echo "      - MONGO_URI=your_mongodb_connection_string"
echo "      - JWT_SECRET=your_jwt_secret"
echo "      - CLIENT_URL=your_frontend_domain (optional)"
echo ""
echo "   2. Start the application:"
echo "      npm start"
echo ""
echo "   3. Health check endpoint:"
echo "      GET /api/v1/health"
echo ""

# Platform-specific instructions
case $PLATFORM in
    "railway")
        echo "   🚂 Railway deployment:"
        echo "      - Environment variables are set in Railway dashboard"
        echo "      - Application will start automatically"
        ;;
    "render")
        echo "   🎨 Render deployment:"
        echo "      - Build command: npm run build"
        echo "      - Start command: npm start"
        ;;
    "vercel")
        echo "   ▲ Vercel deployment:"
        echo "      - Framework preset: Other"
        echo "      - Build command: npm run build"
        echo "      - Output directory: client/dist"
        ;;
    "heroku")
        echo "   🟣 Heroku deployment:"
        echo "      - Buildpack: heroku/nodejs"
        echo "      - Uses package.json scripts automatically"
        ;;
esac

echo ""
print_success "Build script completed! 🎯"

# Exit with success
exit 0