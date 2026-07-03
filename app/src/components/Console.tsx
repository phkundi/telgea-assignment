import { useEffect, useRef } from 'react'
import type { Actor, LogEntry } from '../types'
import { TelgeaMark } from '../screens/ui'

/** Colour per actor tag. Chosen to read on the dark console surface. */
const ACTOR_STYLES: Record<Actor, string> = {
  Partner: 'text-amber-300',
  Telgea: 'text-sky-300',
  Payment: 'text-emerald-300',
  eSIM: 'text-violet-300',
  Network: 'text-rose-300',
  Notify: 'text-teal-300',
}

/** Format elapsed ms as a relative timestamp, e.g. `t+0.4s`. */
function formatT(tMs: number): string {
  return `t+${(tMs / 1000).toFixed(1)}s`
}

interface ConsoleProps {
  logs: LogEntry[]
}

export default function Console({ logs }: ConsoleProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to the newest line as logs arrive.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [logs])

  return (
    <div className="flex h-full flex-col bg-console-bg text-console-text">
      <div className="flex items-center gap-2 border-b border-console-line px-4 py-3">
        <span className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-rose-500/80" />
          <span className="h-3 w-3 rounded-full bg-amber-400/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
        </span>
        <span className="ml-2">
          <TelgeaMark size={15} textClass="text-slate-100" />
        </span>
        <span className="text-sm text-slate-500">· behind the scenes</span>
        <span className="ml-auto text-xs text-slate-500">
          partner ↔ Telgea ↔ carrier
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed"
      >
        {logs.length === 0 ? (
          <p className="text-slate-600">
            Waiting for activity… the live flow will appear here.
          </p>
        ) : (
          <ul className="space-y-1">
            {logs.map((log) => (
              <li key={log.id} className="flex gap-2">
                <span className="w-14 shrink-0 text-slate-500">
                  {formatT(log.tMs)}
                </span>
                <span
                  className={`w-16 shrink-0 font-semibold ${ACTOR_STYLES[log.actor]}`}
                >
                  {log.actor}
                </span>
                <span className="text-slate-300">{log.message}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
