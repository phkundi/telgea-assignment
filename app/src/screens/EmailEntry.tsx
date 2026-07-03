import { useState } from 'react'
import type { Brand } from '../types'
import { BrandButton, ScreenCard } from './ui'

export default function EmailEntry({
  brand,
  onSubmit,
}: {
  brand: Brand
  onSubmit: (email: string) => void
}) {
  const [email, setEmail] = useState('')
  const valid = /\S+@\S+\.\S+/.test(email.trim())

  return (
    <ScreenCard>
      <div>
        <h2 className="text-lg font-bold text-slate-800">
          Your {brand.name} mobile plan
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter your email to get started — we'll send you a one-time code to sign
          in or create your account.
        </p>
      </div>

      <label className="text-sm font-medium text-slate-600">
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
        />
      </label>

      <BrandButton brand={brand} full disabled={!valid} onClick={() => onSubmit(email.trim())}>
        Continue
      </BrandButton>
    </ScreenCard>
  )
}
