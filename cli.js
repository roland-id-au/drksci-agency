#!/usr/bin/env node

require('dotenv').config();
const { Command } = require('commander');
const ProposalGenerator = require('./lib/generator');
const TemplateManager = require('./lib/templates');
const ProposalExporter = require('./lib/exporter');

const program = new Command();

program
  .name('drksci-agency')
  .description('AI-powered proposal generator for drksci')
  .version('0.1.0');

program
  .command('generate')
  .description('Generate a new proposal')
  .requiredOption('-t, --topic <topic>', 'Proposal topic')
  .option('--type <type>', 'Proposal type (technical, business, research, pitch, consulting)', 'technical')
  .option('-c, --client <client>', 'Client name')
  .option('-s, --sections <number>', 'Number of sections', '5')
  .option('--tone <tone>', 'Writing tone (professional, casual, formal)', 'professional')
  .option('--context <context>', 'Additional context')
  .option('-o, --output <filename>', 'Output filename (without extension)')
  .option('--format <format>', 'Output format (html, json, both)', 'both')
  .action(async (options) => {
    try {
      console.log('🚀 Generating proposal...\n');

      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        console.error('❌ Error: ANTHROPIC_API_KEY not found in environment variables');
        console.error('Please set it in your .env file or environment');
        process.exit(1);
      }

      const generator = new ProposalGenerator(apiKey);
      const templateManager = new TemplateManager();
      const exporter = new ProposalExporter();

      // Generate proposal content
      const proposalData = await generator.generate({
        type: options.type,
        topic: options.topic,
        client: options.client,
        sections: parseInt(options.sections),
        tone: options.tone,
        additionalContext: options.context
      });

      console.log(`✓ Generated proposal: "${proposalData.title}"\n`);

      // Render with template
      const html = templateManager.render('proposal', proposalData);

      // Determine output filename
      const filename = options.output || exporter.generateFilename(options.topic);

      // Export based on format
      if (options.format === 'html' || options.format === 'both') {
        await exporter.exportHTML(html, filename);
      }

      if (options.format === 'json' || options.format === 'both') {
        await exporter.exportJSON(proposalData, filename);
      }

      console.log('\n✨ Done!');
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('list-templates')
  .description('List available proposal templates')
  .action(() => {
    const templateManager = new TemplateManager();
    const templates = templateManager.listTemplates();

    console.log('Available templates:\n');
    templates.forEach(template => {
      console.log(`  - ${template}`);
    });
  });

program.parse();
