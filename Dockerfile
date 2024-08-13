# Stage 1: Build the application
FROM node:18.17.0 AS build

LABEL maintainer="Berhan Berhan <bberhan1@myseneca.ca>"
LABEL description="Fragments node.js microservice build stage"

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and tests
COPY ./src ./src
COPY ./tests/.htpasswd ./tests/.htpasswd

# Stage 2: Create the runtime image
FROM node:18.17.0

LABEL maintainer="Berhan Berhan <bberhan1@myseneca.ca>"
LABEL description="Fragments node.js microservice build stage"

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app /app

# Expose the port the app runs on
EXPOSE 8080

# Default environment variables
ENV PORT=8080
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

# Start the application
CMD ["node", "src/index.js"]
