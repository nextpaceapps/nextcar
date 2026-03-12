import { Router, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { withRole, type AuthRequest } from '../middleware/auth';
import { Sentry } from '../lib/sentry';

const router = Router();

// Rate limiting: 10 requests per minute per user
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;

let lastCleanupTime = Date.now();
function cleanupRateLimitMap() {
    const now = Date.now();
    if (now - lastCleanupTime > RATE_LIMIT_WINDOW_MS) {
        for (const [key, value] of rateLimitMap.entries()) {
            if (now > value.resetTime) rateLimitMap.delete(key);
        }
        lastCleanupTime = now;
    }
}

const PARSE_VEHICLE_PROMPT = `You are a vehicle listing data parser. Given raw text from a vehicle listing source, extract and return structured vehicle data as JSON.

Rules:
- "make" should be the vehicle manufacturer brand (e.g., Toyota, BMW, Audi). Infer from context if not explicit.
- "model" should be the specific model name.
- "year" should be the model year (integer).
- "price" should be 0 if not provided (user will fill in).
- "mileage" should be in kilometers as an integer (remove commas, "km" suffix).
- "fuelType" must be one of: "Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid". Map "Petrol/Electric (HEV)" to "Hybrid", "Petrol/Electric (PHEV)" to "Plug-in Hybrid".
- "transmission" must be one of: "Manual", "Automatic". Map any automatic variant to "Automatic".
- "bodyType" must be one of: "Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Wagon", "Van", "Truck".
- "color" should be the exterior paint color.
- Extract VIN if present.
- "power" should be the raw power string like "72 kW (98 Hp)".
- "engineSize" should be the raw string like "1,797 cc".
- "doors" and "seats" should be integers.
- "co2Standard" like "EU6b".
- "interiorColor" from interior colour field.
- "numberOfKeys" as integer.
- "firstRegistration" and "technicalInspection" as date strings (DD/MM/YYYY).
- "condition" from condition field.
- "equipment" should be an object grouping features by category. Use these categories: airConditioning, infotainment, mirrors, parkingAid, safety, seats, steeringWheel, wheels, windows, other.
- "features" should be a flat array of all equipment items combined.
- Set "status" to "draft".

Parse the following vehicle listing text:
`;

const responseSchema = {
    type: 'object' as const,
    properties: {
        make: { type: 'string' as const },
        model: { type: 'string' as const },
        year: { type: 'number' as const },
        price: { type: 'number' as const },
        mileage: { type: 'number' as const },
        fuelType: { type: 'string' as const },
        transmission: { type: 'string' as const },
        bodyType: { type: 'string' as const },
        color: { type: 'string' as const },
        vin: { type: 'string' as const },
        description: { type: 'string' as const },
        power: { type: 'string' as const },
        engineSize: { type: 'string' as const },
        doors: { type: 'number' as const },
        seats: { type: 'number' as const },
        co2Standard: { type: 'string' as const },
        interiorColor: { type: 'string' as const },
        numberOfKeys: { type: 'number' as const },
        firstRegistration: { type: 'string' as const },
        technicalInspection: { type: 'string' as const },
        condition: { type: 'string' as const },
        features: { type: 'array' as const, items: { type: 'string' as const } },
        equipment: {
            type: 'object' as const,
            properties: {
                airConditioning: { type: 'array' as const, items: { type: 'string' as const } },
                infotainment: { type: 'array' as const, items: { type: 'string' as const } },
                mirrors: { type: 'array' as const, items: { type: 'string' as const } },
                parkingAid: { type: 'array' as const, items: { type: 'string' as const } },
                safety: { type: 'array' as const, items: { type: 'string' as const } },
                seats: { type: 'array' as const, items: { type: 'string' as const } },
                steeringWheel: { type: 'array' as const, items: { type: 'string' as const } },
                wheels: { type: 'array' as const, items: { type: 'string' as const } },
                windows: { type: 'array' as const, items: { type: 'string' as const } },
                other: { type: 'array' as const, items: { type: 'string' as const } },
            },
        },
    },
    required: ['make', 'model', 'year', 'mileage', 'fuelType', 'transmission', 'bodyType', 'color'],
};

router.post('/parse-listing', withRole('Editor'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Rate limiting per authenticated user
        const uid = req.user?.uid || 'unknown';
        const now = Date.now();
        cleanupRateLimitMap();

        let rateLimit = rateLimitMap.get(uid);
        if (!rateLimit || now > rateLimit.resetTime) {
            rateLimit = { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };
        }
        rateLimit.count++;
        rateLimitMap.set(uid, rateLimit);

        if (rateLimit.count > MAX_REQUESTS_PER_WINDOW) {
            res.status(429).json({ error: 'Too many requests. Please try again later.' });
            return;
        }

        const { rawText } = req.body;

        if (!rawText || typeof rawText !== 'string') {
            res.status(400).json({ error: 'rawText is required and must be a string' });
            return;
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('GEMINI_API_KEY not set in backend .env');
            res.status(500).json({ error: 'AI service is not configured' });
            return;
        }

        // TODO: move GoogleGenAI instantiation outside handler (initialize once, not per request)
        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: PARSE_VEHICLE_PROMPT + rawText,
            config: {
                responseMimeType: 'application/json',
                responseSchema,
            },
        });

        const text = response.text;
        if (!text) {
            res.status(500).json({ error: 'No response from Gemini API' });
            return;
        }

        let parsed;
        try {
            parsed = JSON.parse(text);
        } catch {
            res.status(500).json({ error: 'Failed to parse AI response as JSON' });
            return;
        }

        // Ensure defaults
        const result = {
            ...parsed,
            price: parsed.price || 0,
            images: [],
            status: 'draft',
        };

        res.json(result);
    } catch (error: unknown) {
        Sentry.captureException(error, {
            tags: {
                area: 'backend-ai',
                route: 'parse-listing',
            },
        });
        console.error('AI parsing error:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to parse listing' });
    }
});

