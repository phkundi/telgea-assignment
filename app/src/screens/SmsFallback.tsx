import type { Brand } from '../types'
import { TELGEA_VERIFY_NUMBER, VERIFY_CODE } from '../data'
import { BrandButton, ScreenCard } from './ui'

export default function SmsFallback({
  brand,
  msisdn,
  onSimulate,
}: {
  brand: Brand
  msisdn: string
  onSimulate: () => void
}) {
  return (
    <ScreenCard>
      <div className="text-center">
        <h2 className="text-lg font-bold text-slate-800">Verify your new line</h2>
        <p className="mt-1 text-sm text-slate-500">
          We couldn't confirm activation automatically. From your new {brand.name}{' '}
          line, send this code by text:
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="text-center">
          <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Text this code
          </div>
          <div className="mt-1 font-mono text-2xl font-bold tracking-widest text-slate-800">
            {VERIFY_CODE}
          </div>
        </div>
        <div className="mt-3 border-t border-slate-100 pt-3 text-center">
          <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            To
          </div>
          <div className="mt-1 font-mono text-base text-slate-700">
            {TELGEA_VERIFY_NUMBER}
          </div>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-slate-500">
        Sending the code from your new line ({msisdn}) is how we confirm it's live —
        if it arrived from your old number instead, the switch hasn't completed yet.
      </p>

      <BrandButton brand={brand} full onClick={onSimulate}>
        Simulate text from the new SIM
      </BrandButton>
    </ScreenCard>
  )
}
