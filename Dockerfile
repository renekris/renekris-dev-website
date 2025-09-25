# syntax=docker/dockerfile:1.7

# Build dependencies stage - optimized for caching
FROM node:20-alpine AS dependencies

# Set build-time arguments for optimization
ARG BUILDKIT_INLINE_CACHE=1
ARG NODE_ENV=production

# Install system dependencies with security updates
RUN apk add --no-cache \
    ca-certificates \
    tini \
    && apk upgrade --no-cache

WORKDIR /app

# Copy package files for dependency resolution
COPY package*.json ./

# Install dependencies with advanced caching and optimization
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    --mount=type=cache,target=/root/.cache,sharing=locked \
    --mount=type=cache,target=/tmp/.npm-cache,sharing=locked \
    --mount=type=bind,source=package-lock.json,target=/app/package-lock.json,readonly \
    npm ci \
        --omit=dev \
        --prefer-offline \
        --cache /tmp/.npm-cache \
        --no-audit \
        --no-fund \
        --ignore-scripts \
        --production=false

# Build stage - optimized for React app compilation
FROM dependencies AS build

# Set build environment variables
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false
ENV CI=true
ENV INLINE_RUNTIME_CHUNK=false

# Copy configuration files first (least frequently changed)
COPY --chown=node:node tailwind.config.js postcss.config.js ./

# Copy source files with specific order for better caching
COPY --chown=node:node public/ ./public/
COPY --chown=node:node src/ ./src/

# Build application with comprehensive caching
RUN --mount=type=cache,target=/root/.cache,sharing=locked \
    --mount=type=cache,target=/app/node_modules/.cache,sharing=locked \
    --mount=type=cache,target=/tmp/webpack-cache,sharing=locked \
    --mount=type=cache,target=/tmp/babel-cache,sharing=locked \
    --mount=type=cache,target=/tmp/terser-cache,sharing=locked \
    --mount=type=cache,target=/tmp/css-cache,sharing=locked \
    BABEL_CACHE_PATH=/tmp/babel-cache \
    WEBPACK_CACHE_PATH=/tmp/webpack-cache \
    npm run build

# Minimize build artifacts
RUN rm -rf node_modules/.cache src public

# Runtime base - distroless for security
FROM gcr.io/distroless/nodejs20-debian12:nonroot AS runtime-base

# Production runtime stage
FROM runtime-base AS runtime

# Set runtime labels for metadata
LABEL org.opencontainers.image.title="Renekris Dev Website" \
      org.opencontainers.image.description="Optimized React website with monitoring" \
      org.opencontainers.image.vendor="Renekris" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.source="https://github.com/renekris/renekris-dev-website"

# Create application directories with proper ownership
USER 0
RUN mkdir -p /app /tmp/app-cache && \
    chown -R 65532:65532 /app /tmp/app-cache && \
    chmod 755 /app && \
    chmod 750 /tmp/app-cache
USER 65532

WORKDIR /app

# Copy built application with minimal footprint and strict permissions
COPY --from=build --chown=65532:65532 --chmod=644 /app/build ./build
COPY --from=build --chown=65532:65532 --chmod=644 /app/src/server/api-server.js ./server.js

# Runtime environment configuration with security hardening
ENV NODE_ENV=production \
    PORT=8080 \
    HOST=0.0.0.0 \
    NODE_OPTIONS="--max-old-space-size=512 --max-http-header-size=8192" \
    NODE_TLS_REJECT_UNAUTHORIZED=1 \
    UV_THREADPOOL_SIZE=4

# Health check with optimized parameters
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
    CMD ["node", "-e", "require('http').get('http://localhost:8080/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"]

EXPOSE 8080

# Use distroless nonroot user with explicit UID
USER 65532:65532

# Start application with security constraints
CMD ["node", "server.js"]

# Alternative runtime with debugging capabilities (for development only)
FROM node:20-alpine AS runtime-debug

# Install minimal debugging tools
RUN apk add --no-cache \
    curl \
    tini \
    ca-certificates \
    && apk upgrade --no-cache \
    && rm -rf /var/cache/apk/*

# Create consistent nonroot user (65532:65532 for compatibility)
RUN mkdir -p /app /tmp/app-cache && \
    chown -R 65532:65532 /app /tmp/app-cache && \
    chmod 755 /app && \
    chmod 750 /tmp/app-cache

WORKDIR /app

# Copy application from build stage with strict permissions
COPY --from=build --chown=65532:65532 --chmod=644 /app/build ./build
COPY --from=build --chown=65532:65532 --chmod=644 /app/src/server/api-server.js ./server.js

# Standardized runtime configuration
ENV NODE_ENV=production \
    PORT=8080 \
    HOST=0.0.0.0 \
    NODE_OPTIONS="--max-old-space-size=512 --max-http-header-size=8192" \
    NODE_TLS_REJECT_UNAUTHORIZED=1 \
    UV_THREADPOOL_SIZE=4

# Standardized health check
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

EXPOSE 8080

# Use standardized nonroot user
USER 65532:65532

ENTRYPOINT ["tini", "--"]
CMD ["node", "server.js"]