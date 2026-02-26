import { handle } from '@hono/node-server/vercel'
import app from '../server/index'

export const config = {
    runtime: 'nodejs'
}

export const maxDuration = 60 // Allow up to 60 seconds for AI generation


export default handle(app)
