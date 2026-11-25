import { useMemo, useState } from 'react'
import { POLITICIANS } from '../data/politicians.ts'
import { poolCompleto } from '../gabinete/pool.ts'
import { TOTAL_SILLAS } from '../gabinete/posts.ts'
import { dateKey } from '../game/stats.ts'
import { navigate, type GameId } from '../routing/route.ts'
import type { AllSettings } from '../routing/settings.ts'
import { useStats } from '../stats/useStats.ts'
import { GabineteSetup } from './GabineteSetup.tsx'
import { GameCard } from './GameCard.tsx'
import { GridSetup } from './GridSetup.tsx'
import { Top10Setup } from './Top10Setup.tsx'
import { Franja } from './ui.tsx'

/** Miniatura de Política Grid: un 3×3 con casillas marcadas. */
function MiniGrid() {
  const marcadas = [0, 2, 4, 6, 8]
  return (
    <span className="grid grid-cols-3 gap-1 rounded-[10px] border border-line bg-ink p-3">
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className={`size-4 rounded-[3px] ${marcadas.includes(i) ? 'bg-gold' : 'ring-[1.5px] ring-inset ring-slate-700'}`} />
      ))}
    </span>
  )
}

/** Miniatura de Política Top 10: barras de resultados de mayor a menor. */
function MiniTop10() {
  const barras = ['w-full bg-gold', 'w-[84%] bg-cyan', 'w-[68%] bg-cyan', 'w-[52%] bg-slate-700', 'w-[38%] bg-slate-700']
  return (
    <span className="flex w-[4.5rem] flex-col gap-[5px] rounded-[10px] border border-line bg-ink p-3">
      {barras.map((b) => (
        <span key={b} className={`h-[7px] rounded-[2px] ${b}`} />
      ))}
    </span>
  )
}

/** Miniatura de Arma el Gabinete: un organigrama de tres niveles. */
function MiniGabinete() {
  const llenas = [0, 2, 9]
  return (
    <span className="flex w-[4.5rem] flex-col items-center gap-[5px] rounded-[10px] border border-line bg-ink p-3">
      <span className="h-2.5 w-[18px] rounded-[2px] bg-gold" />
      <span className="grid w-full grid-cols-6 gap-[3px]">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className={`h-2 rounded-[2px] ${llenas.includes(i) ? 'bg-gold' : 'ring-[1.5px] ring-inset ring-slate-700'}`} />
        ))}
      </span>
      <span className="grid w-[70%] grid-cols-4 gap-[3px]">
        {Array.from({ length: 4 }, (_, i) => (
          <span key={i} className="h-2 rounded-[2px] ring-[1.5px] ring-inset ring-slate-700" />
        ))}
      </span>
    </span>
  )
}

/** Escudo de partido dibujado, para la ilustración de la portada. */
function Escudo({ sigla, color }: { sigla: string; color: string }) {
  return (
    <span
      className="flex h-10 w-[34px] items-center justify-center pb-1.5 text-[10px] font-extrabold text-white [clip-path:polygon(0_0,100%_0,100%_60%,50%_100%,0_60%)]"
      style={{ background: color }}
    >
      {sigla}
    </span>
  )
}

/** Ilustración de la portada: un tarjetón con una equis a mano, el chulo de Urna y el talón troquelado. */
function TarjetonIlustrado() {
  return (
    <div aria-hidden="true" className="hidden justify-center lg:flex">
      <div className="papel w-full max-w-[420px] -rotate-3 shadow-[0_30px_60px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.06)]">
        <Franja className="h-1.5 rounded-t-lg" />
        <div className="flex flex-col gap-3.5 px-5 pb-5 pt-4">
          <div className="flex items-baseline justify-between gap-3 border-b-2 border-tinta pb-2.5">
            <span className="font-display text-3xl tracking-[0.04em]">Tarjetón</span>
            <span className="etiqueta text-[11px] text-tinta-2">Marque una casilla</span>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            <span className="relative flex h-[88px] items-center justify-center rounded border-2 border-tinta bg-white">
              <Escudo sigla="PLC" color="#D4342C" />
              <svg viewBox="0 0 70 70" className="absolute size-[70px]" fill="none" stroke="#101632" strokeWidth={5} strokeLinecap="round">
                <path d="M14 13 C 30 30, 42 42, 57 58" />
                <path d="M56 12 C 40 28, 28 44, 13 57" />
              </svg>
            </span>
            <span className="flex h-[88px] items-center justify-center rounded border-2 border-tinta">
              <Escudo sigla="CD" color="#1F3F6E" />
            </span>
            <span className="flex h-[88px] items-center justify-center rounded border-2 border-tinta">
              <Escudo sigla="PCC" color="#2A62AD" />
            </span>
            <span className="flex h-[88px] items-center justify-center rounded border-2 border-tinta">
              <Escudo sigla="PH" color="#7C3AED" />
            </span>
            <span className="flex h-[88px] items-center justify-center rounded border-2 border-tinta bg-white">
              <span className="inline-flex size-11 items-center justify-center rounded-lg bg-tinta text-gold">
                <svg viewBox="0 0 24 24" className="size-[30px]" fill="none" stroke="currentColor" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12.5 4.5 4.5 9.5-10" />
                </svg>
              </span>
            </span>
            <span className="flex h-[88px] items-center justify-center rounded border-2 border-dashed border-papel-dash text-tinta-2">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </span>
          </div>
        </div>
        <div className="relative flex items-center justify-between border-t-2 border-dashed border-papel-corte px-5 pb-3.5 pt-3">
          <span className="absolute -left-[9px] -top-[10px] size-[18px] rounded-full bg-ink" />
          <span className="absolute -right-[9px] -top-[10px] size-[18px] rounded-full bg-ink" />
          <span className="etiqueta text-[11px] text-tinta-2">Urna</span>
          <span className="etiqueta text-[11px] text-tinta-2">Política colombiana</span>
        </div>
      </div>
    </div>
  )
}

