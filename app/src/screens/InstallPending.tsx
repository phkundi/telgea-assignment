import type { Brand } from '../types'
import { ScreenStatus, Spinner } from './ui'

export default function InstallPending({ brand }: { brand: Brand }) {
  return (
    <ScreenStatus>
      <Spinner color={brand.colors.primary} />
      <h2 className="text-lg font-bold text-slate-800">Activating your line…</h2>
      <p className="max-w-xs text-sm text-slate-500">
        This can take a few minutes. You can close this page — we'll notify you
        when it's ready.
      </p>
    </ScreenStatus>
  )
}
