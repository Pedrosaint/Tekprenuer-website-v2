import { AnimatePresence, m, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { ArrowUp01Icon } from '@hugeicons/core-free-icons'
import { HugeIcon } from '../../components/ui/huge-icon'
import { useState } from 'react'

export function BackToTop() {
  const { scrollY } = useScroll()
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => setVisible(y > 700))

  return (
    <AnimatePresence>
      {visible && (
        <m.button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })}
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          className="fixed right-5 bottom-24 z-40 inline-flex size-12 items-center justify-center rounded-lg border border-white/20 bg-navy-950 text-white transition hover:bg-royal-700 sm:right-6"
        >
          <HugeIcon icon={ArrowUp01Icon} size={20} />
        </m.button>
      )}
    </AnimatePresence>
  )
}
