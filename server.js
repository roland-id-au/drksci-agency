require('dotenv').config();
const express = require('express');
const ProposalGenerator = require('./lib/generator');
const TemplateManager = require('./lib/templates');
const ProposalExporter = require('./lib/exporter');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Serve generated proposals
app.use('/proposals', express.static('proposals'));

const generator = new ProposalGenerator(process.env.ANTHROPIC_API_KEY);
const templateManager = new TemplateManager();
const exporter = new ProposalExporter();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'drksci-agency' });
});

// Generate proposal endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const {
      type = 'technical',
      topic,
      client,
      sections = 5,
      tone = 'professional',
      additionalContext,
      outputFormat = 'html'
    } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    // Generate proposal content
    const proposalData = await generator.generate({
      type,
      topic,
      client,
      sections: parseInt(sections),
      tone,
      additionalContext
    });

    // Render with template
    const html = templateManager.render('proposal', proposalData);

    // Generate filename
    const filename = exporter.generateFilename(topic);

    // Export
    let outputPath;
    if (outputFormat === 'json') {
      outputPath = await exporter.exportJSON(proposalData, filename);
    } else {
      outputPath = await exporter.exportHTML(html, filename);
    }

    res.json({
      success: true,
      proposal: proposalData,
      outputPath,
      viewUrl: `/proposals/${filename}.${outputFormat === 'json' ? 'json' : 'html'}`
    });
  } catch (error) {
    console.error('Error generating proposal:', error);
    res.status(500).json({ error: error.message });
  }
});

// List templates endpoint
app.get('/api/templates', (req, res) => {
  try {
    const templates = templateManager.listTemplates();
    res.json({ templates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 drksci-agency server running on http://localhost:${PORT}`);
  console.log(`   - Generate: POST /api/generate`);
  console.log(`   - Templates: GET /api/templates`);
  console.log(`   - Proposals: GET /proposals/`);
});
