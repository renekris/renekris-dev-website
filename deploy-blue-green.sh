#!/bin/bash
# Blue-Green Zero-Downtime Deployment Script
# Switches between blue and green services using Traefik priorities

set -e

COMPOSE_FILE="docker-compose-traefik.yml"
PROJECT_NAME="renekris-dev"

echo "🚀 Starting blue-green deployment..."

# Function to get current active service (blue or green)
get_active_service() {
    local blue_priority=$(docker inspect renekris-web-blue --format '{{ index .Config.Labels "traefik.http.routers.web-blue.priority" }}' 2>/dev/null || echo "50")
    local green_priority=$(docker inspect renekris-web-green --format '{{ index .Config.Labels "traefik.http.routers.web-green.priority" }}' 2>/dev/null || echo "50")
    
    if [ "$blue_priority" -gt "$green_priority" ]; then
        echo "blue"
    else
        echo "green"
    fi
}

# Function to wait for service health check
wait_for_healthy() {
    local service_name=$1
    local max_attempts=30
    local attempt=1
    
    echo "⏳ Waiting for $service_name to be healthy..."
    
    while [ $attempt -le $max_attempts ]; do
        if [ "$(docker inspect $service_name --format '{{.State.Health.Status}}' 2>/dev/null)" = "healthy" ]; then
            echo "✅ $service_name is healthy"
            return 0
        fi
        
        echo "   Attempt $attempt/$max_attempts - waiting..."
        sleep 10
        ((attempt++))
    done
    
    echo "❌ $service_name failed to become healthy"
    return 1
}

# Function to switch traffic to a service
switch_traffic() {
    local target_service=$1
    local other_service=$2
    
    echo "🔄 Switching traffic to $target_service..."
    
    if [ "$target_service" = "blue" ]; then
        # Set blue to high priority (active)
        docker service update --label-add "traefik.http.routers.web-blue.priority=100" renekris-web-blue 2>/dev/null || \
        docker container update --label-add "traefik.http.routers.web-blue.priority=100" renekris-web-blue || {
            echo "⚠️ Using docker-compose to update priorities..."
            # Fallback: recreate containers with updated priorities
            BLUE_PRIORITY=100 GREEN_PRIORITY=50 docker compose -f $COMPOSE_FILE up -d --no-deps web-blue web-green
        }
        
        # Set green to low priority (standby)  
        docker service update --label-add "traefik.http.routers.web-green.priority=50" renekris-web-green 2>/dev/null || \
        docker container update --label-add "traefik.http.routers.web-green.priority=50" renekris-web-green || true
        
        # Update API proxy priorities too
        docker container update --label-add "traefik.http.routers.status-api-blue.priority=100" renekris-web-blue 2>/dev/null || true
        docker container update --label-add "traefik.http.routers.status-api-green.priority=50" renekris-web-green 2>/dev/null || true
        docker container update --label-add "traefik.http.routers.web-blue-http.priority=100" renekris-web-blue 2>/dev/null || true
        docker container update --label-add "traefik.http.routers.web-green-http.priority=50" renekris-web-green 2>/dev/null || true
        
    else
        # Set green to high priority (active)
        docker service update --label-add "traefik.http.routers.web-green.priority=100" renekris-web-green 2>/dev/null || \
        docker container update --label-add "traefik.http.routers.web-green.priority=100" renekris-web-green || {
            echo "⚠️ Using docker-compose to update priorities..."
            BLUE_PRIORITY=50 GREEN_PRIORITY=100 docker compose -f $COMPOSE_FILE up -d --no-deps web-blue web-green
        }
        
        # Set blue to low priority (standby)
        docker service update --label-add "traefik.http.routers.web-blue.priority=50" renekris-web-blue 2>/dev/null || \
        docker container update --label-add "traefik.http.routers.web-blue.priority=50" renekris-web-blue || true
        
        # Update API proxy priorities too
        docker container update --label-add "traefik.http.routers.status-api-green.priority=100" renekris-web-green 2>/dev/null || true
        docker container update --label-add "traefik.http.routers.status-api-blue.priority=50" renekris-web-blue 2>/dev/null || true
        docker container update --label-add "traefik.http.routers.web-green-http.priority=100" renekris-web-green 2>/dev/null || true
        docker container update --label-add "traefik.http.routers.web-blue-http.priority=50" renekris-web-blue 2>/dev/null || true
    fi
    
    # Give Traefik time to update routing
    sleep 5
    
    echo "✅ Traffic switched to $target_service"
}

# Function to verify deployment
verify_deployment() {
    echo "🔍 Verifying deployment..."
    
    # Test main site
    if curl -s -f https://renekris.dev/health >/dev/null 2>&1; then
        echo "✅ Main site is responding"
    else
        echo "❌ Main site health check failed"
        return 1
    fi
    
    # Test status API
    if curl -s -f https://renekris.dev/api/status/config >/dev/null 2>&1; then
        echo "✅ Status API is responding"
    else
        echo "❌ Status API health check failed"
        return 1
    fi
    
    return 0
}

# Main deployment process
main() {
    echo "📊 Current deployment state:"
    current_active=$(get_active_service)
    echo "   Active service: $current_active"
    
    if [ "$current_active" = "blue" ]; then
        target_service="green"
        old_service="blue"
    else
        target_service="blue"
        old_service="green"
    fi
    
    echo "   Target service: $target_service"
    echo ""
    
    # Build and start target service with latest code
    echo "🔧 Building and updating $target_service service..."
    docker compose -f $COMPOSE_FILE build web-$target_service
    
    # Stop and remove existing target container if it exists
    docker stop renekris-web-$target_service 2>/dev/null || true
    docker rm renekris-web-$target_service 2>/dev/null || true
    
    # Start the updated target service
    docker compose -f $COMPOSE_FILE up -d web-$target_service
    
    # Wait for target service to be healthy
    if ! wait_for_healthy "renekris-web-$target_service"; then
        echo "❌ Deployment failed - $target_service service is not healthy"
        exit 1
    fi
    
    # Switch traffic to target service
    switch_traffic $target_service $old_service
    
    # Verify deployment is working
    if verify_deployment; then
        echo "✅ Deployment successful!"
        echo "🎉 Traffic switched from $old_service to $target_service"
        echo "🌐 Site: https://renekris.dev"
        echo "📊 Status: https://status.renekris.dev"
    else
        echo "❌ Deployment verification failed"
        echo "🔄 Rolling back to $old_service..."
        switch_traffic $old_service $target_service
        echo "⚠️ Rollback completed"
        exit 1
    fi
}

# Run main deployment process
main "$@"