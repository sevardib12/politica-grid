import { ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { EstadoReto } from './MenuPiezas.tsx'

/**
 * Una tarjeta del menú principal: cerrada muestra número, título, estado del reto de hoy, descripción y una
 * miniatura del juego; abierta despliega su contenido hacia abajo y resalta el borde en oro. El padre decide
 * cuál está abierta (acordeón exclusivo).
 */
export function GameCard({
  numero,
  miniatura,
  title,
  description,
  dailyDone,
  open,
  onToggle,
  children,
}: {
  /** «01», «02»… */
  numero: string
  /** Dibujo pequeño del juego (decorativo). */
  miniatura: ReactNode
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
      className={`scroll-mt-20 overflow-hidden rounded-2xl border bg-panel transition-[border-color,box-shadow] duration-300 ${
        open ? 'border-gold shadow-[0_0_0_4px_rgba(255,205,28,0.08)]' : 'border-line hover:border-slate-600'
      }`}
    >
      <h2>
        <button
          id={headerId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-start gap-3.5 p-4 text-left sm:items-center sm:gap-6 sm:px-6 sm:py-5"
        >
          <span
            aria-hidden="true"
            className={`font-display shrink-0 text-[2.1rem] transition-colors sm:w-14 sm:text-5xl ${open ? 'text-gold' : 'text-slate-600'}`}
          >
            {numero}
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5">
              <span className="font-display text-[1.9rem] text-slate-50 sm:text-[2.5rem]">{title}</span>
              <EstadoReto jugado={dailyDone} />
            </span>
            <span className="text-[15px] leading-snug text-slate-300 sm:text-base">{description}</span>
          </span>
          <span aria-hidden="true" className="hidden shrink-0 sm:flex">
            {miniatura}
          </span>
          <ChevronDown
            size={22}
            aria-hidden="true"
            className={`mt-1 shrink-0 transition-transform duration-300 motion-reduce:transition-none sm:mt-0 ${open ? 'rotate-180 text-gold' : 'text-slate-400'}`}
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
          <div className="px-4 pb-4 sm:px-6 sm:pb-6">{children}</div>
        </div>
      </div>
    </section>
  )
}
