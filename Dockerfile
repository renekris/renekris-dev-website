# Build stage
FROM node:18-alpine as build
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY public/ ./public/
COPY src/ ./src/

# Build the React application
RUN npm run build

# Production stage - Use Node.js to serve both static files and API
FROM node:18-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built React app
COPY --from=build /app/build ./build

# Copy API server
COPY src/server/api-server.js ./server.js

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

EXPOSE 8080
CMD ["node", "server.js"]