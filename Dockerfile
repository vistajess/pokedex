# Use Node 18.20.7 as the base image
FROM node:18.20.7

# Set working directory
WORKDIR /app

# Install Angular CLI globally
RUN npm install -g @angular/cli@13

# Set npm to ignore peer dependency issues
RUN npm config set legacy-peer-deps true

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# For development server
EXPOSE 4200

# Command to run the development server
CMD ["ng", "serve", "--host", "0.0.0.0", "--disable-host-check"]