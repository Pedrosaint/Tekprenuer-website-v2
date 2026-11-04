/**
 * Single content source for the Tekprenuers website.
 *
 * Conventions
 *  - `TODO(client): ...` marks something the client has NOT supplied. The UI hides any
 *    section whose data is empty or placeholder-only (see src/lib/placeholder.ts).
 *  - `draft: true` / `// REVIEW:` marks copy written by the site team that the client should
 *    read and approve before launch. It is shown on the site, unlike TODO(client) items.
 *  - Image fields are keys into src/assets/images (see src/components/ui/picture.tsx).
 *
 * This file must stay free of Vite-only imports (no image or CSS imports) because the
 * build-time SEO plugin imports it directly in Node.
 */
import { todo } from '../lib/placeholder.ts'

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */
export type IconKey =
  | 'brain' | 'code' | 'layout' | 'cpu' | 'palette' | 'clipboard' | 'cart' | 'megaphone'
  | 'rocket' | 'users' | 'package' | 'compass' | 'hammer' | 'trending-up'
  | 'lightbulb' | 'handshake' | 'award' | 'shield' | 'clock' | 'infinity'
  | 'design' | 'development' | 'launch' | 'growth' | 'support' | 'message' | 'location'
  | 'education' | 'healthcare' | 'property' | 'utilities'

export interface Faq {
  question: string
  answer: string
}

export interface Service {
  slug: string
  title: string
  icon: IconKey
  /** Verbatim card copy supplied by the client. */
  summary: string
  /** Page-header photo (key into src/assets/images). */
  heroImage: string
  /** REVIEW: everything below was written by the site team. */
  overview: string[]
  included: string[]
  deliverables: string[]
  tech: string[]
  projectSlugs: string[]
  faqs: Faq[]
}

export interface CaseStudy {
  client: string
  /** Known facts only; everything else is a TODO(client) placeholder. */
  problem: string
  solution: string
  stack: string[]
  outcome: string
  screenshots: string[]
  liveUrl: string
}

export interface Project {
  slug: string
  name: string
  category: string
  /** Broader grouping used by the portfolio filter. */
  sector: string
  summary: string
  /** Key into src/assets/images. */
  logo: string
  /** 'light' logos are white and need a dark tile. */
  logoTone: 'light' | 'dark'
  logoKind: 'raster' | 'svg'
  featured: boolean
  serviceSlugs: string[]
  caseStudy: CaseStudy
}

export interface ProcessPhase {
  step: number
  slug: string
  title: string
  icon: IconKey
  summary: string
  happens: string[]
  youGet: string[]
  /** Indicative only. REVIEW with the client. */
  timeline: string
}

export interface Value {
  title: string
  text: string
  icon: IconKey
  /** Hidden until the client confirms it. */
  confirmed: boolean
}

export interface Pillar {
  title: string
  text: string
  icon: IconKey
}

export interface Stat {
  value: number
  suffix: string
  label: string
  /** Shown instead of a count-up when the figure is not purely numeric (e.g. 24/7). */
  display?: string
  note?: string
}

export interface Testimonial {
  quote: string
  name: string
  role: string
  company: string
}

export interface PricingPackage {
  id: string
  name: string
  audience: string
  summary: string
  features: string[]
  cta: string
  highlighted: boolean
}

export interface Post {
  slug: string
  title: string
  excerpt: string
  date: string
  status: 'placeholder' | 'published'
  body: string[]
}

export interface LegalDoc {
  slug: 'privacy' | 'terms' | 'cookies'
  title: string
  description: string
  updated: string
  sections: { heading: string; body: string[] }[]
}

export interface SocialLink {
  id: 'linkedin' | 'x'
  label: string
  url: string
}

/* ------------------------------------------------------------------ *
 * Company
 * ------------------------------------------------------------------ */
export const site = {
  name: 'Tekprenuers',
  url: 'https://www.tekprenuers.com',
  locale: 'en_NG',
  tagline: 'Promote Your Business With Tech',
  description:
    'Tekprenuers is a remote-first tech agency in Lagos, Nigeria. We help startups and entrepreneurs design, build and scale websites, apps, software and AI solutions.',
  contact: {
    email: 'tekprenuers@gmail.com',
    phone: '+2347081280274',
    phoneDisplay: '+234 708 128 0274',
    whatsappNumber: '2347081280274',
    whatsappWelcome: 'Hi, welcome to Tekprenuers, how can we help you today 😊',
    office: 'Remote-first, Lagos, Nigeria',
    /** Optional Calendly/booking page. While this is a placeholder, booking CTAs open the contact form. */
    bookingUrl: todo('Calendly / booking link'),
  },
  socials: [
    { id: 'linkedin', label: 'LinkedIn', url: todo('LinkedIn company page URL') },
    { id: 'x', label: 'X (Twitter)', url: todo('X / Twitter profile URL') },
  ] satisfies SocialLink[],
  /** One support policy, used everywhere. REVIEW: confirm with the client. */
  support: {
    headline: 'Priority support 24/7 for retained clients',
    policy:
      'Priority support 24/7 for retained clients. Everyone else reaches us during office hours: 9am–5pm, Monday to Saturday (WAT).',
    hours: '9am–5pm, Monday to Saturday (WAT)',
  },
  /** An honest announcement bar. Leave null to hide it. */
  announcement: null as null | { message: string; href?: string; cta?: string },
}

