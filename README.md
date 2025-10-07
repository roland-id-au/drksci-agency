# drksci-agency

Self-hosted Presenton deployment on Fly.io for AI-powered presentation generation.

## What is this?

This repo deploys [Presenton](https://github.com/presenton/presenton) - an open-source AI presentation generator - to Fly.io at **studio.drksci.com**.

## Deploy to Fly.io

```bash
# Clone this repo
git clone https://github.com/roland-id-au/drksci-agency.git
cd drksci-agency

# Login to Fly.io
fly auth login

# Launch (creates app)
fly launch --no-deploy

# Set your API keys
fly secrets set ANTHROPIC_API_KEY=your_key_here

# Deploy
fly deploy
```

Full deployment instructions in [FLY_DEPLOYMENT.md](FLY_DEPLOYMENT.md).

## Usage

Once deployed, use Presenton's API:

```bash
curl -X POST https://studio.drksci.com/api/v1/ppt/presentation/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "AI in Healthcare",
    "slides": 10,
    "language": "en",
    "format": "pptx"
  }'
```

## Configuration

Presenton supports multiple AI providers. Set via Fly.io secrets:

```bash
fly secrets set ANTHROPIC_API_KEY=your_key
fly secrets set OPENAI_API_KEY=your_key
fly secrets set GOOGLE_API_KEY=your_key
```

## License

This deployment config is MIT. Presenton itself is Apache 2.0.