router.post('/autostudio/isolate', withRole('Editor'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const uid = req.user?.uid || 'unknown';
        const now = Date.now();
        cleanupRateLimitMap();

        let rateLimit = rateLimitMap.get(uid);
        if (!rateLimit || now > rateLimit.resetTime) {
            rateLimit = { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };
        }
        rateLimit.count++;
        rateLimitMap.set(uid, rateLimit);

        if (rateLimit.count > MAX_REQUESTS_PER_WINDOW) {
            res.status(429).json({ error: 'Too many requests. Please try again later.' });
            return;
        }

        const { base64Image, mimeType, systemInstruction, isolationPrompt } = req.body;
        
        if (!base64Image || !mimeType || !isolationPrompt) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            res.status(500).json({ error: 'AI service is not configured' });
            return;
        }

        const ai = new GoogleGenAI({ apiKey });
        const modelName = 'gemini-3.1-flash-image-preview';

        const isolationResponse = await ai.models.generateContent({
            model: modelName,
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Image.split(',')[1] || base64Image,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: isolationPrompt,
                    },
                ],
            },
            config: {
                systemInstruction: systemInstruction || "You are a professional automotive photo editor. Your goal is to process car photos with high precision, maintaining the vehicle's shape, color, and details while ensuring a clean and realistic output.",
                imageConfig: {
                    aspectRatio: "16:9",
                    imageSize: "1K"
                }
            }
        });

        let isolatedBase64 = "";
        for (const part of isolationResponse.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                const data = part.inlineData.data;
                if (typeof data === 'string') {
                    isolatedBase64 = data;
                    break;
                }
            }
        }

        if (!isolatedBase64) {
            throw new Error("Failed to isolate car in Stage 1");
        }

        res.json({ isolatedImage: `data:image/png;base64,${isolatedBase64}` });
    } catch (error: unknown) {
        Sentry.captureException(error, {
            tags: {
                area: 'backend-ai',
                route: 'autostudio-isolate',
            },
        });
        console.error('AutoStudio Isolation error:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to isolate image' });
    }
});

router.post('/autostudio/compose', withRole('Editor'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const uid = req.user?.uid || 'unknown';
        const now = Date.now();
        cleanupRateLimitMap();

        let rateLimit = rateLimitMap.get(uid);
        if (!rateLimit || now > rateLimit.resetTime) {
            rateLimit = { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };
        }
        rateLimit.count++;
        rateLimitMap.set(uid, rateLimit);

        if (rateLimit.count > MAX_REQUESTS_PER_WINDOW) {
            res.status(429).json({ error: 'Too many requests. Please try again later.' });
            return;
        }

        const { isolatedBase64, compositionPrompt, systemInstruction, backgroundImage, backgroundImageMimeType } = req.body;
        
        if (!isolatedBase64 || !compositionPrompt) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            res.status(500).json({ error: 'AI service is not configured' });
            return;
        }

        const ai = new GoogleGenAI({ apiKey });
        const modelName = 'gemini-3.1-flash-image-preview';

        const compositionParts: any[] = [
            {
                inlineData: {
                    data: isolatedBase64.split(',')[1] || isolatedBase64,
                    mimeType: 'image/png',
                },
            }
        ];

        if (backgroundImage && backgroundImageMimeType) {
            compositionParts.push({
                inlineData: {
                    data: backgroundImage.split(',')[1] || backgroundImage,
                    mimeType: backgroundImageMimeType,
                },
            });
            compositionParts.push({
                text: `${compositionPrompt} Use the provided background image as the environment. Place the isolated car realistically onto the floor of this specific room, matching the lighting and perspective.`
            });
        } else {
            compositionParts.push({
                text: compositionPrompt
            });
        }

        const compositionResponse = await ai.models.generateContent({
            model: modelName,
            contents: {
                parts: compositionParts,
            },
            config: {
                systemInstruction: systemInstruction || "You are a professional automotive photo editor. Your goal is to process car photos with high precision, maintaining the vehicle's shape, color, and details while ensuring a clean and realistic output.",
                imageConfig: {
                    aspectRatio: "16:9",
                    imageSize: "1K"
                }
            }
        });

        let finalBase64 = "";
        for (const part of compositionResponse.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                const data = part.inlineData.data;
                if (typeof data === 'string') {
                    finalBase64 = data;
                    break;
                }
            }
        }

        if (!finalBase64) {
            throw new Error("Failed to compose image in Stage 2");
        }

        res.json({ finalImage: `data:image/png;base64,${finalBase64}` });
    } catch (error: unknown) {
        Sentry.captureException(error, {
            tags: {
                area: 'backend-ai',
                route: 'autostudio-compose',
            },
        });
        console.error('AutoStudio Composition error:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to compose image' });
    }
});

export default router;
