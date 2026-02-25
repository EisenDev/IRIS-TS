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

Generate a complete front-end architecture targeting this visual identity. You must write everything in pure HTML format. If you need reactivity, use Vue 3 via CDN (e.g., <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>). Use Tailwind CSS for all styling (e.g., <script src="https://cdn.tailwindcss.com"></script>).

Return a strictly valid JSON response containing EXACTLY this structure:
{
  "theme_name": "string",
  "colors": ["string", "string"],
  "files": [
    {
      "name": "index.html",
      "content": "string (the complete, fully functional HTML page including CDNs and all logic)"
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

        // Clean up potential markdown formatting
        text = text.replace(/```json/gi, '').replace(/```/g, '').trim()

        let json
        try {
            json = JSON.parse(text)
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

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
    fetch: app.fetch,
    port
})
