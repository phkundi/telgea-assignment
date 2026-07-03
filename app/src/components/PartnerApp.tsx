import type { Brand } from '../types'
import { BrandMark } from '../screens/ui'

/** Faux mobile status bar so Column A reads as a phone (a separate device/window). */
function StatusBar({ color, bg }: { color: string; bg: string }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-1 text-[11px] font-semibold"
      style={{ backgroundColor: bg, color }}
    >
      <span>9:41</span>
      <span className="flex items-center gap-1">
        {/* signal */}
        <svg width="16" height="10" viewBox="0 0 16 10" fill={color}>
          <rect x="0" y="7" width="2.5" height="3" rx="0.5" />
          <rect x="4" y="5" width="2.5" height="5" rx="0.5" />
          <rect x="8" y="2.5" width="2.5" height="7.5" rx="0.5" />
          <rect x="12" y="0" width="2.5" height="10" rx="0.5" />
        </svg>
        {/* wifi */}
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke={color} strokeWidth="1.3">
          <path d="M1 3.2a9 9 0 0 1 12 0M3 5.4a6 6 0 0 1 8 0M5.2 7.6a3 3 0 0 1 3.6 0" strokeLinecap="round" />
        </svg>
        {/* battery */}
        <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
          <rect x="0.5" y="0.5" width="16" height="9" rx="2" stroke={color} />
          <rect x="2" y="2" width="12" height="6" rx="1" fill={color} />
          <rect x="17.5" y="3" width="1.5" height="4" rx="0.75" fill={color} />
        </svg>
      </span>
    </div>
  )
}

interface PartnerAppProps {
  brand: Brand
  onBuy: () => void
  onManage: () => void
}

/** Column A — the partner's own app surface (fully partner-branded). */
export default function PartnerApp({ brand, onBuy, onManage }: PartnerAppProps) {
  const { colors } = brand

  return (
    <div className="flex h-full flex-col" style={{ backgroundColor: colors.primary }}>
      <StatusBar color={colors.onPrimary} bg={colors.primaryDark} />

      {/* App header */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ backgroundColor: colors.primaryDark, color: colors.onPrimary }}
      >
        <BrandMark brand={brand} size={26} />
        <span className="text-sm font-semibold">{brand.name}</span>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        {/* Promo card */}
        <div className="rounded-xl bg-white/95 p-4 shadow-lg">
          <span
            className="inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
            style={{ backgroundColor: colors.accent, color: colors.onAccent }}
          >
            New
          </span>
          <h3 className="mt-2 text-base font-bold text-slate-900">
            Get the {brand.name} mobile plan
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Your team in your pocket — a mobile plan that supports the club.
          </p>
          <button
            type="button"
            onClick={onBuy}
            className="mt-3 w-full rounded-lg py-2.5 text-sm font-semibold shadow transition-opacity hover:opacity-90"
            style={{ backgroundColor: colors.accent, color: colors.onAccent }}
          >
            Get started
          </button>
        </div>

        <button
          type="button"
          onClick={onManage}
          className="text-left text-sm font-medium underline underline-offset-2"
          style={{ color: colors.onPrimary }}
        >
          Manage my plan
        </button>
      </div>
    </div>
  )
}