/* ------------------------------------------------------------------ *
 * Home: hero, trust, pillars, about teaser, stats
 * ------------------------------------------------------------------ */
export const hero = {
  eyebrow: 'Tech agency · Lagos, Nigeria',
  headline: 'Promote Your Business With Tech',
  subcopy:
    'We empower startups and entrepreneurs with enterprise grade technology to build, scale, and lead.',
  primaryCta: 'Explore our services',
  secondaryCta: 'Book a free consultation',
}

export const trust = {
  headline: 'Trusted by founders across Nigeria',
  /** TODO(client): a real, verifiable client count. Leave null to keep the line above. */
  clientCount: null as number | null,
}

/** Photo behind the header of each page (key into src/assets/images). Service pages use Service.heroImage. */
export const pageHeroImages: Record<string, string> = {
  '/about': 'hero-about',
  '/services': 'hero-services',
  '/work': 'hero-work',
  '/work/:slug': 'hero-case',
  '/process': 'hero-process',
  '/pricing': 'hero-pricing',
  '/insights': 'hero-insights',
  '/faq': 'hero-faq',
  '/contact': 'hero-contact',
  '/privacy': 'hero-legal',
  '/terms': 'hero-legal',
  '/cookies': 'hero-legal',
}

export const pillars: Pillar[] = [
  {
    title: 'Bold Innovators',
    text: "We're always on the lookout for new ideas, methods, and technologies that can break the mold and elevate your brand.",
    icon: 'rocket',
  },
  {
    title: 'Team Work',
    text: 'Our team brings years of experience and industry leading expertise to provide tailored IT solutions that meet your business needs.',
    icon: 'users',
  },
  {
    title: 'Project Management',
    text: 'We manage your project effectively after project launch.',
    icon: 'package',
  },
]

export const about = {
  // Verbatim client copy, kept in parts so each can be styled separately.
  teaserTitle: 'Tekprenuers bridges technology and entrepreneurship.',
  teaserBody:
    'We partner with founders and growing businesses to design and build scalable digital solutions that drive real growth.',
  teaserFocus: 'using technology to help entrepreneurs build, scale, and succeed.',
  // REVIEW: expanded About copy, written from the verified teaser above.
  story: [
    'Tekprenuers bridges technology and entrepreneurship. We partner with founders and growing businesses to design and build scalable digital solutions that drive real growth.',
    'Our focus is simple: using technology to help entrepreneurs build, scale, and succeed. We are a remote-first team based in Lagos, Nigeria, working with clients wherever they are.',
  ],
  mission: 'To help entrepreneurs build, scale, and succeed with enterprise grade technology.',
  principles: [
    { title: 'Founder-first', text: 'We work the way founders do: quickly, clearly and with the business outcome in view.' },
    { title: 'Built to scale', text: 'We design and build digital solutions that can grow with your customers and your team.' },
    { title: 'Honest by default', text: 'Plain-language scoping, realistic timelines and one clear support policy.' },
  ],
  // TODO(client): team bios and photos. The Team section stays hidden until at least one real person is added.
  team: [] as { name: string; role: string; bio: string; photo?: string }[],
}

