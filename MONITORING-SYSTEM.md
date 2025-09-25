# Comprehensive Health Checks and Monitoring System

## Overview

This document describes the comprehensive monitoring and health check system implemented for the renekris.dev infrastructure. The system provides detailed application health validation, dependency monitoring, deployment tracking, automated rollback capabilities, and performance monitoring.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Monitoring Dashboard Integration                  │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Health    │  │ Deployment  │  │ Notification│  │ Performance │ │
│  │  Monitor    │  │  Monitor    │  │   System    │  │  Monitor    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
│  ┌─────────────┐  ┌─────────────┐                                   │
│  │  Rollback   │  │   Legacy    │                                   │
│  │ Automation  │  │ Monitoring  │                                   │
│  └─────────────┘  └─────────────┘                                   │
└─────────────────────────────────────────────────────────────────────┘
```

## Key Features

### 1. Enhanced Health Check Endpoints

#### `/health` - Comprehensive Health Validation
- **Application status**: Overall system health determination
- **Dependency checks**: External service connectivity and response times
- **Resource monitoring**: Memory, CPU, and disk usage validation
- **Performance metrics**: Response times and system performance
- **Deployment information**: Build metadata and environment details

**Response Structure:**
```json
{
  "status": "healthy|degraded|unhealthy",
  "timestamp": "2025-01-XX T XX:XX:XX.XXXZ",
  "deployment": {
    "environment": "production|staging|development",
    "version": "1.0.0",
    "imageTag": "production-abc1234",
    "buildTimestamp": "2025-01-XX",
    "deployedAt": "2025-01-XX T XX:XX:XX.XXXZ"
  },
  "application": {
    "uptime": 3600,
    "pid": 1234,
    "nodeVersion": "v20.x.x",
    "platform": "linux"
  },
  "dependencies": {
    "uptimeKuma": { "status": true, "latency": 150, "error": null },
    "fileSystem": { "status": true, "writeable": true, "error": null },
    "minecraftServer": { "status": true, "latency": 50, "error": null },
    "memory": { "status": true, "usage": { "percent": 45 }, "threshold": 90 },
    "network": { "status": true, "latency": 25, "error": null }
  },
  "checks": {
    "lastRun": "2025-01-XX T XX:XX:XX.XXXZ",
    "criticalPassing": true,
    "allPassing": true,
    "total": 6,
    "passing": 6
  }
}
```

#### `/ready` - Readiness Probe
- **Service initialization**: Confirms all systems are ready
- **Critical dependency validation**: Ensures essential services are available
- **Readiness scoring**: Percentage-based readiness calculation
- **Traffic acceptance**: Determines if service can handle requests

#### `/live` - Liveness Probe
- **Process validation**: Confirms the application process is alive
- **Basic functionality**: Simple response capability check
- **Resource status**: Current memory and CPU usage
- **Process metadata**: PID, uptime, and basic system information

### 2. Deployment Monitoring and State Tracking

#### Features:
- **Real-time deployment tracking**: Monitor deployment progress and phases
- **Success/failure metrics**: Track deployment success rates and patterns
- **Rollback trigger detection**: Automated detection of deployment issues
- **Performance analysis**: Deployment duration and efficiency metrics
- **Cost tracking**: Estimate and track deployment costs

#### Deployment Phases Tracked:
- Build phase performance
- Test execution times
- Security scanning duration
- Deployment process timing
- Health check validation
- Post-deployment verification

#### API Endpoints:
- `GET /api/deployment-status` - Current deployment status and metrics
- `GET /api/performance-metrics` - Detailed performance analysis

### 3. Alerting and Notification Systems

#### Supported Channels:
- **Webhook notifications**: Custom webhook integrations
- **Slack integration**: Team notifications via Slack webhooks
- **Discord integration**: Discord channel notifications
- **Email notifications**: SMTP-based email alerts (configurable)

#### Notification Types:
- Deployment success/failure
- Rollback triggers
- Health check failures
- Performance degradation
- Service recovery
- System alerts

#### Configuration:
```bash
# Environment variables
NOTIFICATION_WEBHOOK_URL=https://your-webhook-url
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
SMTP_HOST=smtp.your-provider.com
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-password
```

### 4. Automated Rollback System

#### Rollback Strategies:
- **Immediate Rollback**: Instant rollback for critical issues
- **Canary Rollback**: Gradual traffic reduction from new version
- **Blue-Green Rollback**: Switch traffic back to previous environment

#### Rollback Triggers:
- Health check failures (threshold: 3 consecutive failures)
- High error rates (threshold: 5% error rate)
- Response time degradation (threshold: >5 seconds)
- Memory usage spikes (threshold: >95% usage)
- Crash loop detection (threshold: 3 crashes in 3 minutes)

#### Safety Features:
- Cooldown periods between rollbacks
- Rate limiting (max 3 rollbacks per hour)
- Manual override capabilities
- Comprehensive validation during rollback

#### API Endpoints:
- `POST /api/trigger-rollback` - Manual rollback trigger
- `GET /api/rollback-status` - Rollback system status

### 5. Performance Monitoring

#### Metrics Tracked:
- **Deployment Performance**: Build times, test duration, deployment phases
- **Resource Usage**: CPU, memory, disk, and network utilization
- **Response Times**: API endpoint performance and latency
- **Cost Analysis**: CI/CD pipeline costs and resource expenses
- **Efficiency Metrics**: Parallel execution efficiency and optimization opportunities

#### Performance Baselines:
- Automatic baseline calculation from recent deployments
- Performance trend analysis
- Anomaly detection and alerting
- Comparative analysis across environments

### 6. Integrated Monitoring Dashboard

#### Unified Data Sources:
- Health monitoring integration
- Deployment status correlation
- Performance metrics aggregation
- Alert consolidation
- Cross-system relationship analysis

#### Dashboard Endpoints:
- `GET /api/monitoring-dashboard` - Comprehensive system overview
- `GET /api/performance-dashboard` - Performance-focused metrics

## Configuration

### Environment Variables

```bash
# Core Application
NODE_ENV=production|staging|development
APP_VERSION=1.0.0
IMAGE_TAG=production-abc1234
BUILD_TIMESTAMP=2025-01-XX
DEPLOYMENT_SLOT=blue|green
DEPLOYED_AT=2025-01-XX T XX:XX:XX.XXXZ

