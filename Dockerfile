# syntax = docker/dockerfile:1

# Base stage for dependencies
FROM node:20-alpine AS base

# Set environment variables
ARG PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install
RUN npm ci

# Build stage
FROM base AS build

# Copy source code
COPY . .

# Build Next.js app in standalone mode
RUN npm run build

# Production stage
FROM base AS production

# Set environment variables
ENV NODE_ENV=production
ENV PORT=$PORT

# Copy built files
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/public ./public

# Expose port
EXPOSE $PORT

# Start command
CMD ["node", "server.js"]
