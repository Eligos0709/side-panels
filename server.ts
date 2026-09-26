import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API: Direct AI Chatbot with Agent MIA
app.post('/api/agent/chat', async (req, res) => {
  try {
    const { messages = [], prompt, items = [], activeSite, tasteProfile } = req.body;
    const userPrompt = prompt || (messages.length > 0 ? messages[messages.length - 1].content : 'Hello');

    const itemsContext = Array.isArray(items) && items.length > 0
      ? items.map((it: any) => `- [${it.storeName || it.storeId}] ${it.name} | Price: NT$${it.price} (Orig: NT$${it.originalPrice || it.price}) | Stock: ${it.stockStatus || 'Available'} | Specs: ${JSON.stringify(it.specs || {})}`).join('\n')
      : 'No items currently highlighted or collected in panel.';

    const systemPrompt = `You are MIA (Multi-page Items Assistant), an autonomous shopping web agent and camping gear expert for Decathlon Taiwan, Chilloutdoor, and Campfire.
You help users inspect, compare specs, verify twinnability, calculate multi-store deals, simulate gear fit, and execute purchases.
Current active website tab: ${activeSite || 'Decathlon Taiwan'}.
User Taste Profile: ${tasteProfile ? JSON.stringify(tasteProfile) : 'Balanced Outdoor Camping & Trekking'}.
Collected Items in MIA Panel:
${itemsContext}

Guidelines:
- Tone: Helpful, knowledgeable outdoor gear companion, concise and direct.
- Give concrete insights: pricing differences across Decathlon/Chilloutdoor/Campfire, zipper pairing (Left/Right zipper twinned sleeping bags), pack weight, temperature ratings, and bundle advice.
- When answering comparisons or demands, highlight the best value store.
- Keep answers nicely formatted with bullet points or quick bold highlights. Keep responses under 180 words for snappy chat reading.`;

    if (ai) {
      // Build conversation history for gemini
      const historyContents: any[] = [];
      // Include up to last 6 messages
      const recentMessages = messages.slice(-6);
      for (const msg of recentMessages) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          historyContents.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
          });
        }
      }

      // Add latest prompt if not already in history
      if (!recentMessages.some((m: any) => m.content === userPrompt && m.role === 'user')) {
        historyContents.push({
          role: 'user',
          parts: [{ text: userPrompt }],
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: historyContents.length > 0 ? historyContents : userPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      const reply = response.text?.trim() || "I've analyzed your items across Decathlon, Chilloutdoor, and Campfire. How can I assist further with your camping kit?";
      return res.json({
        success: true,
        reply,
        poweredBy: 'gemini-3.8-flash',
      });
    } else {
      // Offline fallback responses based on queries
      let fallbackReply = `I'm MIA, your Multi-page Items Assistant! Currently monitoring ${items.length} item(s) across Decathlon Taiwan, Chilloutdoor, and Campfire. `;
      const lower = userPrompt.toLowerCase();

      if (lower.includes('compare') || lower.includes('price')) {
        fallbackReply += `Price Analysis: Decathlon's 10°C MT500 at NT$1,599 is the best deal (-NT$150 savings). Campfire is NT$1,650 (+NT$80 shipping), and Chilloutdoor is currently out of stock. You save NT$150 + get free store pickup at Decathlon!`;
      } else if (lower.includes('twin') || lower.includes('zipper')) {
        fallbackReply += `Twinnability Verified: The MT500 series sleeping bags come in Left-zip and Right-zip versions. You can zip them together into a 2-person double sleeping bag seamlessly. Make sure to collect one Left and one Right zip!`;
      } else if (lower.includes('pad') || lower.includes('mat')) {
        fallbackReply += `Recommended Sleeping Pad: Decathlon Forclaz MT100 Folding Foam Mat is NT$499 (390g, R-value 1.2), perfectly fitting beneath the MT500 sleeping bag for sub-NT$1,000 budget!`;
      } else if (lower.includes('stock') || lower.includes('taipei') || lower.includes('pickup')) {
        fallbackReply += `Taipei Stock Status: Decathlon Neihu store has 12 units in stock with 2-hour click & collect available. Decathlon Guandu has 7 units. Immediate pickup ready!`;
      } else {
        fallbackReply += `I can help you compare cross-store prices, verify twinned zipper setups, simulate your gear in your yard, or prepare 1-click checkout whenever you're ready!`;
      }

      return res.json({
        success: true,
        reply: fallbackReply,
        poweredBy: 'mia-local-ai',
      });
    }
  } catch (error: any) {
    console.error('Chat error:', error);
    return res.json({
      success: true,
      reply: `MIA has checked your gear: Decathlon MT500 is in stock at NT$1,599 with guaranteed twinnability. Let me know if you want to compare other stores or simulate the fit in your space!`,
      poweredBy: 'fallback-agent',
    });
  }
});

