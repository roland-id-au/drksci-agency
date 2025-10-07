# Fly.io Deployment Guide

## Setup

1. **Install Fly CLI** (if not already installed)
```bash
curl -L https://fly.io/install.sh | sh
```

2. **Login to Fly.io**
```bash
fly auth login
```

3. **Deploy the app**
```bash
cd ~/Projects/drksci-agency

# Launch (first time - will create the app)
fly launch --no-deploy

# When prompted:
# - App name: drksci-studio (or choose your own)
# - Region: Choose closest to you
# - Set up PostgreSQL? No
# - Set up Redis? No
# - Deploy now? No

# Set secrets
fly secrets set ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional: Add other AI providers
# fly secrets set OPENAI_API_KEY=your_key_here
# fly secrets set GOOGLE_API_KEY=your_key_here

# Deploy
fly deploy
```

4. **Configure Custom Domain**
```bash
# Add custom domain
fly certs create studio.drksci.com

# Fly will give you DNS records to add in Cloudflare:
# - Type: CNAME
# - Name: studio
# - Target: drksci-studio.fly.dev (or the URL provided)

# Check certificate status
fly certs check studio.drksci.com
```

## Cloudflare DNS Update

Update the existing A record in Cloudflare:

**Option 1: Update existing record**
- Type: CNAME
- Name: studio
- Target: drksci-studio.fly.dev
- Proxy: Disabled (grey cloud) for Fly.io

**Option 2: Keep A record, get Fly.io IPs**
```bash
fly ips list
```
Then update the A record to point to Fly's IP addresses.

## Verify Deployment

```bash
# Check app status
fly status

# View logs
fly logs

# Open in browser
fly open

# Test the API
curl https://studio.drksci.com/health
```

## Useful Commands

```bash
# View app info
fly info

# SSH into the container
fly ssh console

# Scale (if needed)
fly scale memory 1024

# View secrets
fly secrets list

# Update a secret
fly secrets set KEY=VALUE

# Restart app
fly apps restart drksci-studio
```

## Presenton Configuration

Presenton will be accessible at `https://drksci-studio.fly.dev` (or your custom domain).

API endpoint: `POST /api/v1/ppt/presentation/generate`

Example usage:
```bash
curl -X POST https://studio.drksci.com/api/v1/ppt/presentation/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "AI-powered customer insights",
    "slides": 10,
    "language": "en",
    "tone": "professional"
  }'
```

## Costs

- Free tier: 3 shared-cpu VMs with 256MB RAM each
- Current config uses 512MB RAM (still free if only 1 instance)
- Auto-suspend after inactivity to save resources
