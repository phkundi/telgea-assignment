import type { Brand } from '../types'
import { COUNTRIES, type Country } from '../data'
import { ScreenCard } from './ui'

export default function CountrySelect({
  brand,
  onSelect,
}: {
  brand: Brand
  onSelect: (country: Country) => void
}) {
  return (
    <ScreenCard>
      <div>
        <h2 className="text-lg font-bold text-slate-800">
          Where will you use your plan?
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Each {brand.planPrefix} plan is scoped to one country.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {COUNTRIES.map((c) => (
          <button
            key={c.code}
            type="button"
            onClick={() => onSelect(c)}
            className="flex items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-3 text-left text-sm font-medium text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50"
          >
            <span>{c.name}</span>
            <span className="font-mono text-xs text-slate-400">{c.dialCode}</span>
          </button>
        ))}
      </div>
    </ScreenCard>
  )
}
