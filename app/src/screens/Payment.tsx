import type { Brand } from '../types'
import { BrandButton, ScreenCard } from './ui'

export default function Payment({
  brand,
  plan,
  onPay,
}: {
  brand: Brand
  plan: string
  onPay: () => void
}) {
  return (
    <ScreenCard>
      <div>
        <h2 className="text-lg font-bold text-slate-800">Payment</h2>
        <p className="mt-1 text-sm text-slate-500">Review and confirm your plan.</p>
      </div>

      <div className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
        {plan}
      </div>

      <div className="flex flex-col gap-2">
        <input
          disabled
          value="4242 4242 4242 4242"
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-500"
        />
        <div className="flex gap-2">
          <input
            disabled
            value="12 / 28"
            className="w-1/2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-500"
          />
          <input
            disabled
            value="123"
            className="w-1/2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-500"
          />
        </div>
      </div>

      <p className="text-xs text-slate-400">
        Secure checkout · Telgea is the merchant of record.
      </p>

      <BrandButton brand={brand} full onClick={onPay}>
        Pay
      </BrandButton>
    </ScreenCard>
  )
}
