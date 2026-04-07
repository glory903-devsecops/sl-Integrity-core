FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (use ci for reproducible builds if lockfile is present)
RUN npm install

# Copy frontend code
COPY . .

# Expose port (Vite default)
EXPOSE 5173

# Start the application in dev mode with --host for network access
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
