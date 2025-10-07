const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

class ProposalExporter {
  constructor(outputDir = path.join(__dirname, '../proposals')) {
    this.outputDir = outputDir;

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  }

  async exportHTML(proposalData, filename) {
    const htmlPath = path.join(this.outputDir, `${filename}.html`);

    // Convert markdown in sections to HTML
    const processedData = this.processMarkdown(proposalData);

    fs.writeFileSync(htmlPath, processedData);

    console.log(`✓ Exported HTML to: ${htmlPath}`);
    return htmlPath;
  }

  processMarkdown(html) {
    // Find and convert markdown blocks in the HTML
    // This is a simple approach - in production you'd want more sophisticated parsing
    return html.replace(/<markdown>([\s\S]*?)<\/markdown>/g, (match, markdown) => {
      return marked.parse(markdown);
    });
  }

  async exportJSON(proposalData, filename) {
    const jsonPath = path.join(this.outputDir, `${filename}.json`);

    fs.writeFileSync(jsonPath, JSON.stringify(proposalData, null, 2));

    console.log(`✓ Exported JSON to: ${jsonPath}`);
    return jsonPath;
  }

  generateFilename(topic) {
    return topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);
  }
}

module.exports = ProposalExporter;
