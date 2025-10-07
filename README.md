# drksci-agency

AI-powered proposal generator using Presenton, deployed on Fly.io with drksci brand styling.

## Features

- 🤖 Self-hosted Presenton for AI-powered proposal generation
- 📄 Multiple proposal templates (technical, business, research)
- 🎨 Consistent drksci brand styling
- 📊 Export to HTML and PDF
- 🔧 Web UI and API interfaces
- 🐳 Docker containerized deployment
- 🚀 Deployed on Fly.io

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

### Deploy to Fly.io

See [FLY_DEPLOYMENT.md](FLY_DEPLOYMENT.md) for detailed deployment instructions.

```bash
fly auth login
fly launch --no-deploy
fly secrets set ANTHROPIC_API_KEY=your_key_here
fly deploy
```

## Project Structure

```
drksci-agency/
├── templates/           # Nunjucks templates for proposals
├── config/              # Configuration files
├── lib/                 # Core libraries
│   ├── generator.js     # AI proposal generator
│   ├── exporter.js      # HTML/PDF export
│   └── templates.js     # Template manager
├── proposals/           # Generated proposals output
├── cli.js               # Command-line interface
├── server.js            # Express API server
└── build-proposals.js   # Batch generation
```

## Usage

### Web UI

Visit https://studio.drksci.com (or your deployed URL) to use the web interface.

### API

Presenton API endpoint:

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

## Templates

Available proposal templates:

- **technical**: Technical architecture and implementation proposals
- **business**: Business cases and strategic proposals
- **research**: Research proposals and grant applications
- **pitch**: Startup pitch decks and investor proposals
- **consulting**: Consulting engagement proposals

## Configuration

Edit `config/defaults.json` to customize:

- Default tone and style
- Section templates
- Brand colors and fonts
- Export settings

## License

Private - drksci
