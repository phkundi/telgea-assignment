import type { Brand } from '../types'
import { ScreenStatus } from './ui'

export default function Cancelled({
  brand,
  reason,
}: {
  brand: Brand
  reason: 'user' | 'membership' | undefined
}) {
  const membership = reason === 'membership'

  return (
    <ScreenStatus>
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full"
        style={{ backgroundColor: `${brand.colors.primary}18` }}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke={brand.colors.primary}
          strokeWidth="2"
        >
          {membership ? (
            <>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
            </>
          ) : (
            <>
              <circle cx="12" cy="12" r="9" />
              <path d="M9 12h6" strokeLinecap="round" />
            </>
          )}
        </svg>
      </div>

      {membership ? (
        <>
          <h2 className="text-lg font-bold text-slate-800">Membership ended</h2>
          <p className="max-w-xs text-sm text-slate-500">
            Your {brand.name} membership ended, so your plan is winding down.
            <span className="font-medium text-slate-700">
              {' '}
              Your plan stays active for 7 days.
            </span>
          </p>
        </>
      ) : (
        <>
          <h2 className="text-lg font-bold text-slate-800">Plan cancelled</h2>
          <p className="max-w-xs text-sm text-slate-500">
            Your plan has been cancelled. You can start a new one any time.
          </p>
        </>
      )}
    </ScreenStatus>
  )
}
