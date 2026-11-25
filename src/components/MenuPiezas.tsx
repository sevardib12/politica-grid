import { ChevronDown, Play, Square, SquareCheck } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Franja } from './ui.tsx'

// Piezas comunes de lo que despliega cada tarjeta del menú: la papeleta del reto diario, el panel de la
// partida libre, el «Cómo se juega» plegable y la etiqueta del estado del reto de hoy.

/** Estado del reto de hoy en la cabecera de una tarjeta. */
export function EstadoReto({ jugado }: { jugado: boolean }) {
  return jugado ? (
    <span className="tag bg-ok/12 text-ok" title="Ya jugaste el reto de hoy">
      <SquareCheck size={14} aria-hidden="true" /> Reto de hoy jugado
    </span>
  ) : (
    <span className="tag border border-gold/55 text-gold">
      <Square size={14} aria-hidden="true" /> Reto de hoy
    </span>
  )
}

/** El reto diario como papeleta: papel con datos, texto y un talón troquelado con el botón de jugar. */
export function Papeleta({
  id,
  fecha,
  datos,
  children,
  boton,
  onJugar,
}: {
  id: string
  fecha: string
  datos: { etiqueta: string; valor: ReactNode; title?: string }[]
  children: ReactNode
  boton: string
  onJugar: () => void
}) {
  return (
    <section aria-labelledby={id} className="papel relative flex flex-col shadow-none">
      <div className="flex flex-col gap-3.5 px-5 pb-4 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 id={id} className="font-display text-[1.9rem]">
              Reto diario
            </h3>
            <p className="mt-1 text-sm text-tinta-2 first-letter:uppercase">{fecha}</p>
          </div>
          <Franja className="mt-2 h-1.5 w-12 shrink-0" />
        </div>
        <dl className="grid grid-cols-2 gap-3">
          {datos.map((d) => (
            <div key={d.etiqueta} title={d.title} className="flex min-w-0 flex-col-reverse justify-end gap-1 border-t-2 border-tinta pt-2">
              <dt className="etiqueta text-[11px] text-tinta-2">{d.etiqueta}</dt>
              <dd className="font-display text-[2.1rem] leading-none">{d.valor}</dd>
            </div>
          ))}
        </dl>
        <div className="text-[15px] leading-relaxed text-tinta">{children}</div>
      </div>
      <div className="relative mt-auto border-t-2 border-dashed border-papel-corte px-5 pb-5 pt-4">
        <span aria-hidden="true" className="absolute -left-2.5 -top-[11px] size-5 rounded-full bg-panel" />
        <span aria-hidden="true" className="absolute -right-2.5 -top-[11px] size-5 rounded-full bg-panel" />
        <button type="button" onClick={onJugar} className="btn-tinta w-full">
          <Play size={16} aria-hidden="true" fill="currentColor" />
          {boton}
        </button>
      </div>
    </section>
  )
}

/** Panel de la partida libre: título, ajustes y el botón grande de jugar. */
export function PanelLibre({ id, children, onJugar }: { id: string; children: ReactNode; onJugar: () => void }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-5 rounded-lg border border-line bg-ink p-5">
      <h3 id={id} className="font-display text-[1.9rem] text-slate-50">
        Partida libre
      </h3>
      {children}
      <button type="button" onClick={onJugar} className="btn-primary mt-auto min-h-14 w-full text-[1.375rem] tracking-[0.06em]">
        <Play size={18} aria-hidden="true" fill="currentColor" /> Jugar
      </button>
    </section>
  )
}

/** «Cómo se juega», plegado por defecto. */
export function Ayuda({ children }: { children: ReactNode }) {
  const [abierta, setAbierta] = useState(false)
  return (
    <section className="rounded-lg border border-line">
      <button
        type="button"
        onClick={() => setAbierta((v) => !v)}
        aria-expanded={abierta}
        className="flex min-h-[52px] w-full items-center justify-between px-5 text-left text-[15px] font-bold text-slate-50"
      >
        Cómo se juega
        <ChevronDown size={18} className={`transition ${abierta ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {abierta && <ul className="space-y-2 px-5 pb-5 text-sm leading-relaxed text-slate-300">{children}</ul>}
    </section>
  )
}

/** Disposición de lo que despliega una tarjeta: papeleta y partida libre lado a lado, luego ayuda y nota. */
export function Despliegue({ papeleta, libre, ayuda, nota }: { papeleta: ReactNode; libre: ReactNode; ayuda: ReactNode; nota: ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {papeleta}
        {libre}
      </div>
      {ayuda}
      <p className="px-1 text-center text-[13px] leading-relaxed text-slate-400">{nota}</p>
    </div>
  )
}
