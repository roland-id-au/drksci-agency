# drksci-agency

AI-powered proposal generator leveraging the drksci-landing style and Presenton-inspired architecture.

## Features

- 🤖 AI-powered proposal generation using Claude/GPT
- 📄 Multiple proposal templates (technical, business, research)
- 🎨 Consistent drksci brand styling
- 📊 Export to HTML and PDF
- 🔧 CLI and API interfaces
- 🔒 Privacy-focused with local data processing

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Generate a proposal via CLI
npm run generate -- --type technical --topic "AI-powered customer insights platform"

# Start development server
npm run dev
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

### CLI

```bash
# Generate a technical proposal
node cli.js generate --type technical --topic "Your topic here"

# Generate with custom parameters
node cli.js generate \
  --type business \
  --topic "Market expansion strategy" \
  --client "Acme Corp" \
  --sections 5 \
  --tone professional

# List available templates
node cli.js list-templates
```

### API

```bash
# Start the server
npm run dev

# POST to /api/generate
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "technical",
    "topic": "Cloud migration strategy",
    "client": "Example Corp",
    "sections": 6
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
