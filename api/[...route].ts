import { handle } from 'hono/vercel'
import app from '../server/index'

export const config = {
    runtime: 'nodejs',
    api: {
        bodyParser: false
    }
}

export default handle(app)
