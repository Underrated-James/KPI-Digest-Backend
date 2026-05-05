# Dockerfile for NestJS Backend
# ======================
# Install dependencies
# ======================
FROM node:22-alpine AS deps
WORKDIR /app

# Check for package-lock.json first
COPY package*.json ./
RUN npm ci

# ======================
# Build app
# ======================
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Run the build script
RUN npm run build

# ======================
# Run app
# ======================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built assets and necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# The port your NestJS app listens on
EXPOSE 3001

# Start the application
CMD ["npm", "run", "start:prod"]
