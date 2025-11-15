import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

interface VerdictObject {
  productName: string;
  productImage: string;
  price: string;
  originalPrice: string;
  discount: string;
  confidence: number;
  verdict: {
    recommendation: string;
    summary: string;
    sources: string;
  };
  truths: string[];
  warnings: string[];
  alternatives: Array<{
    name: string;
    price: string;
    rating: number;
    rank: number;
    badge: string;
  }>;
  proscons: {
    pros: Array<{ text: string; count: number }>;
    cons: Array<{ text: string; count: number }>;
  };
  specs: {
    general: Array<{ label: string; value: string }>;
    audio?: Array<{ label: string; value: string }>;
    [key: string]: Array<{ label: string; value: string }> | undefined;
  };
  insights: {
    youtube: {
      summary: string;
      videos: Array<{ title: string; channel: string; views: string }>;
    };
    amazon: {
      summary: string;
      breakdown: { 5: number; 4: number; 3: number; 2: number; 1: number };
      topReviews: Array<{ text: string; rating: number; verified: boolean }>;
    };
    reddit: {
      summary: string;
      threads: Array<{ title: string; subreddit: string; upvotes: number }>;
      sentiment: { positive: number; neutral: number; negative: number };
    };
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VerdictObject | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amazonData, youtubeData, redditData } = req.body;

  if (!amazonData || !youtubeData || !redditData) {
    return res.status(400).json({ error: 'Missing required data sources' });
  }

  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (!openaiApiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  try {
    const openai = new OpenAI({ apiKey: openaiApiKey });

    // Build the fusion prompt
    const fusionPrompt = `You are VerdictAI, an AI that merges multiple sources of product truth.

You will receive:
- AmazonData: ${JSON.stringify(amazonData, null, 2)}
- YouTubeData: ${JSON.stringify(youtubeData, null, 2)}
- RedditData: ${JSON.stringify(redditData, null, 2)}

Your job:
1. Identify consensus truths (what multiple sources agree on)
2. Identify warnings (common complaints/issues)
3. Determine best alternatives (from Amazon data or infer reasonable competitors)
4. Create a final verdict: STRONG BUY, BUY, CAUTION, or AVOID
5. Calculate confidence score (0-100) based on data quality and consensus
6. Build pros/cons with frequency counts
7. Organize specs into general and category-specific (e.g., audio, display, etc.)

Return ONLY valid JSON matching this exact schema:
{
  "productName": "string",
  "productImage": "emoji or description",
  "price": "string with $",
  "originalPrice": "string with $ or empty string",
  "discount": "string like '22% off' or empty string",
  "confidence": number (0-100),
  "verdict": {
    "recommendation": "STRONG BUY" | "BUY" | "CAUTION" | "AVOID",
    "summary": "2-3 sentence summary",
    "sources": "X videos • Y reviews • Z threads"
  },
  "truths": ["string", "string", "string"],
  "warnings": ["string", "string"],
  "alternatives": [
    {"name": "string", "price": "string", "rating": number, "rank": number, "badge": "Best Pick" | "Budget" | "Value"}
  ],
  "proscons": {
    "pros": [{"text": "string", "count": number}],
    "cons": [{"text": "string", "count": number}]
  },
  "specs": {
    "general": [{"label": "string", "value": "string"}],
    "audio": [{"label": "string", "value": "string"}] // if applicable
  },
  "insights": {
    "youtube": {
      "summary": "string",
      "videos": [{"title": "string", "channel": "string", "views": "string"}]
    },
    "amazon": {
      "summary": "string",
      "breakdown": {"5": number, "4": number, "3": number, "2": number, "1": number},
      "topReviews": [{"text": "string", "rating": number, "verified": boolean}]
    },
    "reddit": {
      "summary": "string",
      "threads": [{"title": "string", "subreddit": "string", "upvotes": number}],
      "sentiment": {"positive": number, "neutral": number, "negative": number}
    }
  }
}

CRITICAL: Return ONLY the JSON object, no markdown, no code blocks, no explanations.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are VerdictAI, a product analysis AI. You always return valid JSON matching the exact schema provided. Never include markdown code blocks or explanations, only the raw JSON object.',
        },
        {
          role: 'user',
          content: fusionPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    
    // Clean the response (remove markdown code blocks if present)
    let cleanedResponse = responseText.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```\n?/g, '');
    }

    const verdictObject: VerdictObject = JSON.parse(cleanedResponse);

    // Ensure all required fields are present
    if (!verdictObject.productName) {
      verdictObject.productName = amazonData.title || 'Product';
    }
    // Use actual image from Amazon if available
    if (amazonData.images && amazonData.images.length > 0) {
      verdictObject.productImage = amazonData.images[0];
    } else if (!verdictObject.productImage) {
      verdictObject.productImage = '📦';
    }
    if (!verdictObject.price) {
      verdictObject.price = amazonData.price || '$0.00';
    }
    if (!verdictObject.originalPrice) {
      verdictObject.originalPrice = amazonData.originalPrice || '';
    }
    if (!verdictObject.discount) {
      verdictObject.discount = amazonData.discount || '';
    }
    if (typeof verdictObject.confidence !== 'number') {
      verdictObject.confidence = 85;
    }

    // Merge in the actual source data
    verdictObject.insights.youtube = youtubeData;
    verdictObject.insights.amazon = {
      summary: amazonData.summary || `★${amazonData.rating} from ${amazonData.reviewCount} reviews.`,
      breakdown: amazonData.ratingBreakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      topReviews: amazonData.reviews || [],
    };
    verdictObject.insights.reddit = redditData;

    // Use actual specs from Amazon
    if (amazonData.specs) {
      verdictObject.specs = amazonData.specs;
    }

    // Use actual alternatives if available
    if (amazonData.alternatives && amazonData.alternatives.length > 0) {
      verdictObject.alternatives = amazonData.alternatives;
    }

    // Use actual image from Amazon if available
    if (amazonData.images && amazonData.images.length > 0) {
      verdictObject.productImage = amazonData.images[0];
    } else if (!verdictObject.productImage || verdictObject.productImage === '📦') {
      // Keep emoji fallback if no image available
      verdictObject.productImage = '📦';
    }

    res.status(200).json(verdictObject);
  } catch (error: any) {
    console.error('Error fusing data:', error);
    
    // Return a fallback verdict object
    const fallbackVerdict: VerdictObject = {
      productName: amazonData.title || 'Product',
      productImage: (amazonData.images && amazonData.images.length > 0) ? amazonData.images[0] : '📦',
      price: amazonData.price || '$0.00',
      originalPrice: amazonData.originalPrice || '',
      discount: amazonData.discount || '',
      confidence: 75,
      verdict: {
        recommendation: 'BUY',
        summary: 'Product analysis based on available reviews and discussions.',
        sources: `${youtubeData.videos.length} videos • ${amazonData.reviewCount} reviews • ${redditData.threads.length} threads`,
      },
      truths: ['Product has positive reviews', 'Good value for price'],
      warnings: ['Check compatibility before purchase'],
      alternatives: [],
      proscons: {
        pros: [{ text: 'Positive reviews', count: amazonData.reviewCount }],
        cons: [],
      },
      specs: amazonData.specs || { general: [] },
      insights: {
        youtube: youtubeData,
        amazon: {
          summary: `★${amazonData.rating} from ${amazonData.reviewCount} reviews.`,
          breakdown: amazonData.ratingBreakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          topReviews: amazonData.reviews || [],
        },
        reddit: redditData,
      },
    };

    res.status(200).json(fallbackVerdict);
  }
}

