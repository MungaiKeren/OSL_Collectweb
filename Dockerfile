# Stage 1: Build stage
FROM node:20.11.1-alpine3.19 as build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies using npm
RUN npm install --legacy-peer-deps

# Copy the rest of the application source code into the container
COPY . .

# Build the React application using react-app-rewired
RUN npm install react-app-rewired && \
    npx react-app-rewired build

# Stage 2: Production stage
FROM nginx:1.21.3-alpine

# Copy nginx configuration file
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built React application from the build stage
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Command to start nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]