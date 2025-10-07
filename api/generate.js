const ProposalGenerator = require('../lib/generator');
const TemplateManager = require('../lib/templates');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Generate proposal content
    const generator = new ProposalGenerator(process.env.ANTHROPIC_API_KEY);
    const proposalData = await generator.generate({
      type,
      topic,
      client,
      sections: parseInt(sections),
      tone,
      additionalContext
    });

    // Render with template
    const templateManager = new TemplateManager();
    const html = templateManager.render('proposal', proposalData);

    // For Vercel, we return the content directly instead of saving to disk
    if (outputFormat === 'json') {
      res.json({
        success: true,
        proposal: proposalData
      });
    } else {
      // Return HTML with proposal data embedded for client-side rendering
      res.json({
        success: true,
        html: html,
        proposal: proposalData
      });
    }
  } catch (error) {
    console.error('Error generating proposal:', error);
    res.status(500).json({ error: error.message });
  }
};
