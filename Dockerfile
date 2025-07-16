FROM node:lts-alpine as build

# Set working directory
WORKDIR /app

# Ensure no local node_modules are accidentally copied
COPY package*.json ./

# Clean npm cache to avoid cache corruption issues
RUN npm cache clean --force

# Install dependencies using clean install
RUN npm install

# Copy remaining source files AFTER install
COPY . .

# Build your app
RUN npm run build


# --- Production stage ---
FROM nginx:alpine

# Copy nginx config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built app from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
