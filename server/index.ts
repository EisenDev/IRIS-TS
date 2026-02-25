import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { GoogleGenerativeAI } from '@google/generative-ai'
import * as dotenv from 'dotenv'

dotenv.config()

const app = new Hono()

app.use('/*', cors())

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

app.post('/analyze', async (c) => {
    try {
        const body = await c.req.json()
        const { image, userPrompt } = body

        if (!image) {
            return c.json({ error: 'No image provided' }, 400)
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

        const prompt = `You are an elite Senior UI/UX Developer and System Architect. Look at the provided image to extract its dominant color palette, mood, and aesthetic.
${userPrompt ? `The user also specifically requested: "${userPrompt}"` : 'Construct a responsive landing page based on this aesthetic.'}

Generate a complete front-end architecture targeting this visual identity. You must write everything in pure HTML format. Ensure the design is PERFECTLY RESPONSIVE for both mobile and desktop views using Tailwind classes. If you need reactivity, use Vue 3 via script tags (e.g., <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>). Use Tailwind CSS for all styling (e.g., <script src="https://cdn.tailwindcss.com"></script>). Ensure all icons use inline SVG or a CDN (like FontAwesome or Phosphor). Ensure ALL interactive elements (tabs, modals, menus, toggles) default to a CLOSED/HIDDEN state and have fully working toggle/dismiss Vue logic so they can be closed by users.

Return a strictly valid JSON response containing EXACTLY this structure:
{
  "theme_name": "string",
  "colors": ["string", "string"],
  "files": [
    {
      "name": "index.html",
      "content": "string (the complete, fully functional HTML page including Vue logic inside <script> tags, CDNs, and all styling)"
    },
    {
      "name": "tailwind.config.js",
      "content": "string (a tailwind config JS file that defines the extracted colors and any extended utilities)"
    }
  ]
}

DO NOT include markdown tags like \`\`\`json. Return ONLY the raw JSON string.`

        // Handle base64 string that might include data URIs
        const base64Data = image.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, '')
        const mimeTypeMatch = image.match(/^data:(image\/\w+);base64,/)
        const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg'

        const imageRef = {
            inlineData: {
                data: base64Data,
                mimeType: mimeType
            }
        }

        const result = await model.generateContent([prompt, imageRef])
        let text = result.response.text()

        // Clean up potential markdown formatting and grab only the JSON object
        text = text.replace(/```json/gi, '').replace(/```/g, '').trim()

        let jsonStr = text;
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
            jsonStr = text.substring(firstBrace, lastBrace + 1);
        }

        let json
        try {
            json = JSON.parse(jsonStr)
        } catch (parseError) {
            console.error('Failed to parse JSON:', text)
            throw new Error('AI produced invalid JSON')
        }

        return c.json(json)
    } catch (error: any) {
        console.error('Error during analysis:', error)
        return c.json({ error: error.message }, 500)
    }
})

app.post('/refine', async (c) => {
    try {
        const body = await c.req.json()
        const { files, userPrompt, image } = body

        if (!files || !userPrompt) {
            return c.json({ error: 'Missing current architecture files or prompt' }, 400)
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

        const prompt = `You are an elite Senior UI/UX Developer and System Architect. 
The user has provided their current working frontend architecture as a JSON file tree.
They want to make a specific modification: "${userPrompt}"

CRITICAL RULES:
1. FOCUS INTENSELY ON EXACTLY WHAT THE USER ASKS. If they ask to change colors to black, you MUST find EVERY single Tailwind color class (e.g. bg-white, text-gray-500, from-indigo-500, ring-blue-300) and meticulously replace them with equivalent black/dark variants (e.g. bg-black, text-black, etc). Do not be lazy. Be extremely thorough.
2. If the user asks to add a section, inject it structurally where it makes sense while matching the existing established UI component styles perfectly.
3. If an image is provided in this prompt, use it as intense visual context for what they want to achieve, or specifically where to apply the edit.
4. Ensure any modals, dropdowns, or overlays you create or edit have fully working dismiss/close functionality, and default to a hidden state.
5. DO NOT rewrite the entire application from scratch. Keep the exact same structure, base styling, and logic where possible, and only append/edit/replace what is necessary.
6. Return the exact same JSON format as the original architecture (array of files).

CURRENT ARCHITECTURE:
${JSON.stringify({ files })}

Return ONLY the strictly valid JSON response containing EXACTLY the same structure. DO NOT include markdown tags like \`\`\`json.`

        const requestContents: any[] = [{ text: prompt }];

        if (image) {
            const base64Data = image.split(',')[1] || image;
            requestContents.push({
                inlineData: {
                    data: base64Data,
                    mimeType: 'image/jpeg'
                }
            });
        }

        const result = await model.generateContent(requestContents)
        let text = result.response.text()

        // Clean up potential markdown formatting and grab only the JSON object
        text = text.replace(/```json/gi, '').replace(/```/g, '').trim()

        let jsonStr = text;
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
            jsonStr = text.substring(firstBrace, lastBrace + 1);
        }

        let json: any
        try {
            json = JSON.parse(jsonStr)
            // Ensure we don't accidentally drop files the AI thought it didn't need to return
            const mergedFiles = files.map((originalFile: any) => {
                const newFile = (json.files || []).find((f: any) => f.name === originalFile.name)
                return newFile || originalFile
            })
                // Add any newly created files
                ; (json.files || []).forEach((newFile: any) => {
                    if (!mergedFiles.find((f: any) => f.name === newFile.name)) {
                        mergedFiles.push(newFile)
                    }
                })
            json.files = mergedFiles;
        } catch (parseError) {
            console.error('Failed to parse JSON:', text)
            throw new Error('AI produced invalid JSON during refinement')
        }

        return c.json(json)
    } catch (error: any) {
        console.error('Error during refinement:', error)
        if (error.status === 429 || error.message?.includes('429') || error.message?.includes('RetryInfo')) {
            return c.json({ error: 'AI Rate Limit Reached! Please wait 10 seconds before refining again.' }, 429)
        }
        return c.json({ error: error.message }, 500)
    }
})

app.post('/deploy', async (c) => {
    try {
        const body = await c.req.json()
        const { name, files, vercelToken } = body

        if (!vercelToken) {
            return c.json({ error: 'Bring Your Own Key: Missing Vercel Token in request.' }, 400)
        }

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
                data: JSON.stringify({ "version": 2, "builds": [{ "src": "index.html", "use": "@vercel/static" }] })
            })
        }

        // Target Vercel Deployments endpoint
        const response = await fetch('https://api.vercel.com/v13/deployments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${vercelToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name || 'iris-ts-synth',
                target: 'production',
                projectSettings: { framework: null },
                files: vercelFiles
            })
        });

        const vercelData = await response.json();

        if (!response.ok) {
            console.error('Vercel API Error:', vercelData);
            return c.json({ error: vercelData.error?.message || 'Deployment failed' }, response.status as any);
        }

        const productionUrl = (vercelData.alias && vercelData.alias.length > 0) ? vercelData.alias[0] : vercelData.url;
        return c.json({ url: productionUrl }, 200)
    } catch (error: any) {
        console.error('Error during deployment:', error)
        return c.json({ error: error.message }, 500)
    }
})

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
    fetch: app.fetch,
    port
})
