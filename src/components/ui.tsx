import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'

/** Franja tricolor (2 : 1 : 1), la firma de Urna. El alto y el ancho los pone quien la usa. */
export function Franja({ className = 'h-1' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex overflow-hidden ${className}`}>
      <span className="flex-[2] bg-bandera-amarillo" />
      <span className="flex-1 bg-bandera-azul" />
      <span className="flex-1 bg-bandera-rojo" />
    </div>
  )
}

/** Sello de casilla marcada: el chulo del logo, oro sobre tinta. */
export function Sello({ className = 'size-6' }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`inline-flex items-center justify-center rounded-[5px] bg-tinta text-gold ${className}`}>
      <svg viewBox="0 0 24 24" className="size-[65%]" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 12.5 4.5 4.5 9.5-10" />
      </svg>
    </span>
  )
}

/** Cifra de marcador con su total apagado: «07/09». */
export function Cifra({ valor, total, digitos = 2 }: { valor: number; total: number; digitos?: number }) {
  const pad = (n: number) => String(n).padStart(digitos, '0')
  return (
    <>
      {pad(valor)}
      <span className="text-apagado">/{pad(total)}</span>
    </>
  )
}

export interface DatoMarcador {
  etiqueta: ReactNode
  valor: ReactNode
  /** Color de la cifra. */
  tono?: 'gold' | 'ok' | 'cyan' | 'bad' | 'plain'
  title?: string
  /** Para lectores de pantalla, cuando la cifra sola no se entiende. */
  ariaLabel?: string
  /** Cifra que late (tiempo a punto de acabarse). */
  urgente?: boolean
}

const TONO_CIFRA: Record<NonNullable<DatoMarcador['tono']>, string> = {
  gold: 'text-gold',
  ok: 'text-ok',
  cyan: 'text-cyan',
  bad: 'text-bad',
  plain: 'text-slate-50',
}

/** Marcador de televisión: cifras grandes condensadas separadas por filetes. */
export function Marcador({ datos, className = '' }: { datos: DatoMarcador[]; className?: string }) {
  return (
    <dl className={`grid auto-cols-fr grid-flow-col overflow-hidden rounded-xl border border-line bg-panel ${className}`}>
      {datos.map((d, i) => (
        <div
          key={i}
          title={d.title}
          aria-label={d.ariaLabel}
          className="flex min-w-0 flex-col-reverse justify-end gap-1.5 border-r border-line px-3 py-2.5 last:border-r-0 sm:px-4"
        >
          <dt className="etiqueta truncate text-[10px] text-slate-400 sm:text-[11px]">{d.etiqueta}</dt>
          <dd
            className={`font-display text-[1.9rem] tabular-nums sm:text-[2.6rem] ${TONO_CIFRA[d.tono ?? 'plain']} ${
              d.urgente ? 'animate-pulse text-bad!' : ''
            }`}
          >
            {d.valor}
          </dd>
        </div>
      ))}
    </dl>
  )
}

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
        className={`animate-rise flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-line bg-panel shadow-2xl sm:rounded-2xl ${wide ? 'sm:max-w-2xl' : 'sm:max-w-md'}`}
      >
        <Franja className="h-1 shrink-0" />
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <h2 className="min-w-0 text-base font-bold text-slate-50 sm:text-lg">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
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
      <legend className="etiqueta mb-2 text-slate-400">{label}</legend>
      <div className="grid auto-cols-fr grid-flow-col gap-1 rounded-xl border border-line bg-panel p-1">
        {options.map((o) => {
          const active = o.value === value
          return (
            <button
              key={String(o.value)}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={`min-h-11 rounded-lg px-1.5 py-2 text-sm transition ${
                active ? 'bg-gold font-extrabold text-ink shadow' : 'font-bold text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {o.label}
              {o.hint && (
                <span className={`block text-[11px] font-medium ${active ? 'text-[#4d4214]' : 'text-slate-400'}`}>{o.hint}</span>
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
    slate: 'bg-white/[0.06] text-slate-300',
    cyan: 'bg-cyan/15 text-cyan',
    gold: 'border border-gold/55 text-gold',
    ok: 'bg-ok/12 text-ok',
    bad: 'bg-bad/12 text-bad',
  }
  return <span className={`tag ${tones[tone]}`}>{children}</span>
}
