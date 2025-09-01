#!/bin/bash

# Website Testing Suite Runner
# Runs comprehensive tests for renekris.dev website

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Starting Website Testing Suite${NC}"
echo "=================================="

# Function to print status
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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run from project root."
    exit 1
fi

# Create results directory
mkdir -p test-results
mkdir -p playwright-report

print_status "Installing dependencies..."
npm install

print_status "Installing Playwright browsers..."
npx playwright install --with-deps

# Run different test suites
run_test_suite() {
    local suite_name=$1
    local test_pattern=$2
    local description=$3
    
    print_status "Running $description..."
    
    if npx playwright test $test_pattern --reporter=html --reporter=json; then
        print_success "$description completed successfully"
        return 0
    else
        print_error "$description failed"
        return 1
    fi
}

# Initialize test results
total_tests=0
passed_tests=0

# Run test suites
echo ""
print_status "🏠 Testing Homepage Functionality..."
if run_test_suite "homepage" "homepage.spec.js" "Homepage Tests"; then
    ((passed_tests++))
fi
((total_tests++))

echo ""
print_status "📱 Testing Mobile Responsiveness..."
if run_test_suite "mobile" "mobile-responsive.spec.js" "Mobile Responsive Tests"; then
    ((passed_tests++))
fi
((total_tests++))

echo ""
print_status "⚡ Testing Performance..."
if run_test_suite "performance" "performance.spec.js" "Performance Tests"; then
    ((passed_tests++))
fi
((total_tests++))

echo ""
print_status "♿ Testing Accessibility..."
if run_test_suite "accessibility" "accessibility.spec.js" "Accessibility Tests"; then
    ((passed_tests++))
fi
((total_tests++))

echo ""
print_status "🔗 Testing Integration..."
if run_test_suite "integration" "integration.spec.js" "Integration Tests"; then
    ((passed_tests++))
fi
((total_tests++))

echo ""
print_status "📸 Running Visual Regression Tests..."
if run_test_suite "visual" "visual-regression.spec.js" "Visual Regression Tests"; then
    ((passed_tests++))
fi
((total_tests++))

# Summary
echo ""
echo "=================================="
echo -e "${BLUE}📊 Test Results Summary${NC}"
echo "=================================="
echo "Total Test Suites: $total_tests"
echo "Passed: $passed_tests"
echo "Failed: $((total_tests - passed_tests))"

if [ $passed_tests -eq $total_tests ]; then
    print_success "All test suites passed! 🎉"
    echo ""
    print_status "📋 Test reports available at:"
    echo "  - HTML Report: playwright-report/index.html"
    echo "  - JSON Results: test-results/results.json"
    
    # Generate simple summary for CI/CD
    echo "$passed_tests/$total_tests test suites passed" > test-results/summary.txt
    exit 0
else
    print_error "Some tests failed. Check the reports for details."
    echo ""
    print_status "📋 Test reports available at:"
    echo "  - HTML Report: playwright-report/index.html"
    echo "  - JSON Results: test-results/results.json"
    
    echo "$passed_tests/$total_tests test suites passed" > test-results/summary.txt
    exit 1
fi