#!/bin/bash
set -e

STACK_NAME="renekris"
IMAGE_NAME="renekris-web"

echo "🚀 Starting Docker Swarm deployment..."

# Function to check if stack exists
stack_exists() {
    docker stack ls --format "{{.Name}}" | grep -q "^${STACK_NAME}$"
}

# Function to wait for service to be ready
wait_for_service() {
    local service_name=$1
    local max_attempts=30
    local attempt=1
    
    echo "⏳ Waiting for $service_name to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        local running_tasks=$(docker service ls --filter name=$service_name --format "{{.Replicas}}" | cut -d'/' -f1)
        local desired_tasks=$(docker service ls --filter name=$service_name --format "{{.Replicas}}" | cut -d'/' -f2)
        
        if [ "$running_tasks" = "$desired_tasks" ] && [ "$running_tasks" -gt "0" ]; then
            echo "✅ $service_name is ready ($running_tasks/$desired_tasks replicas)"
            return 0
        fi
        
        echo "   Attempt $attempt/$max_attempts - $running_tasks/$desired_tasks replicas ready"
        sleep 10
        ((attempt++))
    done
    
    echo "❌ $service_name failed to become ready"
    return 1
}

# Function to verify deployment
verify_deployment() {
    echo "🔍 Verifying deployment..."
    
    # Wait a moment for services to stabilize
    sleep 15
    
    # Test health endpoint
    echo "🔍 Testing health endpoint..."
    if curl -s -f http://192.168.1.235/health >/dev/null 2>&1; then
        echo "✅ Health endpoint responding"
    else
        echo "⚠️ Health endpoint not responding yet"
    fi
    
    # Test main site
    echo "🔍 Testing main site..."
    if curl -s -f http://192.168.1.235/ >/dev/null 2>&1; then
        echo "✅ Main site responding"
    else
        echo "⚠️ Main site not responding yet"
    fi
    
    # Show service status
    echo "📊 Service status:"
    docker service ls --filter label=com.docker.stack.namespace=$STACK_NAME
    
    return 0
}

# Main deployment logic
echo "🔧 Building Docker image..."
docker build -t ${IMAGE_NAME}:latest .

if stack_exists; then
    echo "🔄 Stack exists - performing rolling update..."
    
    # Update the web service with new image
    echo "📦 Updating web service..."
    docker service update --image ${IMAGE_NAME}:latest ${STACK_NAME}_web
    
    # Wait for rolling update to complete
    if wait_for_service "${STACK_NAME}_web"; then
        echo "✅ Rolling update completed successfully"
    else
        echo "❌ Rolling update failed"
        echo "🔄 Attempting rollback..."
        docker service rollback ${STACK_NAME}_web
        exit 1
    fi
    
else
    echo "🆕 Deploying new stack..."
    docker stack deploy -c docker-stack.yml $STACK_NAME
    
    # Wait for all services to be ready
    echo "⏳ Waiting for stack deployment..."
    sleep 20
    
    if wait_for_service "${STACK_NAME}_traefik" && wait_for_service "${STACK_NAME}_web" && wait_for_service "${STACK_NAME}_uptime-kuma"; then
        echo "✅ Stack deployment completed successfully"
    else
        echo "❌ Stack deployment failed"
        exit 1
    fi
fi

# Verify deployment
if verify_deployment; then
    echo "✅ Deployment verification completed"
    echo "🌐 Website: https://renekris.dev"
    echo "📊 Status: https://status.renekris.dev"
    echo "🎛️ Traefik Dashboard: http://192.168.1.235:8080"
    echo ""
    echo "🎉 Deployment successful!"
else
    echo "⚠️ Deployment completed but verification had issues"
fi

echo ""
echo "💡 Useful commands:"
echo "  docker service logs ${STACK_NAME}_web     # View web service logs"
echo "  docker service ps ${STACK_NAME}_web       # View web service tasks"
echo "  docker stack ls                           # List all stacks"
echo "  docker service ls                         # List all services"