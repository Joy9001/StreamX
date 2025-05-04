# Use official Node.js image
FROM node:20

# Create app directory
WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy rest of the application code
COPY . .

# Expose port
EXPOSE 3000

WORKDIR /app/server

# Run the app
CMD ["npm", "start"]
