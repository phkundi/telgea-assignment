import type { Brand } from '../types'
import { BrandButton, QrCode, ScreenCard } from './ui'

/**
 * Two ways to install the eSIM:
 *  - Primary: one-tap install on THIS device. This is the common case — the user
 *    is usually viewing the branded page on the same phone that needs the eSIM, so
 *    a QR they'd have to scan with that same phone is useless. A universal-link /
 *    one-tap install is the right primary path.
 *  - Secondary: a QR to scan, for people viewing on a desktop/another device.
 * Both confirm via the same handler.
 */
export default function InstallInstructions({
  brand,
  onInstalled,
}: {
  brand: Brand
  onInstalled: () => void
}) {
  return (
    <ScreenCard>
      <div className="text-center">
        <h2 className="text-lg font-bold text-slate-800">Install your eSIM</h2>
        <p className="mt-1 text-sm text-slate-500">
          Add your new line to this phone in one tap.
        </p>
      </div>

      {/* Primary: same-device one-tap install */}
      <BrandButton brand={brand} full onClick={onInstalled}>
        Install on this iPhone
      </BrandButton>
      <p className="-mt-1 text-center text-xs text-slate-400">
        Opens your phone's eSIM setup — no scanning needed.
      </p>

      {/* Divider */}
      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        on another device
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      {/* Secondary: QR for desktop viewers */}
      <div className="flex flex-col items-center gap-2">
        <QrCode size={132} />
        <p className="max-w-xs text-center text-xs text-slate-500">
          Viewing on a computer? Scan this with your phone's camera, then tap{' '}
          <span className="font-medium text-slate-600">I've installed it</span>.
        </p>
        <button
          type="button"
          onClick={onInstalled}
          className="text-sm font-medium underline underline-offset-2"
          style={{ color: brand.colors.primary }}
        >
          I've installed it
        </button>
      </div>
    </ScreenCard>
  )
}
