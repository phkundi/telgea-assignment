import type { Brand } from '../types'
import { ScreenStatus, Spinner } from './ui'

export default function MembershipCheck({ brand }: { brand: Brand }) {
  return (
    <ScreenStatus>
      <Spinner color={brand.colors.primary} />
      <h2 className="text-lg font-bold text-slate-800">
        Verifying your {brand.name} membership…
      </h2>
      <p className="max-w-xs text-sm text-slate-500">
        This offer is available to {brand.name} members.
      </p>
    </ScreenStatus>
  )
}
