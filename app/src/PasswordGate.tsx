import { useState, type FormEvent, type ReactNode } from 'react'
import { TelgeaMark } from './screens/ui'

/**
 * Soft password gate for the whole app.
 *
 * NOTE: this is a static front-end with no backend, so the password is bundled
 * into the client JS and localStorage is user-readable — this keeps casual
 * viewers out of a hosted demo, it is NOT real security.
 *
 * Config: set `VITE_APP_PASSWORD` (build-time env). If unset/empty, the gate is
 * disabled. On success we store an expiry in localStorage and skip the prompt for 24h.
 */
const PASSWORD = import.meta.env.VITE_APP_PASSWORD
const STORAGE_KEY = 'telgea-poc-access'
const TTL_MS = 24 * 60 * 60 * 1000

function hasValidAccess(): boolean {
  try {
    const expiry = Number(localStorage.getItem(STORAGE_KEY))
    return Number.isFinite(expiry) && expiry > Date.now()
  } catch {
    return false
  }
}

export default function PasswordGate({ children }: { children: ReactNode }) {
  const gateEnabled = Boolean(PASSWORD)
  const [granted, setGranted] = useState(() => !gateEnabled || hasValidAccess())
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  if (granted) return <>{children}</>

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (value === PASSWORD) {
      try {
        localStorage.setItem(STORAGE_KEY, String(Date.now() + TTL_MS))
      } catch {
        /* storage unavailable — grant for this session only */
      }
      setGranted(true)
    } else {
      setError(true)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-slate-200 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/10"
      >
        <TelgeaMark size={20} textClass="text-slate-900" />
        <h1 className="mt-4 text-lg font-bold text-slate-800">
          This demo is password protected
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Enter the access password to continue.
        </p>

        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setError(false)
          }}
          placeholder="Password"
          className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
        />

        {error && <p className="mt-2 text-sm text-rose-600">Incorrect password.</p>}

        <button
          type="submit"
          disabled={!value}
          className="mt-4 w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Unlock
        </button>
      </form>
    </div>
  )
}