/** REVIEW: the client supplied these figures; confirm each before launch. */
export const stats: Stat[] = [
  { value: 50, suffix: '+', label: 'Projects Delivered' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
  { value: 5, suffix: '+', label: 'Years Experience' },
  { value: 24, suffix: '/7', label: 'Support Available', display: '24/7', note: 'Priority support for retained clients' },
]

/* ------------------------------------------------------------------ *
 * Services (summary text is verbatim; detail copy is a draft for review)
 * ------------------------------------------------------------------ */
export const services: Service[] = [
  {
    slug: 'ai-powered-solutions',
    title: 'AI-Powered Solutions',
    icon: 'brain',
    heroImage: 'hero-svc-ai',
    summary: 'Enhance customer engagement with intelligent, automated responses.',
    overview: [
      'We help businesses apply AI where it genuinely saves time or improves the customer experience, starting with the conversations and workflows your team repeats every day.',
      'We scope narrowly, prototype quickly and check the results with you before anything is scaled, so you only invest in what works for your customers.',
    ],
    included: [
      'AI opportunity workshop and use-case scoping',
      'Chat and assistant design for your website, app or WhatsApp',
      'Integration with your CRM, helpdesk or internal data',
      'Knowledge-base, prompt and guardrail design',
      'Human hand-off and escalation paths',
      'Team training and documentation',
    ],
    deliverables: [
      'Use-case brief with success measures',
      'Working prototype',
      'Production integration',
      'Usage and quality reporting',
      'Handover documentation',
    ],
    tech: ['LLM provider APIs', 'Retrieval-augmented generation', 'Node.js', 'Python', 'WhatsApp Business API', 'REST & webhooks'],
    projectSlugs: ['headerfy'],
    faqs: [
      { question: 'Do we need a lot of data to start?', answer: 'Not necessarily. Many useful assistants begin with the FAQs, documents and conversations you already have. We will tell you honestly if more data is needed first.' },
      { question: 'Will AI replace our support team?', answer: 'The goal is to handle repetitive questions instantly and hand the rest to your people with full context, so your team spends time where it matters.' },
    ],
  },
  {
    slug: 'web-app-development',
    title: 'Web & App Development',
    icon: 'code',
    heroImage: 'hero-svc-web',
    summary: 'Developing responsive websites and mobile apps that are fast, reliable, and user-friendly.',
    overview: [
      'From marketing websites to web platforms and mobile apps, we build products that load quickly, work on every screen and are simple for your customers to use.',
      'We build with maintainability in mind: clean code, sensible architecture and documentation, so your product can keep growing after launch.',
    ],
    included: [
      'Responsive websites and web applications',
      'Mobile apps for iOS and Android',
      'Admin dashboards and content management',
      'API design and third-party integrations',
      'Performance, accessibility and SEO foundations',
      'Hosting, deployment and launch support',
    ],
    deliverables: ['Clickable prototype', 'Production-ready application', 'Admin access and training', 'Technical documentation', 'Launch checklist'],
    tech: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'React Native', 'PostgreSQL'],
    projectSlugs: ['ecolex', 'launchconnect', 'perch', 'nuvile-group', 'softtouch'],
    faqs: [
      { question: 'Do you build both the website and the mobile app?', answer: 'Yes. We can start with a web product and add mobile later, or build both together, depending on your audience and budget.' },
      { question: 'Can you improve an existing website or app?', answer: 'Yes. We can audit what you have, then redesign, optimise or extend it rather than starting over.' },
    ],
  },
  {
    slug: 'ui-ux-design',
    title: 'UI/UX Design',
    icon: 'layout',
    heroImage: 'hero-svc-uiux',
    summary: 'Designing intuitive and scalable user experiences that support efficiency, accuracy, and user satisfaction.',
    overview: [
      'Good design makes a product easy to understand and hard to get wrong. We map how your users think, then design flows and interfaces that support them.',
      'Our design work is built to scale: a consistent system of components and patterns that your product team can extend.',
    ],
    included: [
      'User research and journey mapping',
      'Information architecture and wireframes',
      'High-fidelity interface design',
      'Interactive prototypes and usability testing',
      'Design system and component library',
      'Developer-ready handoff',
    ],
    deliverables: ['Flows and wireframes', 'Interactive prototype', 'UI kit and design system', 'Annotated handoff files'],
    tech: ['Figma', 'Design tokens', 'Prototyping tools', 'Accessibility checks (WCAG)'],
    projectSlugs: ['ecolex', 'headerfy', 'perch', 'softtouch'],
    faqs: [
      { question: 'Can you design something without building it?', answer: 'Yes. We can deliver designs and a handoff package for your own developers, or continue into development with us.' },
      { question: 'Do you test designs with real users?', answer: 'We recommend it. Even a small round of usability tests catches issues before they become expensive to fix.' },
    ],
  },
  {
    slug: 'software-development',
    title: 'Software Development',
    icon: 'cpu',
    heroImage: 'hero-svc-software',
    summary: 'Building robust software applications optimized for performance, security, and seamless user experience.',
    overview: [
      'We build custom software for the problems off-the-shelf tools do not solve: internal platforms, SaaS products, payment and access systems.',
      'Security, reliability and performance are designed in from the first sprint, not added at the end.',
    ],
    included: [
      'Discovery and technical architecture',
      'Custom SaaS and internal platforms',
      'Secure authentication and role-based access',
      'Payments, notifications and third-party integrations',
      'Automated testing and CI/CD',
      'Monitoring and maintenance plans',
    ],
    deliverables: ['Architecture overview', 'Working software in iterative releases', 'Test suite and deployment pipeline', 'Documentation and handover'],
    tech: ['TypeScript', 'Node.js', 'PostgreSQL', 'REST & GraphQL', 'Docker', 'CI/CD'],
    projectSlugs: ['ecolex', 'headerfy', 'launchconnect', 'accessum', 'get-electric'],
    faqs: [
      { question: 'How do you keep software secure?', answer: 'We follow secure-by-default practices: least-privilege access, validated inputs, encrypted data in transit and regular dependency updates.' },
      { question: 'Will we own the code?', answer: 'Ownership and licensing terms are agreed in writing before work starts. Ask us for details when you request a quote.' },
    ],
  },
  {
    slug: 'branding-design',
    title: 'Branding & Design',
    icon: 'palette',
    heroImage: 'hero-svc-branding',
    summary: 'Building memorable identities with stunning visuals and cohesive brand strategies.',
    overview: [
      'Your brand is how people recognise and remember you. We shape identities that are distinctive, consistent and easy to apply across every channel.',
      'We start with your story and audience, then translate them into visuals and guidelines your whole team can use.',
    ],
    included: [
      'Brand strategy and positioning',
      'Logo and visual identity',
      'Colour, typography and imagery direction',
      'Brand guidelines',
      'Social, marketing and pitch templates',
      'Launch collateral',
    ],
    deliverables: ['Logo suite', 'Brand guidelines document', 'Template library', 'Source files'],
    tech: ['Figma', 'Adobe Creative Suite', 'Motion design tools'],
    projectSlugs: [],
    faqs: [
      { question: 'Can you refresh an existing brand?', answer: 'Yes. We can evolve what you have so you keep recognition while improving clarity and consistency.' },
      { question: 'How many logo concepts do we get?', answer: 'The number of concepts and revision rounds is agreed in the proposal so expectations are clear from the start.' },
    ],
  },
  {
    slug: 'project-management',
    title: 'Project Management',
    icon: 'clipboard',
    heroImage: 'hero-svc-pm',
    // FIX (section 6): the original said "we offer 24/7 support", which contradicted the 9am–5pm office hours.
    summary: "Let's manage your websites & mobile apps projects, we offer priority 24/7 support for retained clients.",
    overview: [
      'Launching is only the start. We manage your website and app projects before and after go-live, keeping scope, timelines and quality on track.',
      'You get one accountable point of contact, regular updates and a clear plan for what happens next.',
    ],
    included: [
      'Project planning and milestone tracking',
      'Regular progress updates and demos',
      'Post-launch monitoring and fixes',
      'Release and change management',
      'Vendor and stakeholder coordination',
      'Priority 24/7 support for retained clients',
    ],
    deliverables: ['Project plan and roadmap', 'Weekly status updates', 'Release notes', 'Support and maintenance plan'],
    tech: ['Jira / Linear', 'Notion', 'Slack / WhatsApp', 'GitHub'],
    projectSlugs: [],
    faqs: [
      { question: 'What does "retained" support mean?', answer: 'Retained clients have an agreed monthly plan with priority response around the clock. Other clients reach us during office hours, 9am–5pm, Monday to Saturday.' },
      { question: 'Can you manage a project another team built?', answer: 'Yes. We can take over coordination, quality and releases for an existing website or app.' },
    ],
  },
  {
    slug: 'ecommerce-solutions',
    title: 'eCommerce Solutions',
    icon: 'cart',
    heroImage: 'hero-svc-ecommerce',
    summary: 'Empowering businesses to sell online with custom-built platforms and optimized shopping experiences.',
    overview: [
      'We build online stores that make it easy to browse, trust and buy, with checkout and payment flows designed for the way your customers actually pay.',
      'From a first storefront to a custom marketplace, we focus on speed, clear product journeys and tools that make running the store simple.',
    ],
    included: [
      'Storefront design and development',
      'Product catalogue and inventory management',
      'Secure checkout and payment gateway integration',
      'Order, delivery and notification workflows',
      'Analytics and conversion improvements',
      'Admin tools for your team',
    ],
    deliverables: ['Live storefront', 'Admin dashboard', 'Payment and delivery setup', 'Staff training'],
    tech: ['React', 'Node.js', 'Payment gateways', 'PostgreSQL', 'Headless commerce APIs'],
    projectSlugs: ['weestore'],
    faqs: [
      { question: 'Which payment methods can you integrate?', answer: 'We integrate the payment gateways that suit your market and customers. We will recommend options during scoping.' },
      { question: 'Can you migrate our existing store?', answer: 'Yes. We can plan a migration that keeps your products, customers and search ranking intact.' },
    ],
  },
  {
    slug: 'marketing-digital',
    title: 'Marketing & Digital',
    icon: 'megaphone',
    heroImage: 'hero-svc-marketing',
    summary: 'Crafting impactful campaigns to connect with your audience and grow your brand online and offline.',
    overview: [
      'Great products still need to be found. We plan and run campaigns that connect your brand with the right audience, online and offline.',
      'Our work is measurable: we agree what success looks like, track it, and adjust based on what the data shows.',
    ],
    included: [
      'Marketing strategy and audience research',
      'Website SEO and content planning',
      'Paid search and social campaigns',
      'Email and WhatsApp campaigns',
      'Landing pages and conversion tracking',
      'Monthly reporting',
    ],
    deliverables: ['Campaign plan', 'Creative assets', 'Tracking and analytics setup', 'Performance reports'],
    tech: ['Google Ads', 'Google Analytics', 'Meta Ads', 'Email platforms', 'SEO tooling'],
    projectSlugs: [],
    faqs: [
      { question: 'Do you manage ad spend?', answer: 'We can plan and manage campaigns for you. Ad spend itself is paid directly to the platforms so you keep full visibility.' },
      { question: 'How soon will we see results?', answer: 'Paid campaigns can show early signals within weeks; SEO and brand building take longer. We will set realistic expectations in your plan.' },
    ],
  },
]

