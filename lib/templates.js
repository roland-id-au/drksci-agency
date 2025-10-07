const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');

class TemplateManager {
  constructor(templatesDir = path.join(__dirname, '../templates')) {
    this.templatesDir = templatesDir;
    nunjucks.configure(templatesDir, { autoescape: true });
  }

  render(templateName, data) {
    const templatePath = `${templateName}.njk`;

    const enhancedData = {
      ...data,
      generatedDate: data.metadata?.generatedDate || new Date().toISOString(),
      year: new Date().getFullYear(),
      brand: {
        name: 'drksci',
        tagline: 'innovation studio',
        website: 'https://drksci.com'
      }
    };

    try {
      return nunjucks.render(templatePath, enhancedData);
    } catch (error) {
      console.error(`Error rendering template ${templateName}:`, error);
      throw error;
    }
  }

  listTemplates() {
    const files = fs.readdirSync(this.templatesDir);
    return files
      .filter(file => file.endsWith('.njk'))
      .map(file => file.replace('.njk', ''));
  }

  templateExists(templateName) {
    const templatePath = path.join(this.templatesDir, `${templateName}.njk`);
    return fs.existsSync(templatePath);
  }
}

module.exports = TemplateManager;