/**
 * Página principal (#/): portada y los tres juegos en un acordeón. Solo una tarjeta está abierta a la vez; cada
 * una trae su reto diario y su partida libre, y al jugar navega a la ruta del juego con lo elegido.
 */
export function MenuScreen({
  settings,
  onSettings,
}: {
  settings: AllSettings
  onSettings: (s: AllSettings) => void
}) {
  const stats = useStats()
  const [open, setOpen] = useState<GameId | null>(null)
  const toggle = (id: GameId) => setOpen((current) => (current === id ? null : id))
  const hoy = dateKey()
  const partidos = useMemo(() => poolCompleto().partidos.length, [])

  const cifras = [
    { etiqueta: 'Políticos', valor: POLITICIANS.length.toLocaleString('es-CO'), borde: 'border-bandera-amarillo' },
    { etiqueta: 'Partidos', valor: String(partidos), borde: 'border-bandera-azul' },
    { etiqueta: 'Años', valor: '1980–2026', borde: 'border-bandera-rojo' },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-7 sm:px-6 sm:pt-14">
      <header className="mb-9 grid items-center gap-12 sm:mb-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <div className="flex flex-col gap-4 sm:gap-5">
          <p className="etiqueta text-[12px] tracking-[0.16em] text-gold sm:text-[13px]">Tres juegos de política colombiana</p>
          <h1 className="font-display flex flex-col gap-1">
            <span className="text-[1.9rem] tracking-[0.02em] text-slate-300 sm:text-[2.75rem]">Bienvenido a</span>
            <span className="text-[7.25rem] leading-[0.85] text-gold sm:text-[10.5rem]">Urna</span>
          </h1>
          <p className="max-w-[30rem] text-base leading-relaxed text-slate-300 sm:text-lg">
            Elige un juego. Todos se juegan con la misma base de datos de políticos colombianos, de los años 80 a 2026.
          </p>
          <dl className="mt-1 grid max-w-[34rem] grid-cols-3 gap-3">
            {cifras.map((c) => (
              <div key={c.etiqueta} className={`flex flex-col-reverse justify-end gap-1 border-t-2 pt-2.5 ${c.borde}`}>
                <dt className="etiqueta text-[11px] text-slate-400">{c.etiqueta}</dt>
                <dd className="font-display whitespace-nowrap text-[1.6rem] tabular-nums text-slate-50 sm:text-[2.5rem]">{c.valor}</dd>
              </div>
            ))}
          </dl>
        </div>
        <TarjetonIlustrado />
      </header>

      <div className="mb-4 flex items-center gap-4">
        <h2 className="etiqueta text-[12px] tracking-[0.16em] text-slate-400 sm:text-[13px]">Elige un juego</h2>
        <div aria-hidden="true" className="h-px flex-1 bg-line" />
      </div>

      <div className="space-y-3">
        <GameCard
          numero="01"
          miniatura={<MiniGrid />}
          title={
            <>
              Política <span className="text-gold">Grid</span>
            </>
          }
          description="Completa la cuadrícula cruzando cargos, partidos y épocas."
          dailyDone={Boolean(stats.grid.daily[hoy])}
          open={open === 'grid'}
          onToggle={() => toggle('grid')}
        >
          <GridSetup
            settings={settings.grid}
            onSettings={(grid) => onSettings({ ...settings, grid })}
            stats={stats.grid}
            onPlay={() => navigate({ page: 'grid', daily: false, settings: settings.grid })}
            onPlayDaily={() => navigate({ page: 'grid', daily: true, settings: settings.grid })}
          />
        </GameCard>

        <GameCard
          numero="02"
          miniatura={<MiniTop10 />}
          title={
            <>
              Política <span className="text-gold">Top 10</span>
            </>
          }
          description="Adivina las respuestas de una lista de la política colombiana."
          dailyDone={Boolean(stats.top10.daily[hoy])}
          open={open === 'top10'}
          onToggle={() => toggle('top10')}
        >
          <Top10Setup
            settings={settings.top10}
            onSettings={(top10) => onSettings({ ...settings, top10 })}
            stats={stats.top10}
            onPlay={() => navigate({ page: 'top10', daily: false, settings: settings.top10 })}
            onPlayDaily={() => navigate({ page: 'top10', daily: true, settings: settings.top10 })}
          />
        </GameCard>

        <GameCard
          numero="03"
          miniatura={<MiniGabinete />}
          title={
            <>
              Arma el <span className="text-gold">Gabinete</span>
            </>
          }
          description={`Gira la ruleta y llena las ${TOTAL_SILLAS} sillas del gobierno.`}
          dailyDone={Boolean(stats.gabinete.diario[hoy])}
          open={open === 'gabinete'}
          onToggle={() => toggle('gabinete')}
        >
          <GabineteSetup
            settings={settings.gabinete}
            onSettings={(gabinete) => onSettings({ ...settings, gabinete })}
            stats={stats.gabinete}
            onPlay={() => navigate({ page: 'gabinete', daily: false, settings: settings.gabinete })}
            onPlayDaily={() => navigate({ page: 'gabinete', daily: true, settings: settings.gabinete })}
          />
        </GameCard>
      </div>
    </div>
  )
}
