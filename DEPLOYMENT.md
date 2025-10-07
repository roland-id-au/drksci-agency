# Deployment Guide: studio.drksci.com

## 1. Deploy to Vercel

```bash
cd ~/Projects/drksci-agency

# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (first time - follow prompts)
vercel

# When prompted:
# - Set up and deploy? Yes
# - Which scope? [Your account]
# - Link to existing project? No
# - Project name? drksci-agency
# - Directory? ./
# - Override settings? No

# Set environment variable
vercel env add ANTHROPIC_API_KEY production
# Paste: your_anthropic_api_key_here

# Deploy to production
vercel --prod
```

You'll get a URL like: `drksci-agency-xxx.vercel.app`

## 2. Configure Custom Domain in Vercel Dashboard

Option A: Via CLI (after initial deploy)
```bash
vercel domains add studio.drksci.com
```

Option B: Via Dashboard
1. Go to https://vercel.com/dashboard
2. Select `drksci-agency` project
3. Settings → Domains
4. Add `studio.drksci.com`

Vercel will provide DNS records to configure.

## 3. Configure Cloudflare DNS

### Option A: Cloudflare CLI (Recommended)

```bash
# Install Cloudflare CLI (Wrangler)
npm install -g wrangler

# Login
wrangler login

# Add CNAME record pointing to Vercel
wrangler dns create drksci.com CNAME studio cname.vercel-dns.com --proxy

# Or if you need the A records (Vercel will show you the IPs)
# wrangler dns create drksci.com A studio 76.76.21.21
```

### Option B: Cloudflare Dashboard

1. Go to https://dash.cloudflare.com
2. Select `drksci.com` domain
3. DNS → Records → Add Record
   - Type: `CNAME`
   - Name: `studio`
   - Target: `cname.vercel-dns.com`
   - Proxy status: Proxied (orange cloud)
   - TTL: Auto

## 4. Verify Deployment

```bash
# Test the API
curl https://studio.drksci.com/api/health

# Test in browser
open https://studio.drksci.com
```

## Quick Deploy Commands

```bash
# Full deployment workflow
cd ~/Projects/drksci-agency
vercel --prod
vercel domains add studio.drksci.com

# Then configure Cloudflare DNS (see above)
```

## Updating Environment Variables

```bash
# Add/update env var
vercel env add ANTHROPIC_API_KEY production

# List env vars
vercel env ls

# Remove env var
vercel env rm ANTHROPIC_API_KEY production
```

## Troubleshooting

1. **CNAME already exists**: Remove old record in Cloudflare first
2. **Domain verification fails**: Ensure Cloudflare proxy is enabled (orange cloud)
3. **API errors**: Check logs with `vercel logs`
4. **502 errors**: Check function timeout (increase in vercel.json if needed)
