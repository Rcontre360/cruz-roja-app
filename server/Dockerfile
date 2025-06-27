# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source files
COPY . .

# Build the app
RUN npm run build

# Generate Prisma client and sync schema with database
RUN npx prisma generate && npm run db

# Set environment variables
ENV NODE_ENV=production

# Start the server
CMD ["npm", "start"]