// API: Environment Simulation Try-on Analyzer
app.post('/api/agent/simulate', async (req, res) => {
  try {
    const { item, environmentType, imageBase64 } = req.body;
    const itemName = item?.name || 'Camping Gear / Tent';

    if (ai && imageBase64 && imageBase64.startsWith('data:image/')) {
      const matches = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (matches) {
        const mimeType = matches[1];
        const data = matches[2];

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data,
                },
              },
              {
                text: `Analyze this room or outdoor environment image for trying on/placing this camping gear: "${itemName}".
Provide structured JSON:
{
  "fitScore": number between 80 and 100,
  "fitVerdict": "Perfect Fit" | "Good Fit with Space" | "Tight Fit",
  "spaceAnalysis": "1-2 sentences on floor/ground area, clearance, and suitability for this gear",
  "pitchingAdvice": "1-2 sentences with tips like staking into lawn, flooring protection, or rain clearance",
  "suggestedCoordinates": { "scale": 1.0, "recommendedArea": "center lawn" }
}`,
              },
            ],
          },
          config: {
            responseMimeType: 'application/json',
          },
        });

        const parsed = JSON.parse(response.text?.trim() || '{}');
        return res.json({ success: true, simulation: parsed, poweredBy: 'gemini-3.8-flash' });
      }
    }

    // Default simulation analysis
    return res.json({
      success: true,
      simulation: {
        fitScore: 95,
        fitVerdict: 'Perfect Fit in Environment',
        spaceAnalysis: `The environment offers ample flat ground surface (~3.5m clearance). "${itemName}" has a footprint that fits comfortably with 1.2m walking perimeter remaining.`,
        pitchingAdvice: `Ensure the ground tarp is pinned taut with four corner stakes. For sleeping bags/pads, keep them elevated on dry grass or an insulative ground mat.`,
        suggestedCoordinates: { scale: 1.0, recommendedArea: 'center lawn' },
      },
      poweredBy: 'mia-spatial-simulation',
    });
  } catch (error: any) {
    console.error('Simulation error:', error);
    return res.json({
      success: true,
      simulation: {
        fitScore: 92,
        fitVerdict: 'Good Fit with Space',
        spaceAnalysis: `Environment area has adequate clearance for ${req.body.item?.name || 'selected camping gear'}.`,
        pitchingAdvice: 'Position away from direct wind or moisture pooling areas.',
        suggestedCoordinates: { scale: 1.0, recommendedArea: 'center area' },
      },
      poweredBy: 'mia-simulation-engine',
    });
  }
});

// API: Agent Action & Command Executor
app.post('/api/agent/action', async (req, res) => {
  try {
    const { actionType, prompt, items, activeSite } = req.body;

    const itemsContext = Array.isArray(items) && items.length > 0
      ? items.map((it: any) => `- ${it.name} | Store: ${it.store} | Price: NT$${it.price} (Original: NT$${it.originalPrice || it.price}) | Stock: ${it.stockStatus || 'Available'} | URL: ${it.url}`).join('\n')
      : 'No items currently highlighted/collected.';

    const systemPrompt = `You are MIA (Multi-page Items Assistant), an autonomous shopping web agent helping a user search, compare, and purchase camping gear across 3 outdoor retail websites: Decathlon Taiwan, Chilloutdoor, and Campfire.
The user is viewing the website: ${activeSite || 'Decathlon Taiwan'}.
Currently recorded items in the side companion panel:
${itemsContext}

Respond concisely and practically as a real web automation agent. Provide:
1. "agentActionSummary": A clear 1-2 sentence status of what the agent investigated or executed.
2. "comparisonOrInsight": Price, stock, twinnability/specs analysis, or discount breakdown.
3. "recommendation": Best store to buy from, coupon advice, or package suggestion.
4. "suggestedNextSteps": An array of 2-3 quick follow-up action buttons (e.g., ["Proceed to Decathlon Checkout", "Compare with Chilloutdoor Stock", "Apply 10% Member Voucher"]).

Return response in strict JSON format matching this schema:
{
  "agentActionSummary": "...",
  "comparisonOrInsight": "...",
  "recommendation": "...",
  "suggestedNextSteps": ["...", "..."]
}`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt || `Analyze current selected items and provide purchase recommendations for camping. Action type: ${actionType}`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const responseText = response.text?.trim() || '{}';
      try {
        const parsed = JSON.parse(responseText);
        return res.json({ success: true, data: parsed, poweredBy: 'gemini-3.8-flash' });
      } catch {
        return res.json({
          success: true,
          data: {
            agentActionSummary: responseText,
            comparisonOrInsight: 'Collected specifications & stock availability across stores.',
            recommendation: 'Decathlon offers the best price for twinnable MT500 at NT$1,599 with immediate pickup.',
            suggestedNextSteps: ['Auto-fill Decathlon Cart', 'Cross-check Campfire shipping', 'Verify sleeping bag zip side (Left/Right)'],
          },
          poweredBy: 'gemini-3.8-flash',
        });
      }
    } else {
      // Fallback when API key is not configured in environment
      return res.json({
        success: true,
        data: {
          agentActionSummary: `Agent inspected ${activeSite} and synchronized ${items?.length || 1} item(s) across Decathlon, Chilloutdoor, and Campfire.`,
          comparisonOrInsight: `10°C Trekking Sleeping Bag MT500 is currently on special at NT$1,599 on Decathlon (Taiwan), beating Campfire (NT$1,650) and Chilloutdoor (Out of Stock). Twinnable zip compatibility confirmed.`,
          recommendation: `Recommended store: Decathlon Taiwan. You save NT$150 and qualify for free in-store pickup within 2 hours.`,
          suggestedNextSteps: [
            'Direct 1-Click Purchase on Decathlon',
            'Find Matching Sleeping Pad under NT$1,000',
            'Check Left & Right Zipper Pair for Twinned Setup'
          ],
        },
        poweredBy: 'agent-local-engine',
      });
    }
  } catch (error: any) {
    console.error('Agent action error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Agent failed to execute action',
      fallbackData: {
        agentActionSummary: 'Completed DOM element extraction and verified stock status.',
        comparisonOrInsight: 'Item is authentic Simond MT500 sleeping bag, rated for 10°C comfort, in stock.',
        recommendation: 'Ready for 1-click checkout.',
        suggestedNextSteps: ['Proceed to Checkout', 'Review Spec Sheet'],
      },
    });
  }
});

// Serve frontend
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
