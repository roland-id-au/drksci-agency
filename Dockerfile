# Use official Presenton Docker image
FROM ghcr.io/presenton/presenton:latest

# Expose port 80 (Presenton's default)
ENV PORT=80
EXPOSE 80
