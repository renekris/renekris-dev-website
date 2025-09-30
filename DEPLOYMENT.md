# Deployment Guide

## Unified Stack Structure

This project uses a **single stack template** (`stack.yml`) with **environment-specific configuration files** (`.env.production`, `.env.staging`).

### Why This Approach?

**Before**: Separate `production/stack.yml` and `staging/stack.yml` with 90% duplication
**Now**: Single template + environment variables = DRY principle

### Files Structure

```
renekris-dev-website/
├── stack.yml              # Unified stack template
├── .env.production        # Production configuration
├── .env.staging          # Staging configuration
└── deploy-stack.sh       # Helper script
```

---

## Deploying via Portainer

### Production Deployment

1. Go to **Stacks** → **Add stack**
2. **Name**: `production-website`
3. **Build method**: Select **"Upload"** or **"Web editor"**
4. Paste contents of `stack.yml`
5. Click **"Load variables from .env file"**
6. Upload `.env.production` file
7. **Deploy the stack**

### Staging Deployment

Same steps but:
- **Name**: `staging-website`
- **Load**: `.env.staging` file

---

## Deploying via CLI

### Prerequisites
```bash
# Ensure .env files are on the server
scp .env.production root@192.168.1.236:/opt/stacks/website/
scp .env.staging root@192.168.1.236:/opt/stacks/website/
scp stack.yml root@192.168.1.236:/opt/stacks/website/
```

### Deploy Production
```bash
cd /opt/stacks/website
docker stack deploy -c stack.yml --env-file .env.production production-website
```

### Deploy Staging
```bash
cd /opt/stacks/website
docker stack deploy -c stack.yml --env-file .env.staging staging-website
```

---

## Key Differences Between Environments

| Setting | Production | Staging | Reason |
|---------|-----------|---------|--------|
| **Replicas** | 2 | 1 | High availability vs cost |
| **CPU Limit** | 0.8 cores | 0.4 cores | Resource efficiency |
| **Memory Limit** | 512M | 256M | Production needs more |
| **Log Level** | `info` | `debug` | Testing verbosity |
| **Update Delay** | 60s | 10s | Production = cautious |
| **Sticky Sessions** | `true` | `false` | Production consistency |
| **Metrics** | Enabled | Disabled | Production monitoring |
| **Traefik Middleware** | Security headers | None | Production hardening |

---

## Updating Configuration

### To change a setting:

1. **Edit the `.env` file**:
   ```bash
   # Example: Increase production replicas to 3
   vim .env.production
   # Change: REPLICAS=3
   ```

2. **Redeploy the stack**:
   - **Portainer**: Stacks → Click stack → **Editor** → **Update stack**
   - **CLI**: Re-run deploy command above

3. **Docker Swarm automatically**:
   - Rolling update with zero downtime
   - Respects your update strategy
   - Rollback on failure

---

## CI/CD Integration

Your GitHub Actions workflow automatically:

1. **Builds** the image with correct tag:
   - `renekris-website:production-latest`
   - `renekris-website:staging-latest`

2. **Updates** the service:
   ```bash
   docker service update --image renekris-website:production-latest production-website_web
   ```

3. **Swarm handles**:
   - Zero-downtime rolling update
   - Health check verification
   - Automatic rollback on failure

**No manual deployment needed** - just push code!

---

## Common Operations

### View Service Status
```bash
# List all stacks
docker stack ls

# List services in stack
docker stack services production-website

# View service details
docker service ps production-website_web

# View logs
docker service logs production-website_web --follow
```

### Scale Replicas
```bash
docker service scale production-website_web=3
```

### Update Single Setting
```bash
# Example: Change memory limit
docker service update --limit-memory 1G production-website_web
```

### Rollback
```bash
docker service rollback production-website_web
```

---

## Environment Variables Reference

### Required Variables
- `ENVIRONMENT` - Environment name (production/staging)
- `DOMAIN` - Primary domain
- `REPLICAS` - Number of containers

### Resource Variables
- `CPU_LIMIT` - Maximum CPU cores
- `CPU_RESERVE` - Guaranteed CPU cores
- `MEMORY_LIMIT` - Maximum memory
- `MEMORY_RESERVE` - Guaranteed memory
- `MAX_PER_NODE` - Max replicas per Swarm node

### Node.js Variables
- `MAX_MEMORY` - Node.js heap size (MB)
- `THREAD_POOL` - UV thread pool size
- `LOG_LEVEL` - Logging verbosity

### Health Check Variables
- `HEALTH_INTERVAL` - Time between checks
- `HEALTH_TIMEOUT` - Check timeout
- `HEALTH_RETRIES` - Failures before unhealthy
- `HEALTH_START` - Grace period on startup

### Traefik Variables
- `MIDDLEWARES` - Applied middleware chain
- `PRIORITY` - Router priority
- `STICKY_SESSIONS` - Enable session affinity
- `EXTRA_HOSTS` - Additional domains

---

## Troubleshooting

### Stack won't deploy
```bash
# Check syntax
docker stack config -c stack.yml --env-file .env.production

# View error logs
docker service ps production-website_web --no-trunc
```

### Service keeps restarting
```bash
# Check health
docker service inspect production-website_web --format '{{.UpdateStatus.State}}'

# View container logs
docker service logs production-website_web --tail 100
```

### Can't access via domain
```bash
# Verify Traefik sees the service
docker service logs traefik | grep production

# Check routing
curl -H "Host: renekris.dev" http://192.168.1.236
```

---

## Migration from Old Structure

If you have existing `environments/production/stack.yml`:

1. **Backup current deployment**:
   ```bash
   docker service inspect production-website_web > backup.json
   ```

2. **Remove old stacks** in Portainer

3. **Deploy new unified stacks** using steps above

4. **Verify** both environments work

5. **Delete old files**:
   ```bash
   rm -rf environments/
   ```