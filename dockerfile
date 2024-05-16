# Use the official Node.js image as the base image
FROM node:latest

# Set the working directory
WORKDIR /usr/app/src

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Expose the port that the app runs on
# EXPOSE 80

# Command to run the app
CMD ["node", "app.js"]