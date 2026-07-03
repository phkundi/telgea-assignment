import type { Brand, Scenario } from '../types'
import { BRANDS, SCENARIOS } from '../types'
import { TelgeaMark } from '../screens/ui'

interface TopBarProps {
  brand: Brand
  onBrandChange: (id: string) => void
  gating: boolean
  onGatingChange: (on: boolean) => void
  scenario: Scenario
  onScenarioChange: (s: Scenario) => void
  onReset: () => void
}

export default function TopBar({
  brand,
  onBrandChange,
  gating,
  onGatingChange,
  scenario,
  onScenarioChange,
  onReset,
}: TopBarProps) {
  return (
    <header className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-slate-200 bg-white px-5 py-3 shadow-sm">
      <TelgeaMark size={18} textClass="text-slate-900" />

      <div className="h-6 w-px bg-slate-200" />

      {/* Partner brand */}
      <label className="flex items-center gap-2 text-sm">
        <span className="font-medium text-slate-600">Partner</span>
        <select
          value={brand.id}
          onChange={(e) => onBrandChange(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-800 focus:border-slate-400 focus:outline-none"
        >
          {BRANDS.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </label>

      {/* Membership gating toggle */}
      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <span className="font-medium text-slate-600">Requires membership</span>
        <button
          type="button"
          role="switch"
          aria-checked={gating}
          onClick={() => onGatingChange(!gating)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            gating ? 'bg-brand-blue' : 'bg-slate-300'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
              gating ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
        <span className="w-7 text-xs font-medium text-slate-500">
          {gating ? 'ON' : 'OFF'}
        </span>
      </label>

      {/* Scenario */}
      <label className="flex items-center gap-2 text-sm">
        <span className="font-medium text-slate-600">Scenario</span>
        <select
          value={scenario}
          onChange={(e) => onScenarioChange(e.target.value as Scenario)}
          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-800 focus:border-slate-400 focus:outline-none"
        >
          {SCENARIOS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={onReset}
        className="ml-auto rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 active:bg-slate-100"
      >
        Reset
      </button>
    </header>
  )
}