/* ------------------------------------------------------------------ *
 * Portfolio (names, categories and summaries are verbatim, with the two FIXes applied)
 * ------------------------------------------------------------------ */
const caseStudy = (client: string): CaseStudy => ({
  client,
  problem: todo(`${client}: the problem the client faced`),
  solution: todo(`${client}: what we designed and built`),
  stack: [todo(`${client}: technology stack`)],
  outcome: todo(`${client}: measurable outcome (only figures the client has approved)`),
  screenshots: [],
  liveUrl: todo(`${client}: live URL`),
})

export const projects: Project[] = [
  {
    slug: 'ecolex',
    name: 'Ecolex', // FIX: was "Ecolec"
    category: 'EdTech Platform',
    sector: 'Education',
    summary: 'Comprehensive learning management system serving thousands of students.',
    logo: 'ecolex',
    logoTone: 'dark',
    logoKind: 'raster',
    featured: true,
    serviceSlugs: ['web-app-development', 'software-development', 'ui-ux-design'],
    caseStudy: caseStudy('Ecolex'),
  },
  {
    slug: 'headerfy',
    name: 'Headerfy',
    category: 'Digital Product',
    sector: 'SaaS',
    summary: 'SaaS platform for automated enterprise design.',
    logo: 'headerfy',
    logoTone: 'dark',
    logoKind: 'raster',
    featured: false,
    serviceSlugs: ['software-development', 'ui-ux-design'],
    caseStudy: caseStudy('Headerfy'),
  },
  {
    slug: 'weestore',
    name: 'Weestore',
    category: 'eCommerce Platform',
    sector: 'eCommerce',
    summary: 'Modern eCommerce solution for businesses.',
    logo: 'weestore',
    logoTone: 'dark',
    logoKind: 'raster',
    featured: false,
    serviceSlugs: ['ecommerce-solutions', 'web-app-development'],
    caseStudy: caseStudy('Weestore'),
  },
  {
    slug: 'launchconnect',
    name: 'LaunchConnect',
    category: 'Startup Platform',
    sector: 'Startups',
    summary: 'Connects startups with investors and mentors.',
    logo: 'launchconnect',
    logoTone: 'dark',
    logoKind: 'raster',
    featured: false,
    serviceSlugs: ['web-app-development', 'software-development'],
    caseStudy: caseStudy('LaunchConnect'),
  },
  {
    slug: 'perch',
    name: 'Perch',
    category: 'Hospital Review Platform',
    sector: 'Healthcare',
    summary: 'Rate and review hospitals.',
    logo: 'perch',
    logoTone: 'dark',
    logoKind: 'raster',
    featured: true,
    serviceSlugs: ['web-app-development', 'ui-ux-design'],
    caseStudy: caseStudy('Perch'),
  },
  {
    slug: 'accessum',
    name: 'Accessum',
    category: 'Gated Community Platform',
    sector: 'Property & Community',
    summary: 'All-in-one visitor access, security and resident protection.',
    logo: 'accessum',
    logoTone: 'light',
    logoKind: 'svg',
    featured: true,
    serviceSlugs: ['software-development', 'web-app-development'],
    caseStudy: caseStudy('Accessum'),
  },
  {
    slug: 'get-electric',
    name: 'Get Electric',
    category: 'Utility Payments Platform', // FIX: was "Hospital Review Platform"
    sector: 'Payments',
    summary: 'Fast electricity payments and instant token delivery with zero delays.',
    logo: 'getelectric',
    logoTone: 'dark',
    logoKind: 'svg',
    featured: true,
    serviceSlugs: ['software-development', 'web-app-development'],
    caseStudy: caseStudy('Get Electric'),
  },
  {
    slug: 'nuvile-group',
    name: 'Nuvile Group',
    category: 'Property Consultancy Platform',
    sector: 'Property & Community',
    summary: 'Expert property consultancy you can trust.',
    logo: 'nuvile',
    logoTone: 'dark',
    logoKind: 'raster',
    featured: false,
    serviceSlugs: ['web-app-development', 'ui-ux-design'],
    caseStudy: caseStudy('Nuvile Group'),
  },
  {
    slug: 'softtouch',
    name: 'SoftTouch',
    category: 'Personalized Physiotherapy Platform',
    sector: 'Healthcare',
    summary: 'Physiotherapy and wellness care focused on pain relief, mobility and recovery.',
    logo: 'softtouch',
    logoTone: 'dark',
    logoKind: 'raster',
    featured: false,
    serviceSlugs: ['web-app-development', 'ui-ux-design'],
    caseStudy: caseStudy('SoftTouch'),
  },
]

