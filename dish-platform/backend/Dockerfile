FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S dish -u 1001

# Create uploads directory
RUN mkdir -p uploads && chown -R dish:nodejs uploads

# Switch to non-root user
USER dish

EXPOSE 3001

CMD ["npm", "start"]