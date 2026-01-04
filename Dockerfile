# The Node version that we'll be running for our version of React.
# React 18 requires Node 14+, using Node 18 LTS
FROM node:18-alpine

# Create a work directory and copy over our dependency manifest files.
RUN mkdir /dashboard
WORKDIR /dashboard
COPY package*.json ./

# Install dependencies
RUN npm install --silent

# Copy the rest of the application
COPY . .

# Expose PORT 3000 on our virtual machine so we can run our server
EXPOSE 3000

# The start command will be handled by docker-compose
CMD ["npm", "start"]
