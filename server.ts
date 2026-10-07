import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));

app.post('/api/analyze-item', async (req, res) => {
  try {
    const { imageBase64, userNotes } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.status(503).json({
        error: 'Gemini API key is not configured on the server.',
        code: 'NO_API_KEY'
      });
    }

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'Image data is required.' });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    let mimeType = 'image/jpeg';
    let base64Data = imageBase64;
    if (imageBase64.startsWith('data:')) {
      const parts = imageBase64.split(';');
      mimeType = parts[0].replace('data:', '') || 'image/jpeg';
      base64Data = parts[1].replace('base64,', '');
    }

    const prompt = `Analyze this product for circular economy assessment. Identify the product name, its likely category, visible condition rating, apparent damage or fault, brand if visible, and estimated age in years.
User notes: ${userNotes || 'None'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType,
                data: base64Data
              }
            }
          ]
        }
      ],
      config: {
        systemInstruction: 'You are an expert industrial inspector for circular economy product assessment. Identify the item accurately and objectively without generating final scores.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedName: {
              type: Type.STRING,
              description: 'Identified product name, e.g. "School Tablet", "Office Chair", "Cordless Drill"'
            },
            category: {
              type: Type.STRING,
              description: 'Must be one of: ELECTRONICS, FURNITURE, TEXTILES, TOOLS, BOOKS, APPLIANCES, OTHER'
            },
            condition: {
              type: Type.STRING,
              description: 'Must be one of: PRISTINE, LIGHT WEAR, MINOR FAULT, HEAVILY DAMAGED, PARTS ONLY'
            },
            detectedBrand: {
              type: Type.STRING,
              description: 'Visible brand name or "Standard Model"'
            },
            detectedFault: {
              type: Type.STRING,
              description: 'Observed damage or fault summary, e.g. "Loose USB-C port" or "No major structural faults"'
            },
            confidence: {
              type: Type.INTEGER,
              description: 'Confidence score percentage between 70 and 99'
            },
            estimatedAgeYears: {
              type: Type.NUMBER,
              description: 'Estimated age in years'
            }
          },
          required: ['detectedName', 'category', 'condition', 'detectedBrand', 'detectedFault', 'confidence']
        }
      }
    });

    const responseText = response.text?.trim() || '';
    if (!responseText) {
      return res.status(502).json({ error: 'Received empty response from Gemini AI.' });
    }

    const parsed = JSON.parse(responseText);

    const validCategory = ['ELECTRONICS', 'FURNITURE', 'TEXTILES', 'TOOLS', 'BOOKS', 'APPLIANCES', 'OTHER'].includes(parsed.category)
      ? parsed.category
      : 'ELECTRONICS';

    const validCondition = ['PRISTINE', 'LIGHT WEAR', 'MINOR FAULT', 'HEAVILY DAMAGED', 'PARTS ONLY'].includes(parsed.condition)
      ? parsed.condition
      : 'MINOR FAULT';

    return res.json({
      success: true,
      detectedName: parsed.detectedName || 'Inspected Product',
      category: validCategory,
      condition: validCondition,
      detectedBrand: parsed.detectedBrand || 'Standard Model',
      detectedFault: parsed.detectedFault || 'No major structural faults detected',
      confidence: parsed.confidence || 92,
      estimatedAgeYears: parsed.estimatedAgeYears || 2
    });
  } catch (err: any) {
    console.error('Gemini image analysis error:', err?.message || err);
    return res.status(500).json({
      error: 'Failed to analyze image with Gemini AI.',
      details: err?.message || 'Server error'
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
