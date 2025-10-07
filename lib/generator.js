const Anthropic = require('@anthropic-ai/sdk');

class ProposalGenerator {
  constructor(apiKey) {
    this.client = new Anthropic({ apiKey });
  }

  async generate(params) {
    const {
      type = 'technical',
      topic,
      client = '',
      sections = 5,
      tone = 'professional',
      additionalContext = ''
    } = params;

    const systemPrompt = this.buildSystemPrompt(type, tone);
    const userPrompt = this.buildUserPrompt(topic, client, sections, additionalContext);

    try {
      const message = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8096,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      });

      return this.parseResponse(message.content[0].text);
    } catch (error) {
      console.error('Error generating proposal:', error);
      throw error;
    }
  }

  buildSystemPrompt(type, tone) {
    const basePrompt = `You are an expert proposal writer for drksci, a cutting-edge innovation studio.
Your writing is ${tone}, clear, and compelling. You understand technical depth while maintaining accessibility.

drksci brand values:
- Innovation through science and technology
- Data-driven decision making
- Clean, minimalist design aesthetic
- Technical excellence with business impact`;

    const typePrompts = {
      technical: `Focus on technical architecture, implementation strategies, and engineering excellence.
Include detailed technical specifications, system diagrams (described in text), and integration approaches.`,

      business: `Focus on business value, ROI, market analysis, and strategic alignment.
Include financial projections, competitive analysis, and growth strategies.`,

      research: `Focus on research methodology, innovation potential, and scientific rigor.
Include literature review, experimental design, and expected outcomes.`,

      pitch: `Focus on problem-solution fit, market opportunity, and vision.
Include traction, team credentials, and investment ask.`,

      consulting: `Focus on client challenges, proposed solutions, and deliverables.
Include timeline, team structure, and success metrics.`
    };

    return `${basePrompt}\n\n${typePrompts[type] || typePrompts.technical}`;
  }

  buildUserPrompt(topic, client, sections, additionalContext) {
    let prompt = `Generate a comprehensive proposal for the following:\n\n`;
    prompt += `Topic: ${topic}\n`;

    if (client) {
      prompt += `Client: ${client}\n`;
    }

    prompt += `Number of sections: ${sections}\n`;

    if (additionalContext) {
      prompt += `\nAdditional context:\n${additionalContext}\n`;
    }

    prompt += `\nPlease structure the proposal with:
1. Executive Summary
2. ${sections - 2} main content sections (you decide the most relevant sections based on the topic)
3. Conclusion and Next Steps

Format the response as JSON with this structure:
{
  "title": "Proposal title",
  "subtitle": "Brief subtitle",
  "executiveSummary": "Executive summary text...",
  "sections": [
    {
      "title": "Section title",
      "content": "Section content in markdown format..."
    }
  ],
  "conclusion": "Conclusion text...",
  "metadata": {
    "generatedDate": "ISO date string",
    "estimatedReadTime": "X minutes"
  }
}`;

    return prompt;
  }

  parseResponse(responseText) {
    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
      }
    }

    // Fallback: structure the raw response
    return {
      title: 'Generated Proposal',
      subtitle: 'AI-Generated Content',
      executiveSummary: responseText.substring(0, 500),
      sections: [
        {
          title: 'Content',
          content: responseText
        }
      ],
      conclusion: 'Please review and refine this proposal.',
      metadata: {
        generatedDate: new Date().toISOString(),
        estimatedReadTime: Math.ceil(responseText.split(' ').length / 200) + ' minutes'
      }
    };
  }
}

module.exports = ProposalGenerator;
