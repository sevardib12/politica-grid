import { Search, Timer } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Politician } from '../data/types.ts'
import type { Criterion } from '../utils/criteria.ts'
import { searchPoliticians } from '../utils/search.ts'
import { PoliticianAvatar } from './PoliticianAvatar.tsx'
import { Modal } from './ui.tsx'

function useDebounced<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), ms)
    return () => window.clearTimeout(id)
  }, [value, ms])
  return debounced
}

export function SearchModal({
  row,
  col,
  used,
  attemptsLeft,
  timeLeft,
  onGuess,
  onClose,
}: {
  row: Criterion
  col: Criterion
  used: ReadonlySet<string>
  attemptsLeft: number
  timeLeft: number | null
  onGuess: (id: string) => void
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const debounced = useDebounced(query, 150)
  const results = useMemo(() => searchPoliticians(debounced), [debounced])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const pick = (p: Politician) => {
    if (used.has(p.id)) return
    onGuess(p.id)
  }

  return (
    <Modal
      onClose={onClose}
      title={
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>Elige un político</span>
          {timeLeft !== null && (
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-cyan">
              <Timer size={15} aria-hidden="true" />
              {Math.ceil(timeLeft)} s
            </span>
          )}
        </span>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="rounded-xl border border-line bg-ink/60 px-3 py-1.5 font-semibold text-slate-100">
          <span className="mr-2 text-[10px] font-extrabold tracking-wider text-cyan">{row.tag}</span>
          {row.label}
        </span>
        <span className="font-bold text-gold">×</span>
        <span className="rounded-xl border border-line bg-ink/60 px-3 py-1.5 font-semibold text-slate-100">
          <span className="mr-2 text-[10px] font-extrabold tracking-wider text-cyan">{col.tag}</span>
          {col.label}
        </span>
      </div>

      <label className="relative block">
        <span className="sr-only">Buscar político</span>
        <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setActive((a) => Math.min(a + 1, Math.max(0, results.length - 1)))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setActive((a) => Math.max(0, a - 1))
            } else if (e.key === 'Enter') {
              e.preventDefault()
              // Si el usuario pulsa Enter antes de que termine el debounce, se busca al instante.
              const list = debounced === query ? results : searchPoliticians(query)
              const choice = list[Math.min(active, Math.max(0, list.length - 1))]
              if (choice) pick(choice)
            }
          }}
          placeholder="Escribe un nombre (sin tildes también sirve)…"
          autoComplete="off"
          spellCheck={false}
          className="w-full rounded-2xl border border-line bg-ink py-3 pl-10 pr-3 text-base text-slate-50 placeholder:text-slate-500 focus:border-cyan focus:outline-none"
        />
      </label>

      <ul className="mt-3 space-y-1.5" role="listbox" aria-label="Resultados">
        {debounced.trim() !== '' && results.length === 0 && (
          <li className="rounded-xl bg-white/5 px-3 py-3 text-sm text-slate-400">
            Sin coincidencias. Prueba con el apellido o el apodo.
          </li>
        )}
        {results.map((p, i) => {
          const taken = used.has(p.id)
          return (
            <li key={p.id} role="option" aria-selected={i === active}>
              <button
                type="button"
                disabled={taken}
                onClick={() => pick(p)}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                  taken
                    ? 'border-transparent bg-white/5 opacity-50'
                    : i === active
                      ? 'border-gold bg-gold/10'
                      : 'border-transparent bg-white/5 hover:bg-white/10'
                }`}
              >
                <PoliticianAvatar politician={p} size={40} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-50">{p.nombre}</span>
                  {p.alias && <span className="block truncate text-xs italic text-slate-400">“{p.alias}”</span>}
                </span>
                {taken && <span className="text-[11px] font-semibold text-slate-400">ya usado</span>}
              </button>
            </li>
          )
        })}
      </ul>

      <p className="mt-4 text-xs text-slate-400">
        Te quedan <strong className="text-gold">{attemptsLeft}</strong> intentos en total. Cada respuesta, buena o mala, gasta uno.
      </p>
    </Modal>
  )
}
