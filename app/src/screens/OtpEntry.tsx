import { useState } from 'react'
import type { Brand } from '../types'
import { BrandButton, ScreenCard } from './ui'

export default function OtpEntry({
  brand,
  email,
  onVerify,
}: {
  brand: Brand
  email: string
  onVerify: (code: string) => boolean
}) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)

  const submit = () => {
    if (!onVerify(code)) setError(true)
  }

  return (
    <ScreenCard>
      <div>
        <h2 className="text-lg font-bold text-slate-800">Check your inbox</h2>
        <p className="mt-1 text-sm text-slate-500">
          We sent a 6-digit code to{' '}
          <span className="font-medium text-slate-700">{email}</span>
        </p>
      </div>

      <input
        inputMode="numeric"
        maxLength={6}
        value={code}
        onChange={(e) => {
          setCode(e.target.value.replace(/\D/g, ''))
          setError(false)
        }}
        placeholder="123456"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-center font-mono text-lg tracking-[0.4em] focus:border-slate-400 focus:outline-none"
      />

      {error && (
        <p className="text-sm text-rose-600">That code doesn't match.</p>
      )}

      <BrandButton brand={brand} full disabled={code.length < 6} onClick={submit}>
        Verify
      </BrandButton>
    </ScreenCard>
  )
}
