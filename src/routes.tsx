import type { RouteObject } from 'react-router-dom'
import { Layout } from './components/layout/layout'
import { PageLoader } from './components/layout/page-loader'
import { HomePage } from './features/home/home-page'
import { RouteError } from './features/not-found/route-error'

/**
 * Route table, shared by the browser (src/main.tsx) and the build-time prerenderer
 * (src/entry-server.tsx). Home ships in the main bundle so the landing page paints fast; every
 * other page is a lazy chunk (each page module exports `Component`).
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    HydrateFallback: PageLoader,
    errorElement: <RouteError />,
    children: [
      { index: true, Component: HomePage },
      { path: 'about', lazy: () => import('./features/about/about-page') },
      { path: 'services', lazy: () => import('./features/services/services-page') },
      { path: 'services/:slug', lazy: () => import('./features/services/service-detail-page') },
      { path: 'work', lazy: () => import('./features/work/work-page') },
      { path: 'work/:slug', lazy: () => import('./features/work/case-study-page') },
      { path: 'process', lazy: () => import('./features/process/process-page') },
      { path: 'pricing', lazy: () => import('./features/pricing/pricing-page') },
      { path: 'insights', lazy: () => import('./features/insights/insights-page') },
      { path: 'insights/:slug', lazy: () => import('./features/insights/article-page') },
      { path: 'faq', lazy: () => import('./features/faq/faq-page') },
      { path: 'contact', lazy: () => import('./features/contact/contact-page') },
      { path: 'privacy', lazy: () => import('./features/legal/legal-page') },
      { path: 'terms', lazy: () => import('./features/legal/legal-page') },
      { path: 'cookies', lazy: () => import('./features/legal/legal-page') },
      { path: '*', lazy: () => import('./features/not-found/not-found-page') },
    ],
  },
]
