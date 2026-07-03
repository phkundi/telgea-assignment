import { useState } from 'react'
import type { Brand } from '../types'
import type { JourneyData } from '../machine/types'
import type { ManageActions } from '../machine/manageFlow'
import { COUNTRIES, MOCK_USAGE, planLabel } from '../data'
import PlanSelect from './PlanSelect'
import { BrandButton, ScreenCard } from './ui'

export default function ManageHome({
  brand,
  data,
  actions,
}: {
  brand: Brand
  data: JourneyData
  actions: ManageActions
}) {
  const [view, setView] = useState<'dashboard' | 'change'>('dashboard')
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [toppedUp, setToppedUp] = useState(false)

  const plan = data.plan ?? planLabel(brand.planPrefix, COUNTRIES[0].plans[0])
  const countryCode = data.countryCode ?? 'ES'
  const pct = Math.round((MOCK_USAGE.usedGb / MOCK_USAGE.totalGb) * 100)

  if (view === 'change') {
    return (
      <div>
        <PlanSelect
          brand={brand}
          countryCode={countryCode}
          onSelect={(label) => {
            actions.changePlan(label)
            setView('dashboard')
          }}
        />
        <div className="px-6 pb-6">
          <button
            type="button"
            onClick={() => setView('dashboard')}
            className="text-sm font-medium text-slate-500 underline underline-offset-2"
          >
            ← Back to dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <ScreenCard>
      <div>
        <h2 className="text-lg font-bold text-slate-800">Manage your plan</h2>
        <p className="mt-1 text-sm text-slate-500">{plan}</p>
      </div>

      {/* Usage */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm font-medium text-slate-700">Data usage</span>
          <span className="text-xs text-slate-500">
            {MOCK_USAGE.usedGb} / {MOCK_USAGE.totalGb} GB this cycle
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full"
            style={{ width: `${pct}%`, backgroundColor: brand.colors.primary }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <BrandButton
          brand={brand}
          full
          onClick={() => {
            actions.topUp()
            setToppedUp(true)
          }}
        >
          Top up data
        </BrandButton>
        {toppedUp && (
          <p className="text-center text-xs text-emerald-600">Top-up added ✓</p>
        )}

        <button
          type="button"
          onClick={() => setView('change')}
          className="rounded-lg border border-slate-300 bg-white py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Change plan
        </button>

        {!confirmCancel ? (
          <button
            type="button"
            onClick={() => setConfirmCancel(true)}
            className="py-1 text-sm font-medium text-rose-600 hover:underline"
          >
            Cancel plan
          </button>
        ) : (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-center">
            <p className="text-sm text-slate-700">Cancel your plan?</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={actions.cancel}
                className="flex-1 rounded-lg bg-rose-600 py-2 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Yes, cancel
              </button>
              <button
                type="button"
                onClick={() => setConfirmCancel(false)}
                className="flex-1 rounded-lg border border-slate-300 bg-white py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Keep plan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Demo affordance for the membership-loss lifecycle edge (§7 grace period) */}
      <button
        type="button"
        onClick={actions.membershipEnded}
        className="mt-2 text-center text-xs text-slate-400 underline underline-offset-2 hover:text-slate-600"
      >
        Simulate: membership ended
      </button>
    </ScreenCard>
  )
}
