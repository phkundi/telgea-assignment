import type { Brand } from '../types'
import { CheckBadge, ScreenStatus } from './ui'

export default function Active({
  brand,
  msisdn,
  onManage,
}: {
  brand: Brand
  msisdn: string
  onManage: () => void
}) {
  return (
    <ScreenStatus>
      <CheckBadge color={brand.colors.primary} />
      <h2 className="text-lg font-bold text-slate-800">
        Your {brand.name} line is live
      </h2>
      <div className="rounded-lg bg-slate-100 px-4 py-2 font-mono text-sm text-slate-700">
        {msisdn}
      </div>
      <button
        type="button"
        onClick={onManage}
        className="text-sm font-medium underline underline-offset-2"
        style={{ color: brand.colors.primary }}
      >
        Manage my plan
      </button>
    </ScreenStatus>
  )
}
