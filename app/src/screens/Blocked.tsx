import type { Brand } from '../types'
import { ScreenStatus } from './ui'

export default function Blocked({ brand }: { brand: Brand }) {
  return (
    <ScreenStatus>
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full"
        style={{ backgroundColor: `${brand.colors.accent}22` }}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke={brand.colors.accent}
          strokeWidth="2"
        >
          <rect x="4" y="10" width="16" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className="text-lg font-bold text-slate-800">
        This offer is for {brand.name} members
      </h2>
      <p className="max-w-xs text-sm text-slate-500">
        We couldn't find an active membership for this email. Use the email linked
        to your membership, or Reset to try again.
      </p>
    </ScreenStatus>
  )
}
