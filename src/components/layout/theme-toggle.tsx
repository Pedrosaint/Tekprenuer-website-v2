import { useTheme } from '../../lib/theme'
import { Moon02Icon, Sun01Icon } from '@hugeicons/core-free-icons'
import { HugeIcon } from '../../components/ui/huge-icon'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="inline-flex size-11 items-center justify-center rounded-xl text-ink transition-colors hover:bg-ink/10"
    >
      {dark ? <HugeIcon icon={Sun01Icon} size={20} /> : <HugeIcon icon={Moon02Icon} size={20} />}
    </button>
  )
}