/** Industries served: derived from the portfolio above. */
export const industries = [
  { label: 'Education', icon: 'education' },
  { label: 'Healthcare & wellness', icon: 'healthcare' },
  { label: 'eCommerce & retail', icon: 'cart' },
  { label: 'Property & community', icon: 'property' },
  { label: 'Utilities & payments', icon: 'utilities' },
  { label: 'Startups & venture', icon: 'rocket' },
] satisfies { label: string; icon: IconKey }[]

/** REVIEW: confirm the technologies the team actually works with. */
export const technologies = [
  'React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'React Native', 'PostgreSQL',
  'Python', 'Figma', 'Docker', 'REST & GraphQL', 'Payment gateways', 'WhatsApp API',
]

/* ------------------------------------------------------------------ *
 * Process (REVIEW: timelines are indicative only)
 * ------------------------------------------------------------------ */
export const process: ProcessPhase[] = [
  {
    step: 1,
    slug: 'design',
    title: 'Design',
    icon: 'design',
    summary: 'We turn your idea into a clear plan and an interface your users will understand.',
    happens: [
      'Discovery call to understand your goals, audience and constraints',
      'Scope, priorities and success measures agreed in writing',
      'User flows, wireframes and visual design',
      'Interactive prototype reviewed with you',
    ],
    youGet: ['Project scope and plan', 'Wireframes and UI designs', 'Clickable prototype', 'Fixed next steps'],
    timeline: 'Indicative: 1–3 weeks',
  },
  {
    step: 2,
    slug: 'development',
    title: 'Development',
    icon: 'development',
    summary: 'We build in short iterations so you can see working software early and often.',
    happens: [
      'Architecture and environment setup',
      'Iterative builds with regular demos',
      'Integrations, payments and content',
      'Testing across devices, performance and security checks',
    ],
    youGet: ['Working product in staging', 'Regular progress demos', 'Test results', 'Technical documentation'],
    timeline: 'Indicative: 3–10 weeks, depending on scope',
  },
  {
    step: 3,
    slug: 'launch',
    title: 'Launch',
    icon: 'launch',
    summary: 'We take your product live carefully and make sure your team is ready.',
    happens: [
      'Final review and launch checklist',
      'Deployment, domains and monitoring',
      'Team handover and training',
      'Launch-day support',
    ],
    youGet: ['Live product', 'Admin training', 'Handover documents', 'Launch support'],
    timeline: 'Indicative: 1–2 weeks',
  },
  {
    step: 4,
    slug: 'growth',
    title: 'Growth',
    icon: 'growth',
    summary: 'After launch we help you learn from real usage and keep improving.',
    happens: [
      'Monitoring, fixes and updates',
      'Analytics review and improvement ideas',
      'New features and campaigns',
      'Ongoing project management and support',
    ],
    youGet: ['Performance reporting', 'Prioritised improvement roadmap', 'Maintenance and support plan', 'Priority 24/7 support for retained clients'],
    timeline: 'Indicative: ongoing, agreed monthly',
  },
]

