# --------------------------
# Stage 1: Base
# --------------------------
FROM node:20-alpine AS base

# Set working directory
WORKDIR /usr/src/app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source and Prisma schema
COPY . .


# --------------------------
# Stage 2: Development
# --------------------------
FROM base AS development

# Expose port for dev server
EXPOSE ${PORT}

# Use dev environment
ENV NODE_ENV=development

# Command for hot-reload development
CMD ["pnpm", "run", "dev"]

