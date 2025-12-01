# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the Angular app for production
RUN npm run build -- --configuration production

# Production stage
FROM nginx:alpine

# Copy nginx configuration
COPY nginx/conf.d/default.conf.template /etc/nginx/conf.d/default.conf

# Copy built Angular app
COPY --from=build /app/dist /app

# Expose port
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
