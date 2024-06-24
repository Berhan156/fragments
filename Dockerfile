# Use a lighter base image and specify as build stage
FROM node:18.13.0-alpine as builder

LABEL maintainer="Berhan Berhan <bberhan1@myseneca.ca>"
LABEL description="Fragments node.js microservice build stage"

# Set environment variables
ENV PORT=8080 \
    NPM_CONFIG_LOGLEVEL=warn \
    NPM_CONFIG_COLOR=false

# Set working directory
WORKDIR /app

# Installing dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY ./src ./src
COPY ./tests/.htpasswd ./tests/.htpasswd

# Final stage for a smaller production image
FROM node:18.13.0-alpine

# Copy from builder
COPY --from=builder /app /app

# Set working directory
WORKDIR /app

# Expose the service on port 8080
EXPOSE 8080

# Run the server
CMD ["npm", "start"]