/* ------------------------------------------------------------------ *
 * Why choose us
 * ------------------------------------------------------------------ */
export const values: Value[] = [
  { title: 'Creativity without limits', text: 'We push boundaries to develop projects that stand out.', icon: 'infinity', confirmed: true },
  { title: 'Your success, our mission', text: 'We strive to provide the best solutions that help you grow.', icon: 'trending-up', confirmed: true },
  { title: 'Client collaboration', text: 'Your vision, combined with our expertise, creates market-leading impact.', icon: 'handshake', confirmed: true },
  {
    title: 'Award Winning Company',
    text: 'Over the years we have achieved awards and recognitions.',
    icon: 'award',
    // TODO(client): name the specific awards. This value stays hidden until confirmed.
    confirmed: false,
  },
]

export const supportPromise = {
  title: 'We are happy to help',
  text: 'Browse topics, find resources, or chat with our team. If you have a question or need assistance, we have answers.',
}

/** REVIEW: "Why founders choose us" comparison. */
export const comparison = {
  title: 'Why founders choose us',
  intro: 'Common frustrations when building with technology, and how we work differently.',
  rows: [
    { pain: 'Design, development and growth are split across different people.', answer: 'One team takes you from design to launch and growth, with one point of contact.' },
    { pain: 'Technical jargon and unclear scope.', answer: 'Plain-language scoping, written milestones and regular demos.' },
    { pain: 'The project goes quiet after launch.', answer: 'Project management continues after launch, with priority 24/7 support for retained clients.' },
    { pain: 'One-size-fits-all packages.', answer: 'Starter, Growth or Custom engagements shaped around your stage and goals.' },
  ],
}

