# Node 20 LTS (Node 18 is end-of-life)
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Copy .env.docker to .env
COPY .env.docker .env

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Docker marks the container unhealthy if /api/health stops returning 200
# (for example when the database is unreachable). busybox wget fails on 4xx/5xx.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:3000/api/health || exit 1

# Start the application
CMD ["npm", "start"]