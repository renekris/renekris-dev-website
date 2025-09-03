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
    
    # Simple approach: Stop the non-target service temporarily
    # This forces all traffic to the target service
    if [ "$target_service" = "green" ]; then
        echo "🔄 Stopping blue container to force traffic to green..."
        docker stop renekris-web-blue 2>/dev/null || true
        sleep 5  # Give Traefik time to detect the change
        echo "✅ Traffic now routed to green (blue stopped)"
    else
        echo "🔄 Stopping green container to force traffic to blue..."  
        docker stop renekris-web-green 2>/dev/null || true
        sleep 5  # Give Traefik time to detect the change
        echo "✅ Traffic now routed to blue (green stopped)"
    fi
    
    echo "✅ Traffic switched to $target_service"
}

# Function to verify deployment
verify_deployment() {
    echo "🔍 Verifying deployment..."
    
    # Give time for routing to stabilize
    sleep 10
    
    # Test main site (try multiple times due to potential routing delays)
    local attempts=0
    local max_attempts=5
    while [ $attempts -lt $max_attempts ]; do
        if curl -s -f https://renekris.dev/ >/dev/null 2>&1; then
            echo "✅ Main site is responding (attempt $((attempts+1)))"
            break
        else
            echo "⏳ Main site check attempt $((attempts+1))/$max_attempts failed, retrying..."
            sleep 3
            ((attempts++))
        fi
    done
    
    if [ $attempts -eq $max_attempts ]; then
        echo "❌ Main site health check failed after $max_attempts attempts"
        return 1
    fi
    
    # Simplified verification - if main site loads, deployment is successful
    echo "✅ Deployment verification completed successfully"
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
        
        # Start both containers for future deployments
        echo "🔄 Starting standby container for next deployment..."
        docker start renekris-web-$old_service 2>/dev/null || true
        echo "✅ Both containers now running (active: $target_service, standby: $old_service)"
    else
        echo "❌ Deployment verification failed"
        echo "🔄 Rolling back to $old_service..."
        switch_traffic $old_service $target_service
        echo "⚠️ Rollback completed"
        
        # Ensure both containers are available for next deployment
        echo "🔄 Starting standby container for next deployment..."  
        docker start renekris-web-$target_service 2>/dev/null || true
        exit 1
    fi
}

# Run main deployment process
main "$@"