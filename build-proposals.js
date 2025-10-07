require('dotenv').config();
const fs = require('fs');
const path = require('path');
const ProposalGenerator = require('./lib/generator');
const TemplateManager = require('./lib/templates');
const ProposalExporter = require('./lib/exporter');

async function buildProposals() {
  const configPath = path.join(__dirname, 'config/batch-proposals.json');

  if (!fs.existsSync(configPath)) {
    console.log('No batch configuration found. Creating example...');

    const exampleConfig = {
      proposals: [
        {
          type: 'technical',
          topic: 'AI-Powered Customer Analytics Platform',
          client: 'Example Corp',
          sections: 6,
          tone: 'professional'
        },
        {
          type: 'business',
          topic: 'SaaS Expansion Strategy for European Market',
          sections: 7,
          tone: 'professional'
        }
      ]
    };

    fs.writeFileSync(configPath, JSON.stringify(exampleConfig, null, 2));
    console.log(`Created example config at: ${configPath}`);
    console.log('Edit this file and run again to generate proposals.');
    return;
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const generator = new ProposalGenerator(process.env.ANTHROPIC_API_KEY);
  const templateManager = new TemplateManager();
  const exporter = new ProposalExporter();

  console.log(`🚀 Building ${config.proposals.length} proposals...\n`);

  for (const proposalConfig of config.proposals) {
    try {
      console.log(`Generating: ${proposalConfig.topic}...`);

      const proposalData = await generator.generate(proposalConfig);
      const html = templateManager.render('proposal', proposalData);
      const filename = exporter.generateFilename(proposalConfig.topic);

      await exporter.exportHTML(html, filename);
      await exporter.exportJSON(proposalData, filename);

      console.log(`✓ Completed: ${filename}\n`);
    } catch (error) {
      console.error(`❌ Error generating "${proposalConfig.topic}":`, error.message);
    }
  }

  console.log('✨ All proposals generated!');
}

buildProposals().catch(console.error);
