// Serves ./dist the way a static host does: /about -> dist/about/index.html, unknown paths -> dist/404.html
// (HTTP 404). Unlike `vite preview`, it does NOT fall back to the home page's HTML for every route, so you
// can check the prerendered pages exactly as a crawler or first-time visitor receives them.
// Text assets are compressed (brotli or gzip) like a real host, so size-based metrics are realistic.
// Run with: npm run preview:static   (optionally: npm run preview:static -- --port 4300)
import { existsSync, readFileSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { brotliCompressSync, gzipSync } from 'node:zlib'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist')
const portArg = process.argv.indexOf('--port')
const port = portArg > -1 ? Number(process.argv[portArg + 1]) : 4300

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
}

const resolveFile = (pathname) => {
  const clean = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '')
  const candidates = [path.join(root, clean), path.join(root, clean, 'index.html')]
  return candidates.find((file) => file.startsWith(root) && existsSync(file) && statSync(file).isFile())
}

const compressible = /^(text\/|application\/(json|xml)|image\/svg)/
const cache = new Map()

createServer((request, response) => {
  const { pathname } = new URL(request.url ?? '/', 'http://localhost')
  const file = resolveFile(pathname)
  const status = file ? 200 : 404
  const target = file ?? path.join(root, '404.html')
  const type = types[path.extname(target)] ?? 'application/octet-stream'
  const headers = {
    'Content-Type': type,
    'Cache-Control': target.includes(`${path.sep}assets${path.sep}`) ? 'public, max-age=31536000, immutable' : 'no-cache',
  }

  let body = readFileSync(target)
  if (compressible.test(type)) {
    const accepts = String(request.headers['accept-encoding'] ?? '')
    const encoding = accepts.includes('br') ? 'br' : accepts.includes('gzip') ? 'gzip' : null
    if (encoding) {
      const key = `${encoding}:${target}`
      if (!cache.has(key)) cache.set(key, encoding === 'br' ? brotliCompressSync(body) : gzipSync(body))
      body = cache.get(key)
      headers['Content-Encoding'] = encoding
      headers.Vary = 'Accept-Encoding'
    }
  }
  response.writeHead(status, { ...headers, 'Content-Length': body.length })
  response.end(body)
}).listen(port, () => console.log(`Serving dist/ at http://localhost:${port}`))
