const TemplateManager = require('../lib/templates');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const templateManager = new TemplateManager();
    const templates = templateManager.listTemplates();
    res.json({ templates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
