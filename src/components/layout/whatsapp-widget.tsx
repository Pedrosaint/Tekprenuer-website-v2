import { AnimatePresence, m } from 'framer-motion'
import { Cancel01Icon, SentIcon, WhatsappIcon } from '@hugeicons/core-free-icons'
import { HugeIcon } from '../../components/ui/huge-icon'
import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { site } from '../../data/site-content'
import { whatsappHref } from '../../lib/contact'

/** Shared WhatsApp chat launcher: pre-filled wa.me flow in a small chat-style panel. */
export function WhatsAppWidget() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [time, setTime] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const launcher = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    input.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      launcher.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  const toggle = () => {
    if (!open) setTime(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }))
    setOpen((value) => !value)
  }

  const send = (event: FormEvent) => {
    event.preventDefault()
    const text = message.trim()
    if (!text) return
    window.open(whatsappHref(text), '_blank', 'noopener,noreferrer')
    setMessage('')
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {open && (
          <m.div
            role="dialog"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="w-[calc(100vw-2rem)] origin-bottom-right overflow-hidden rounded-xl border border-slate-200 bg-white sm:w-96"
          >
            <div className="flex items-center justify-between bg-[#075e54] p-4">
              <div className="flex items-center gap-3">
                <span className="relative flex size-10 items-center justify-center rounded-md bg-white font-medium text-royal-700">
                  TK
                  <span className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-[#075e54] bg-green-400" />
                </span>
                <div>
                  <h2 id={titleId} className="font-sans text-sm leading-tight font-medium text-white">
                    {site.name}
                  </h2>
                  <p className="text-xs text-green-50">Office hours: {site.support.hours}</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close chat"
                onClick={() => {
                  setOpen(false)
                  launcher.current?.focus()
                }}
                className="inline-flex size-10 items-center justify-center rounded-xl text-white/90 transition hover:bg-white/10"
              >
                <HugeIcon icon={Cancel01Icon} size={20} />
              </button>
            </div>

            <div className="flex h-52 flex-col bg-[#e7ded3] p-4">
              <div className="mr-10 rounded-lg rounded-tl-none bg-white px-3 py-2">
                <p className="text-[13px] font-medium text-[#075e54]">{site.name}</p>
                <p className="text-sm leading-relaxed text-slate-800">{site.contact.whatsappWelcome}</p>
                <p className="mt-1 text-right text-[10px] text-slate-500">{time}</p>
              </div>
            </div>

            <form onSubmit={send} className="flex items-center gap-2 bg-slate-100 p-3">
              <label htmlFor={`${titleId}-input`} className="sr-only">
                Your message
              </label>
              <input
                ref={input}
                id={`${titleId}-input`}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Type a message…"
                autoComplete="off"
                className="min-h-11 flex-1 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-offset-2 placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={!message.trim()}
                aria-label="Send on WhatsApp"
                className="inline-flex size-11 items-center justify-center rounded-xl bg-[#075e54] text-white transition enabled:hover:bg-[#0b7a6d] disabled:opacity-40"
              >
                <HugeIcon icon={SentIcon} size={18} />
              </button>
            </form>
          </m.div>
        )}
      </AnimatePresence>

      <button
        ref={launcher}
        type="button"
        onClick={toggle}
        aria-label={open ? 'Close WhatsApp chat' : 'Chat with us on WhatsApp'}
        aria-expanded={open}
        className="inline-flex size-14 pulse-ring items-center justify-center rounded-xl bg-[#1da851] text-white transition hover:scale-105"
      >
        <HugeIcon icon={WhatsappIcon} size={30} />
      </button>
    </div>
  )
}
