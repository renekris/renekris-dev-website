#!/bin/bash

# Enhanced deployment script with integrated testing
# Extends the existing deploy.sh with comprehensive testing

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to show usage
show_help() {
    echo "Enhanced Deployment with Testing for renekris.dev"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  test-only        Run tests without deployment"
    echo "  deploy-only      Deploy without running tests (same as original deploy.sh)"
    echo "  full             Run tests then deploy if tests pass (default)"
    echo "  visual-update    Update visual regression baselines"
    echo "  help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0               # Run tests then deploy if passing"
    echo "  $0 test-only     # Only run tests"
    echo "  $0 deploy-only   # Only deploy (skip tests)"
    echo "  $0 visual-update # Update visual baselines and deploy"
}

# Parse command line arguments
DEPLOYMENT_TYPE="${1:-full}"

case $DEPLOYMENT_TYPE in
    help|--help|-h)
        show_help
        exit 0
        ;;
    test-only|deploy-only|full|visual-update)
        ;;
    *)
        print_error "Invalid option: $DEPLOYMENT_TYPE"
        echo ""
        show_help
        exit 1
        ;;
esac

echo -e "${BLUE}🚀 Enhanced Deployment with Testing${NC}"
echo "Deployment Type: $DEPLOYMENT_TYPE"
echo "=================================="

# Function to run tests
run_tests() {
    print_status "🧪 Running comprehensive test suite..."
    
    if [ ! -f "package.json" ]; then
        print_warning "No package.json found - setting up testing environment..."
        
        # Basic test setup if files don't exist
        if [ ! -f "run-tests.sh" ]; then
            print_error "Testing files not found. Please set up the testing environment first."
            exit 1
        fi
    fi
    
    # Make test script executable
    chmod +x run-tests.sh 2>/dev/null || true
    
    if ./run-tests.sh; then
        print_success "All tests passed! ✨"
        return 0
    else
        print_error "Tests failed! ❌"
        return 1
    fi
}

# Function to update visual baselines
update_visual_baselines() {
    print_status "📸 Updating visual regression baselines..."
    
    if command -v npm >/dev/null 2>&1; then
        npm run test:visual 2>/dev/null || npx playwright test --update-snapshots
        print_success "Visual baselines updated"
    else
        print_warning "npm not available - skipping visual baseline update"
    fi
}

# Function to deploy (using existing deploy.sh logic)
deploy_website() {
    print_status "🚀 Deploying website..."
    
    # Check if original deploy.sh exists
    if [ -f "deploy.sh" ] && [ "$0" != "./deploy.sh" ]; then
        print_status "Using existing deploy.sh script..."
        ./deploy.sh website
    else
        # Fallback deployment method
        print_status "Performing zero-downtime deployment..."
        
        # Reload Caddy configuration
        docker compose exec caddy caddy reload --config /etc/caddy/caddy.yaml --adapter yaml
        
        print_success "Website deployed successfully"
    fi
}

# Function to commit changes
commit_changes() {
    if [ -d ".git" ]; then
        print_status "💾 Committing changes..."
        
        git add .
        
        if git diff --cached --quiet; then
            print_warning "No changes to commit"
        else
            git commit -m "Deploy with integrated testing - $(date '+%Y-%m-%d %H:%M:%S')"
            print_success "Changes committed"
        fi
    else
        print_warning "Not a git repository - skipping commit"
    fi
}

# Main execution logic
case $DEPLOYMENT_TYPE in
    test-only)
        run_tests
        exit $?
        ;;
        
    deploy-only)
        deploy_website
        commit_changes
        ;;
        
    visual-update)
        update_visual_baselines
        deploy_website
        commit_changes
        ;;
        
    full)
        print_status "Running full deployment with testing..."
        
        # Run tests first
        if run_tests; then
            print_success "Tests passed - proceeding with deployment"
            deploy_website
            commit_changes
            
            print_success "Deployment completed successfully! 🎉"
            print_status "Website: https://renekris.dev"
            print_status "Status: https://status.renekris.dev/status/services"
        else
            print_error "Tests failed - deployment aborted"
            print_status "Fix the failing tests and try again"
            exit 1
        fi
        ;;
esac

print_status "Operation completed successfully ✨"