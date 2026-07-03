import type { ReactNode } from 'react'
import type { Brand } from '../types'
import telgeaLogo from '../assets/telgea.png'

/** Partner crest (image if available, else initials on the brand accent). */
export function BrandMark({ brand, size = 28 }: { brand: Brand; size?: number }) {
  if (brand.logo) {
    return (
      <img
        src={brand.logo}
        alt={brand.name}
        className="object-contain"
        style={{ height: size, width: size }}
      />
    )
  }
  return (
    <span
      className="flex items-center justify-center rounded-full font-bold"
      style={{
        height: size,
        width: size,
        fontSize: size * 0.4,
        backgroundColor: brand.colors.accent,
        color: brand.colors.onAccent,
      }}
    >
      {brand.logoText}
    </span>
  )
}

/** Telgea lockup: the lime mark + wordmark. `textClass` sets the wordmark colour. */
export function TelgeaMark({
  size = 16,
  textClass = 'text-slate-700',
}: {
  size?: number
  textClass?: string
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <img
        src={telgeaLogo}
        alt="Telgea"
        className="object-contain"
        style={{ height: size, width: size }}
      />
      <span className={`font-semibold ${textClass}`}>Telgea</span>
    </span>
  )
}

/** Simple branded spinner. */
export function Spinner({ color = '#64748b' }: { color?: string }) {
  return (
    <div
      className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200"
      style={{ borderTopColor: color }}
      role="status"
      aria-label="Loading"
    />
  )
}

/** Primary CTA styled in the partner brand colour. */
export function BrandButton({
  brand,
  children,
  onClick,
  disabled,
  type = 'button',
  full,
}: {
  brand: Brand
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
  full?: boolean
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-4 py-2.5 text-sm font-semibold shadow transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 ${
        full ? 'w-full' : ''
      }`}
      style={{ backgroundColor: brand.colors.primary, color: brand.colors.onPrimary }}
    >
      {children}
    </button>
  )
}

/**
 * Deterministic mock QR code (not a real payload). Three finder squares plus a
 * fixed dot pattern so it reads as a QR without encoding anything.
 */
export function QrCode({ size = 168 }: { size?: number }) {
  const n = 21
  const inBox = (x: number, y: number, bx: number, by: number) =>
    x >= bx && x < bx + 7 && y >= by && y < by + 7
  const isFinder = (x: number, y: number) =>
    inBox(x, y, 0, 0) || inBox(x, y, n - 7, 0) || inBox(x, y, 0, n - 7)

  const cells: ReactNode[] = []
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      let on: boolean
      if (isFinder(x, y)) {
        const lx = x < 7 ? x : x - (n - 7)
        const ly = y < 7 ? y : y - (n - 7)
        on =
          lx === 0 ||
          lx === 6 ||
          ly === 0 ||
          ly === 6 ||
          (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4)
      } else {
        on = (x * 3 + y * 7 + x * y * 2) % 5 < 2
      }
      if (on) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />)
    }
  }

  return (
    <svg
      viewBox={`0 0 ${n} ${n}`}
      width={size}
      height={size}
      className="rounded-lg border border-slate-200 bg-white p-2"
      style={{ shapeRendering: 'crispEdges' }}
      role="img"
      aria-label="Mock activation QR code"
    >
      <rect x={0} y={0} width={n} height={n} fill="#ffffff" />
      <g fill="#0f172a">{cells}</g>
    </svg>
  )
}

/** Success check badge in the brand colour. */
export function CheckBadge({ color }: { color: string }) {
  return (
    <div
      className="flex h-14 w-14 items-center justify-center rounded-full"
      style={{ backgroundColor: color }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

/** Shared centered layout for form-style screens. */
export function ScreenCard({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4 p-6">{children}</div>
  )
}

/** Shared centered layout for status screens (spinner / success). */
export function ScreenStatus({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-10 text-center">
      {children}
    </div>
  )
}
