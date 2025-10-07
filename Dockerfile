# Use official Presenton base or build from scratch
FROM node:20-slim

WORKDIR /app

# Install dependencies for Presenton
RUN apt-get update && apt-get install -y \
    git \
    python3 \
    python3-pip \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Clone Presenton (we'll use the official repo)
RUN git clone https://github.com/presenton/presenton.git /presenton

WORKDIR /presenton

# Install Presenton dependencies
RUN npm install

# Copy our custom configuration
COPY . /app

# Environment variables will be set via Fly.io
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Start Presenton
CMD ["npm", "start"]
