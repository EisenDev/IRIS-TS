
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { streamText } from 'hono/streaming'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { jsonrepair } from 'jsonrepair'

declare const process: any;

const app = new Hono().basePath('/api')

app.use('/*', cors())

app.get('/health', (c) => {
    const keys = getApiKeys();
    return c.text(`OK - Keys: ${keys.length}`);
})


function getApiKeys(c?: any) {
    // Try c.env first (Edge), then process.env (Node)
    const keyEnv = (c?.env?.GEMINI_API_KEY) || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '') || '';
    // Strip any accidental quotes injected by Vercel env parsing
    const cleanKey = keyEnv.replace(/['"]/g, '').trim();
    if (!cleanKey) return [];
    return cleanKey.split(',').map((s: string) => s.trim()).filter(Boolean);
}

async function generateWithRotation(requestContents: any, c?: any) {
    const keys = getApiKeys(c);
    if (keys.length === 0) throw new Error("No API Keys configured. Please set GEMINI_API_KEY environment variable.");

    // Shuffle keys for better distribution across serverless instances
    const shuffledKeys = [...keys].sort(() => Math.random() - 0.5);
    let lastError: any = null;

    for (let i = 0; i < shuffledKeys.length; i++) {
        const key = shuffledKeys[i];
        try {
            const genAI = new GoogleGenerativeAI(key);
            const model = genAI.getGenerativeModel({
                model: 'gemini-2.5-flash',
                generationConfig: {
                    responseMimeType: 'application/json'
                }
            });
            const result = await model.generateContentStream(requestContents);
            return result.stream;
        } catch (error: any) {
            lastError = error;
            const msg = error.message || '';
            const isRateLimit = error.status === 429 || msg.includes('429') || msg.includes('RetryInfo') || msg.includes('RATE_LIMIT');
            const isInvalidKey = error.status === 400 || msg.includes('API_KEY_INVALID') || msg.includes('not valid');

            if (isRateLimit || isInvalidKey) {
                console.warn(`⚠️ API Key failed (${isRateLimit ? 'Rate Limited' : 'Invalid'}). Trying next key... (${i + 1}/${shuffledKeys.length})`);
                continue;
            } else {
                throw error; // Not a rate limit or invalid key, throw immediately
            }
        }
    }
    throw new Error(`Exhausted all ${keys.length} API keys. Last attempt error: ${lastError?.message || 'Unknown'}`);
}

function safeJsonParse(jsonStr: string) {
    try {
        return JSON.parse(jsonStr);
    } catch (e) {
        console.warn('Initial JSON Parse failed. Engaging robust jsonrepair...');
        try {
            // jsonrepair automatically fixes missing quotes, trailing commas, unescaped newlines, etc.
            const repaired = jsonrepair(jsonStr);
            return JSON.parse(repaired);
        } catch (e2) {
            console.error('jsonrepair Auto-Heal failed.', e2);
            throw new Error('AI produced severely malformed formatting that could not be auto-healed. Please try again.');
        }
    }
}

app.post('/analyze', async (c) => {
    try {
        const body = await c.req.json()
        const { image, userPrompt } = body

        if (!image) {
            return c.json({ error: 'No image provided' }, 400)
        }

        const prompt = `You are an elite Senior UI/UX Developer and System Architect. Look at the provided image to extract its dominant color palette, mood, and aesthetic.
${userPrompt ? `The user also specifically requested: "${userPrompt}"` : 'Construct a responsive landing page based on this aesthetic.'}

Generate a complete front-end architecture targeting this visual identity. IMPORTANT: Keep the HTML structure EXTREMELY CONCISE (UNDER 150 LINES TOTAL) to ensure generation time is under 15 seconds. DO NOT EXCEED 150 LINES OF HTML. YOU MUST KEEP IT EXTREMELY SIMPLE AND SHORT AND FAST. Provide a beautiful but highly optimized single-page layout. You must write everything in pure HTML format. Ensure the design is PERFECTLY RESPONSIVE for both mobile and desktop views using Tailwind classes. If you need reactivity, use Vue 3 via script tags (e.g., <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>). Use Tailwind CSS for all styling (e.g., <script src="https://cdn.tailwindcss.com"></script>). Ensure all icons use inline SVG or a CDN (like FontAwesome or Phosphor). Ensure ALL interactive elements (tabs, modals, menus, toggles) default to a CLOSED/HIDDEN state and have fully working toggle/dismiss Vue logic so they can be closed by users.
IMPORTANT: The user has a frontend "Live Edit" tool that allows them to swap images purely via DOM \`src\` attributes. Therefore, if you build image galleries or modals that display images, DO NOT use a hardcoded state array to drive the modal image. INSTEAD, use JavaScript/Vue logic to extract the exact \`src\` attribute directly from the specific \`<img>\` element the user clicked, and pass that to the modal. This ensures the modal reflects any DOM image overrides.
CRITICAL: DO NOT hide core text or elements using \`opacity: 0\` or scroll reveals without GUARANTEEING they become visible on load. If your Javascript IntersectionObserver fails, the user gets a completely blank site. Default to completely visible elements if you aren't 100% sure your reveal logic is bulletproof.
CRITICAL STYLING RULE: You MUST include the Tailwind CDN script (\`<script src="https://cdn.tailwindcss.com"></script>\`) inside the \`<head>\` of your \`index.html\`. If you do not include this script, all of your Tailwind classes will fail to render, resulting in a blank, unstyled page.

OUTPUT FORMAT REQUIREMENTS:
You must provide a JSON output. The format is an object with "theme_name", "colors" (hex array), and "files" (array of { name, content }).
Return ONLY the strictly valid JSON response containing EXACTLY the same structure. DO NOT include markdown tags like \`\`\`json. Return ONLY the raw JSON string.`

        const requestContents: any[] = [{ text: prompt }];

        if (image) {
            const base64Data = image.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, '')
            const mimeTypeMatch = image.match(/^data:(image\/\w+);base64,/)
            const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg'

            requestContents.push({
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType
                }
            });
        }

        return streamText(c, async (stream) => {
            // CRITICAL: Write a tiny bit of data immediately to keep the Vercel connection alive
            await stream.write(' ');

            try {
                const genStream = await generateWithRotation(requestContents, c)
                for await (const chunk of genStream) {
                    try {
                        const parts = chunk.candidates?.[0]?.content?.parts || [];
                        const text = parts.map(p => p.text).join('') || chunk.text();
                        if (text) await stream.write(text);
                    } catch (e) {
                        console.warn('Chunk processing failure:', e);
                    }
                }
            } catch (err: any) {
                console.error('Stream iteration aborted:', err);
                await stream.write(`\n\n{"error": "AI Engine failure: ${err.message || 'The AI service is temporarily unavailable.'}"}`);
            }
        })
    } catch (error: any) {
        console.error('Initial Error during analysis:', error)
        return c.json({ error: error.message }, 500)
    }
})

