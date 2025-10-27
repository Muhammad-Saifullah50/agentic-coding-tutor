# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
# COPY prisma ./prisma           
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Expose port
EXPOSE 3000

# Start in dev mode (for docker-compose local dev)
CMD ["npm", "run", "dev"]
