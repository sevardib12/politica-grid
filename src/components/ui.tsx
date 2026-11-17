import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'

export function Modal({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: ReactNode
  onClose: () => void
  children: ReactNode
  wide?: boolean
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`animate-rise flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-line bg-panel shadow-2xl sm:rounded-3xl ${wide ? 'sm:max-w-2xl' : 'sm:max-w-md'}`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <h2 className="min-w-0 text-base font-bold text-slate-50 sm:text-lg">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  )
}

export function Segmented<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: { value: T; label: string; hint?: string }[]
  onChange: (v: T) => void
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">{label}</legend>
      <div className="grid auto-cols-fr grid-flow-col gap-1 rounded-2xl border border-line bg-ink/60 p-1">
        {options.map((o) => {
          const active = o.value === value
          return (
            <button
              key={String(o.value)}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={`rounded-xl px-2 py-2 text-sm font-semibold transition ${
                active
                  ? 'bg-gold text-ink shadow'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {o.label}
              {o.hint && (
                <span className={`block text-[10px] font-medium ${active ? 'text-ink/70' : 'text-slate-500'}`}>
                  {o.hint}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export function Chip({ children, tone = 'slate' }: { children: ReactNode; tone?: 'slate' | 'cyan' | 'gold' | 'ok' | 'bad' }) {
  const tones = {
    slate: 'bg-white/5 text-slate-300',
    cyan: 'bg-cyan/10 text-cyan',
    gold: 'bg-gold/10 text-gold',
    ok: 'bg-ok/10 text-ok',
    bad: 'bg-bad/10 text-bad',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  )
}
