import { useState } from 'react'
import type { Brand } from '../types'
import EmailEntry from './EmailEntry'
import OtpEntry from './OtpEntry'

/**
 * Returning-user re-auth (§7): email → OTP, reusing the buy-flow screens.
 * Only reached when the user is NOT already signed in this session.
 */
export default function ManageAuth({
  brand,
  onSendCode,
  onReauth,
}: {
  brand: Brand
  onSendCode: () => void
  onReauth: (code: string) => boolean
}) {
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')

  if (step === 'email') {
    return (
      <EmailEntry
        brand={brand}
        onSubmit={(e) => {
          setEmail(e)
          onSendCode()
          setStep('otp')
        }}
      />
    )
  }

  return <OtpEntry brand={brand} email={email} onVerify={onReauth} />
}