app.post('/refine', async (c) => {
    try {
        const body = await c.req.json()
        const { files, userPrompt, images } = body

        if (!files || !userPrompt) {
            return c.json({ error: 'Missing current architecture files or prompt' }, 400)
        }

        const prompt = `You are an elite Senior UI/UX Developer and System Architect. 
The user has provided their current working frontend architecture as a JSON file tree.
They want to make a specific modification: "${userPrompt}"

CRITICAL RULES:
1. FOCUS INTENSELY ON EXACTLY WHAT THE USER ASKS. If they ask to change colors to black, you MUST find EVERY single Tailwind color class (e.g. bg-white, text-gray-500, from-indigo-500, ring-blue-300) and meticulously replace them with equivalent black/dark variants (e.g. bg-black, text-black, etc). Do not be lazy. Be extremely thorough.
2. If the user asks to add a section, inject it structurally where it makes sense while matching the existing established UI component styles perfectly.
3. If images are provided in this prompt, use them as intense visual context for what they want to achieve, or specifically where to apply the edit.
4. Ensure any modals, dropdowns, or overlays you create or edit have fully working dismiss/close functionality, and default to a hidden state.
5. DO NOT rewrite the entire application from scratch. Keep the exact same structure, base styling, and logic where possible, and only append/edit/replace what is necessary.
6. Return the exact same JSON format as the original architecture (array of files).
7. IMPORTANT: The user has a frontend "Live Edit" tool that allows them to swap images purely via DOM \`src\` attributes. Therefore, if you build image galleries or modals that display images, DO NOT use a hardcoded state array to drive the modal image. INSTEAD, use JavaScript/Vue logic to extract the exact \`src\` attribute directly from the specific \`<img>\` element the user clicked, and pass that to the modal.
8. CRITICAL: DO NOT hide core text or elements using \`opacity: 0\` or scroll reveals without GUARANTEEING they become visible on load. If your Javascript IntersectionObserver fails, the user gets a completely blank site. Default to completely visible elements if you aren't 100% sure your reveal logic is bulletproof.
9. CRITICAL STYLING RULE: You MUST ensure the Tailwind CDN script (\`<script src="https://cdn.tailwindcss.com"></script>\`) is present inside the \`<head>\` of the \`index.html\`. Without this, the UI will break.

CURRENT ARCHITECTURE:
${JSON.stringify({ files })}

Return ONLY the strictly valid JSON response containing EXACTLY the same structure. DO NOT include markdown tags like \`\`\`json.`

        const requestContents: any[] = [{ text: prompt }];

        if (images && Array.isArray(images)) {
            images.forEach((img: string) => {
                if (!img) return;
                const base64Data = img.includes(',') ? img.split(',')[1] : img;
                requestContents.push({
                    inlineData: {
                        data: base64Data,
                        mimeType: 'image/jpeg'
                    }
                });
            });
        }

        return streamText(c, async (stream) => {
            // CRITICAL: Write a tiny bit of data immediately to keep the Vercel connection alive
            await stream.write(' ');

            try {
                const genStream = await generateWithRotation(requestContents, c)
                for await (const chunk of genStream) {
                    try {
                        const parts = chunk.candidates?.[0]?.content?.parts || [];
                        const text = parts.map(p => p.text).join('') || chunk.text();
                        if (text) await stream.write(text);
                    } catch (e) {
                        console.warn('Chunk processing failure:', e);
                    }
                }
            } catch (err: any) {
                console.error('Stream iteration aborted:', err);
                await stream.write(`\n\n{"error": "AI Refinement interrupted: ${err.message || 'Stream connection lost'}"}`);
            }
        })
    } catch (error: any) {
        console.error('Error during refinement:', error)
        return c.json({ error: error.message }, 500)
    }
})

