# Use the latest Node.js version (22)
FROM node:22

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application files
COPY . .

# Set environment variable for the port
ENV PORT=4000

# Expose port 4000
EXPOSE 4000

# Start the server (Ensure index.js exists)
CMD ["node", "index.js"]