/* ------------------------------------------------------------------ *
 * Testimonials: hidden until real quotes are added
 * ------------------------------------------------------------------ */
// TODO(client): add real, approved testimonials: { quote, name, role, company }.
export const testimonials: Testimonial[] = []

/* ------------------------------------------------------------------ *
 * Pricing: no prices on purpose
 * ------------------------------------------------------------------ */
export const pricing: PricingPackage[] = [
  {
    id: 'starter',
    name: 'Starter',
    audience: 'Early-stage founders validating an idea',
    summary: 'A focused first version: launch quickly, learn from real users.',
    features: ['Discovery call and scope', 'Brand-aligned UI design', 'Responsive website or MVP', 'Launch support'],
    cta: 'Request a quote',
    highlighted: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    audience: 'Growing businesses ready to scale',
    summary: 'A fuller product with integrations and ongoing improvement.',
    features: ['Everything in Starter', 'Custom features and integrations', 'Analytics and conversion improvements', 'Project management after launch'],
    cta: 'Request a quote',
    highlighted: true,
  },
  {
    id: 'custom',
    name: 'Custom',
    audience: 'Larger or more complex platforms',
    summary: 'A tailored engagement shaped around your platform and team.',
    features: ['Dedicated team and roadmap', 'Custom architecture and security', 'Priority 24/7 support for retained clients', 'Flexible billing and terms'],
    cta: 'Request a quote',
    highlighted: false,
  },
]

export const pricingNotes = [
  'Every project is scoped individually. We will send a clear written quote after a short discovery call.',
  'The packages above describe typical engagements and are not fixed price lists.',
]

/* ------------------------------------------------------------------ *
 * FAQ (REVIEW: general answers; confirm specifics with the client)
 * ------------------------------------------------------------------ */
export const faqs: (Faq & { preview: boolean })[] = [
  { question: 'What does Tekprenuers do?', answer: 'We help startups and entrepreneurs build, scale and lead with technology: websites, mobile apps, custom software, UI/UX design, branding, eCommerce, AI solutions and digital marketing.', preview: true },
  { question: 'How much does a project cost?', answer: 'Every project is scoped individually, so we do not publish fixed prices. Tell us about your goals and we will send a written quote after a short discovery call.', preview: true },
  { question: 'How long does a project take?', answer: 'It depends on scope. A focused first version often takes a few weeks, while larger platforms take longer. We will give an indicative timeline in your proposal.', preview: true },
  { question: 'What support do you offer after launch?', answer: site.support.policy, preview: true },
  { question: 'Do you work with clients outside Lagos?', answer: 'Yes. We are remote-first, so we work with founders and businesses wherever they are.', preview: false },
  { question: 'What do you need from us to get started?', answer: 'A short description of what you want to achieve, who it is for, and any timeline or budget range you have in mind. Our project-brief form on the contact page covers all of this.', preview: false },
  { question: 'Can you work with our existing website or app?', answer: 'Yes. We can audit, improve or extend what you already have rather than rebuilding from scratch.', preview: false },
  { question: 'How do we get in touch?', answer: `Use the contact form, email ${site.contact.email}, or message us on WhatsApp at ${site.contact.phoneDisplay}.`, preview: false },
]

