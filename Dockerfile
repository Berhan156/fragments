# Stage 1: Build the application
FROM node:lts AS build

LABEL maintainer="Berhan Berhan <bberhan1@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# Reduce npm spam when installing within Docker
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable color when run inside Docker
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into the working dir
COPY package.json package-lock.json ./

# Install node production dependencies defined in package-lock.json
RUN npm ci --only=production

# Copy the rest of the application code
COPY ./src ./src

# Run tests or build steps here if needed
# RUN npm test

# Stage 2: Create the runtime image
FROM node:lts

LABEL maintainer="Berhan Berhan <bberhan1@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# Use /app as our working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app .

# We run our service on the configured port
EXPOSE $PORT

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Add a healthcheck to ensure the service is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/health || exit 1

# Run the server
CMD ["npm", "start"]
