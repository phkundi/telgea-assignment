import type { Brand } from '../types'
import { findCountry, planLabel } from '../data'
import { ScreenCard } from './ui'

export default function PlanSelect({
  brand,
  countryCode,
  onSelect,
}: {
  brand: Brand
  countryCode: string | undefined
  onSelect: (label: string) => void
}) {
  const country = findCountry(countryCode)
  const plans = country?.plans ?? []

  return (
    <ScreenCard>
      <div>
        <h2 className="text-lg font-bold text-slate-800">
          Choose your {brand.planPrefix} plan
        </h2>
        {country && (
          <p className="mt-1 text-sm text-slate-500">Data in {country.name}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {plans.map((p) => {
          const label = planLabel(brand.planPrefix, p)
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(label)}
              className="flex items-center justify-between rounded-lg border-2 bg-white px-4 py-3 text-left transition-colors hover:bg-slate-50"
              style={{ borderColor: `${brand.colors.primary}33` }}
            >
              <div>
                <div className="text-sm font-semibold text-slate-800">
                  {brand.planPrefix} {p.tier}
                </div>
                <div className="text-xs text-slate-500">Monthly plan</div>
              </div>
              <div
                className="text-sm font-bold"
                style={{ color: brand.colors.primary }}
              >
                €{p.priceEur}/mo
              </div>
            </button>
          )
        })}
      </div>
    </ScreenCard>
  )
}
