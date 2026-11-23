import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { Chip } from './ui.tsx'

/**
 * Una tarjeta del menú principal: cerrada muestra ícono, título, descripción y si hay reto diario; abierta
 * despliega su contenido hacia abajo y resalta el borde en amarillo. El padre decide cuál está abierta
 * (acordeón exclusivo).
 */
export function GameCard({
  icon,
  title,
  description,
  dailyDone,
  open,
  onToggle,
  children,
}: {
  icon: ReactNode
  title: ReactNode
  description: string
  /** El reto diario de hoy ya se jugó (el primer intento ya cuenta). */
  dailyDone: boolean
  open: boolean
  onToggle: () => void
  children: ReactNode
}) {
  const uid = useId()
  const headerId = `${uid}-cabecera`
  const panelId = `${uid}-panel`
  const ref = useRef<HTMLElement>(null)

  // Al abrir una tarjeta que queda más arriba de lo visible (porque la anterior, más alta, se cerró),
  // se la trae a la vista cuando termina la animación.
  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => {
      const el = ref.current
      if (!el || el.getBoundingClientRect().top >= 72) return
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    }, 320)
    return () => window.clearTimeout(timer)
  }, [open])

  return (
    <section
      ref={ref}
      className={`scroll-mt-20 overflow-hidden rounded-3xl border bg-panel transition-colors duration-300 ${
        open ? 'border-gold' : 'border-line hover:border-slate-500'
      }`}
    >
      <h2>
        <button
          id={headerId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center gap-4 p-4 text-left sm:p-5"
        >
          <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-gold text-ink" aria-hidden="true">
            {icon}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-xl font-black tracking-tight text-slate-50 sm:text-2xl">{title}</span>
              {dailyDone ? (
                <span title="Ya jugaste el reto de hoy">
                  <Chip tone="ok">
                    <Check size={11} className="mr-1" aria-hidden="true" />
                    Reto diario
                  </Chip>
                </span>
              ) : (
                <Chip tone="gold">Reto diario</Chip>
              )}
            </span>
            <span className="mt-0.5 block text-sm leading-snug text-slate-300">{description}</span>
          </span>
          <ChevronDown
            size={22}
            aria-hidden="true"
            className={`shrink-0 transition-transform duration-300 motion-reduce:transition-none ${open ? 'rotate-180 text-gold' : 'text-slate-400'}`}
          />
        </button>
      </h2>

      {/* Alto animado con filas de grid (0fr → 1fr); `inert` saca del foco y de los lectores lo que está cerrado. */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-4 pb-4 sm:px-5 sm:pb-5">{children}</div>
        </div>
      </div>
    </section>
  )
}
