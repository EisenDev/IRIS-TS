import { handle } from 'hono/vercel'
import app from '../server/index'

export const config = {
    runtime: 'edge'
}

export const maxDuration = 60 // Allow up to 60 seconds for AI generation


export default handle(app)
