import type { Brand } from '../types'
import { ScreenStatus, Spinner } from './ui'

export default function Provisioning({ brand }: { brand: Brand }) {
  return (
    <ScreenStatus>
      <Spinner color={brand.colors.primary} />
      <h2 className="text-lg font-bold text-slate-800">Setting up your line…</h2>
      <p className="max-w-xs text-sm text-slate-500">
        Assigning your number and preparing your eSIM.
      </p>
    </ScreenStatus>
  )
}
