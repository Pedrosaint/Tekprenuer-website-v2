import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import { renderToString } from 'react-dom/server'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom'
import { routes } from './routes'

/**
 * Build-time prerender (see plugins/seo-plugin.ts). Renders one route to an HTML string; the browser
 * bundle later replaces it with the live React app.
 */
export async function render(path: string): Promise<string> {
  const handler = createStaticHandler(routes)
  const context = await handler.query(new Request(new URL(path, 'http://localhost')))
  if (context instanceof Response) throw new Error(`Unexpected redirect while prerendering ${path}`)
  const router = createStaticRouter(handler.dataRoutes, context)

  return renderToString(
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <StaticRouterProvider router={router} context={context} hydrate={false} />
      </LazyMotion>
    </MotionConfig>,
  )
}