# Health Monitoring
HEALTH_CHECK_ENABLED=true
HEALTH_CHECK_INTERVAL=30s
HEALTH_CHECK_TIMEOUT=10s
HEALTH_CHECK_RETRIES=3
UPTIME_KUMA_HOST=192.168.1.236
UPTIME_KUMA_PORT=3001
MINECRAFT_HOST=192.168.1.232

# Notifications
NOTIFICATION_WEBHOOK_URL=https://your-webhook-url
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
NOTIFICATION_FROM_EMAIL=noreply@renekris.dev
NOTIFICATION_TO_EMAIL=admin@renekris.dev

# Rollback Automation
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
ROLLBACK_WEBHOOK_URL=https://api.github.com/repos/...

# Performance Monitoring
ENABLE_METRICS=true
CONTAINER_MEMORY_LIMIT=1073741824
```

### Docker Configuration

The enhanced Dockerfile includes all monitoring modules:

```dockerfile
# Copy enhanced monitoring server and all modules
COPY --from=build --chown=nextjs:nodejs /app/src/server/production-server.js ./server.js
COPY --from=build --chown=nextjs:nodejs /app/src/server/health-monitor.js ./health-monitor.js
COPY --from=build --chown=nextjs:nodejs /app/src/server/deployment-monitor.js ./deployment-monitor.js
COPY --from=build --chown=nextjs:nodejs /app/src/server/notification-system.js ./notification-system.js
COPY --from=build --chown=nextjs:nodejs /app/src/server/rollback-automation.js ./rollback-automation.js
COPY --from=build --chown=nextjs:nodejs /app/src/server/performance-monitor.js ./performance-monitor.js
COPY --from=build --chown=nextjs:nodejs /app/src/server/monitoring-dashboard-integration.js ./monitoring-dashboard-integration.js

