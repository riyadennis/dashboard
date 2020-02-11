# The Node version that we'll be running for our version of React.
# You may have to search the Node directory for a version that fits
# the version of React you're using.
FROM node:8.9-alpine

# Create a work directory and copy over our dependency manifest files.
RUN mkdir /dashboard
WORKDIR /dashboard
COPY . /dashboard

RUN npm install --silent && mv node_modules ../

# Expose PORT 3000 on our virtual machine so we can run our server
EXPOSE 3000
