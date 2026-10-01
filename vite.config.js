import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import chatHandler from './api/chat.js'

function apiDevServerPlugin() {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/chat')) {
          // Augment res with express/vercel-style helpers if absent
          if (!res.status) {
            res.status = (statusCode) => {
              res.statusCode = statusCode
              return res
            }
          }
          if (!res.json) {
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(data))
              return res
            }
          }

          // Parse JSON body for POST requests
          if (req.method === 'POST') {
            const chunks = []
            req.on('data', chunk => chunks.push(chunk))
            req.on('end', async () => {
              try {
                const raw = Buffer.concat(chunks).toString()
                req.body = raw ? JSON.parse(raw) : {}
              } catch {
                req.body = {}
              }
              try {
                await chatHandler(req, res)
              } catch (err) {
                console.error('Error in chat dev handler:', err)
                if (!res.writableEnded) {
                  res.status(500).json({ error: 'internal_error', message: 'Internal server error.' })
                }
              }
            })
            return
          }

          try {
            await chatHandler(req, res)
          } catch (err) {
            console.error('Error in chat dev handler:', err)
            if (!res.writableEnded) {
              res.status(500).json({ error: 'internal_error', message: 'Internal server error.' })
            }
          }
          return
        }
        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Make server env vars available to Node process during dev
  if (env.GEMINI_API_KEY) process.env.GEMINI_API_KEY = env.GEMINI_API_KEY
  if (env.GOOGLE_API_KEY) process.env.GOOGLE_API_KEY = env.GOOGLE_API_KEY
  if (env.OPENAI_API_KEY) process.env.OPENAI_API_KEY = env.OPENAI_API_KEY

  return {
    plugins: [react(), apiDevServerPlugin()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/framer-motion')) {
              return 'vendor-motion'
            }
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'vendor-react'
            }
            if (id.includes('node_modules/lenis')) {
              return 'vendor-lenis'
            }
          }
        }
      }
    }
  }
})
