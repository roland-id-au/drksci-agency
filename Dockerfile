# Official Presenton Dockerfile
FROM node:20-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Clone Presenton official repository
RUN git clone https://github.com/presenton/presenton.git /app

# Install dependencies
RUN npm install

# Expose port
ENV PORT=8080
EXPOSE 8080

# Start Presenton
CMD ["npm", "start"]