app.post('/deploy', async (c) => {
    try {
        const body = await c.req.json()
        const { name, files, vercelToken } = body

        // Sanitize the Vercel Token (strip quotes/spaces)
        const cleanVercelToken = vercelToken.replace(/['"]/g, '').trim();

        // Format files for Vercel deploy API format
        const vercelFiles = files.map((f: any) => ({
            file: f.file,
            data: f.data,
            ...(f.encoding ? { encoding: f.encoding } : {})
        }))

        // Optional standard structure to ensure it's served nicely on Vercel as a pure static site
        if (!vercelFiles.find((f: any) => f.file === 'vercel.json')) {
            vercelFiles.push({
                file: 'vercel.json',
                data: JSON.stringify({
                    "version": 2,
                    "builds": [{ "src": "index.html", "use": "@vercel/static" }],
                    "routes": [{ "src": "/(.*)", "dest": "/$1" }]
                })
            })
        }

        // Target Vercel Deployments endpoint
        const response = await fetch('https://api.vercel.com/v13/deployments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${cleanVercelToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: (name || 'iris-ts-synth').substring(0, 100).toLowerCase().replace(/[^a-z0-9-]/g, ''),
                files: vercelFiles
            })
        });

        const vercelData = await response.json();

        if (!response.ok) {
            console.error('Vercel API Error:', JSON.stringify(vercelData));
            // Specifically handle common Vercel errors with cleaner messages
            const msg = vercelData.error?.message || 'Deployment failed';
            return c.json({ error: msg }, response.status as any);
        }

        const productionUrl = (vercelData.alias && vercelData.alias.length > 0) ? vercelData.alias[0] : vercelData.url;
        return c.json({ url: productionUrl }, 200)
    } catch (error: any) {
        console.error('Error during deployment:', error)
        return c.json({ error: error.message }, 500)
    }
})

export default app;