# Enhanced health check with comprehensive validation
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8080/health && curl -f http://localhost:8080/ready || exit 1
```

## Testing

### Comprehensive Test Suite

Run the monitoring system tests:

```bash
# Start the server
node src/server/production-server.js

# In another terminal, run tests
node test-monitoring-system.js
```

### Test Coverage:
- Health endpoint validation
- Readiness probe testing
- Liveness probe verification
- Monitoring dashboard functionality
- Performance metrics accuracy
- API endpoint responsiveness
- Rollback trigger validation
- Response header validation
- Load testing
- Error handling verification

## Integration with CI/CD

### GitHub Actions Integration

The monitoring system integrates with existing GitHub Actions workflows:

1. **Build Phase**: Performance tracking starts
2. **Test Phase**: Test execution time monitoring
3. **Security Scan**: Vulnerability scan duration tracking
4. **Deployment**: Real-time deployment progress
5. **Health Validation**: Post-deployment health verification
6. **Notification**: Success/failure notifications

### Rollback Integration

Automated rollback triggers integrate with infrastructure repository:

```yaml
# Triggered rollback event
event_type: emergency-rollback
client_payload:
  environment: production
  rollback_reason: health_check_failures
  strategy: immediate
  priority: critical
```

## Security Considerations

### Security Features:
- Non-root container execution
- Minimal attack surface
- Secure secret management
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- CORS protection
- Security headers implementation

### Access Control:
- Health endpoints are publicly accessible (required for load balancers)
- Administrative endpoints require authentication (if implemented)
- Sensitive data is excluded from public endpoints
- Monitoring data is sanitized

## Troubleshooting

### Common Issues:

1. **Health Check Failures**:
   - Check dependency connectivity
   - Verify resource thresholds
   - Review application logs
   - Validate environment configuration

2. **Deployment Monitoring Issues**:
   - Ensure proper environment variables
   - Check file system permissions
   - Verify GitHub token configuration

3. **Notification Failures**:
   - Validate webhook URLs
   - Check network connectivity
   - Review notification queue status

4. **Performance Monitoring Problems**:
   - Verify resource monitoring permissions
   - Check file system write access
   - Review performance thresholds

### Debugging Commands:

```bash
# Check monitoring system status
curl http://localhost:8080/api/monitoring-dashboard

# Validate health endpoint
curl -v http://localhost:8080/health

# Test readiness
curl http://localhost:8080/ready

# Check performance metrics
curl http://localhost:8080/api/performance-dashboard

# View deployment status
curl http://localhost:8080/api/deployment-status
```

## Future Enhancements

### Planned Improvements:
- Machine learning-based anomaly detection
- Predictive scaling recommendations
- Advanced cost optimization analysis
- Integration with external monitoring platforms
- Custom metric collection and alerting
- Advanced rollback strategies (canary, blue-green)
- Real-time dashboards with WebSocket support

## Conclusion

This comprehensive monitoring system provides enterprise-grade health checks, deployment tracking, automated rollback capabilities, and performance monitoring. It ensures high availability, rapid incident response, and continuous system optimization for the renekris.dev infrastructure.

The system is designed to be:
- **Reliable**: Comprehensive validation and error handling
- **Scalable**: Efficient resource usage and performance optimization
- **Maintainable**: Modular architecture and clear separation of concerns
- **Observable**: Detailed metrics and logging for troubleshooting
- **Secure**: Security-first design with minimal attack surface

For questions or support, refer to the troubleshooting section or review the detailed API documentation in the respective module files.