# syntax = docker/dockerfile:1

# === BASE IMAGE ===
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package.json and lockfile
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev # Or npm install if ci fails

# === BUILD STAGE ===
FROM base AS builder

# Copy the rest of the application's source code
COPY . .

# Build the Next.js application
RUN npm run build

# === PRODUCTION STAGE ===
FROM node:20-alpine AS production

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json # Or yarn.lock if using yarn

# Install only production dependencies (very important for smaller image size)
RUN npm ci --omit=dev

# Next.js Standalone Mode: Copy the standalone server (if you configured output: 'standalone')
COPY --from=builder /app/.next/standalone ./

# Expose the port Next.js will run on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV production
ENV PORT 3000

# Command to start the Next.js server
CMD ["node", "server.js"]