/* ------------------------------------------------------------------ *
 * Insights: placeholder posts stay hidden until status is 'published'
 * ------------------------------------------------------------------ */
export const posts: Post[] = [
  { slug: 'placeholder-post-1', title: todo('Insight post title 1'), excerpt: todo('Excerpt'), date: '2026-01-01', status: 'placeholder', body: [] },
  { slug: 'placeholder-post-2', title: todo('Insight post title 2'), excerpt: todo('Excerpt'), date: '2026-01-01', status: 'placeholder', body: [] },
  { slug: 'placeholder-post-3', title: todo('Insight post title 3'), excerpt: todo('Excerpt'), date: '2026-01-01', status: 'placeholder', body: [] },
]

/* ------------------------------------------------------------------ *
 * Contact form options
 * ------------------------------------------------------------------ */
export const budgetRanges = [
  'Not sure yet',
  // TODO(client): replace with real budget bands. These are intentionally generic.
  'Starter project',
  'Growth project',
  'Custom / larger platform',
]

export const timelines = ['As soon as possible', 'Within 1 month', '1–3 months', '3+ months', 'Flexible']

/* ------------------------------------------------------------------ *
 * Legal (REVIEW: template text, must be reviewed by a qualified professional)
 * ------------------------------------------------------------------ */
const legalUpdated = '2026-11-03'

/** Set to true once a qualified professional has reviewed the three documents below; this hides the on-page notice. */
export const legalReviewed = false

export const legalDocs: LegalDoc[] = [
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    description: 'How Tekprenuers collects, uses and protects personal information.',
    updated: legalUpdated,
    sections: [
      { heading: 'Who we are', body: [`${site.name} ("we", "us") operates ${site.url}. You can contact us at ${site.contact.email}.`] },
      { heading: 'Information we collect', body: ['Information you give us, such as your name, email, phone number, company and project details when you complete our contact form or message us.', 'Technical information such as pages visited and device details, collected through analytics only if you accept analytics cookies.'] },
      { heading: 'How we use information', body: ['To respond to enquiries and prepare proposals, to operate and improve our website, and to measure the performance of our advertising if you consent.'] },
      { heading: 'Sharing', body: ['We do not sell your personal information. We may share it with service providers who help us operate the site and respond to you, under appropriate safeguards.'] },
      { heading: 'Retention and your rights', body: ['We keep enquiry information only as long as needed for the purpose it was collected. You can ask to access, correct or delete your information by emailing us.'] },
      { heading: 'Changes', body: ['We may update this policy and will change the date above when we do.'] },
    ],
  },
  {
    slug: 'terms',
    title: 'Terms of Use',
    description: 'The terms that apply when you use the Tekprenuers website.',
    updated: legalUpdated,
    sections: [
      { heading: 'Using this website', body: ['By using this website you agree to these terms. If you do not agree, please do not use the site.'] },
      { heading: 'Our content', body: ['The content on this site is owned by or licensed to Tekprenuers. You may not copy or reuse it without our written permission.'] },
      { heading: 'No professional advice', body: ['Information on this site is general and does not create a client relationship. Project terms are set out in a written proposal or agreement.'] },
      { heading: 'Third-party links', body: ['This site may link to third-party sites we do not control and are not responsible for.'] },
      { heading: 'Liability', body: ['To the extent permitted by law, we are not liable for losses arising from your use of this website.'] },
      { heading: 'Governing law', body: ['These terms are governed by the laws of the Federal Republic of Nigeria.'] },
    ],
  },
  {
    slug: 'cookies',
    title: 'Cookie Policy',
    description: 'How Tekprenuers uses cookies and similar technologies.',
    updated: legalUpdated,
    sections: [
      { heading: 'What are cookies', body: ['Cookies are small files stored on your device that help websites work and understand how they are used.'] },
      { heading: 'Cookies we use', body: ['Essential storage: remembers your cookie choice and your light or dark theme. These do not track you.', 'Analytics and advertising (Google tag): loaded only after you click Accept. If you decline, no analytics or advertising scripts are loaded.'] },
      { heading: 'Managing your choice', body: ['You can change your choice at any time using the "Cookie settings" link in the footer, or by clearing site data in your browser.'] },
    ],
  },
]

/* ------------------------------------------------------------------ *
 * Navigation
 * ------------------------------------------------------------------ */
export const nav = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Work', to: '/work' },
  { label: 'Process', to: '/process' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Contact', to: '/contact' },
]

export const legalNav = [
  { label: 'Privacy', to: '/privacy' },
  { label: 'Terms', to: '/terms' },
  { label: 'Cookies', to: '/cookies' },
]
