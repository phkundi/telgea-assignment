// Mock data for the buy journey (§8). Deterministic — no randomness — so the same
// clicks always produce the same numbers and logs.

export interface Plan {
  id: string
  tier: string
  priceEur: number
}

export interface Country {
  code: string
  name: string
  dialCode: string
  plans: Plan[]
}

export const COUNTRIES: Country[] = [
  {
    code: 'ES',
    name: 'Spain',
    dialCode: '+34',
    plans: [
      { id: 'es-10', tier: '10GB', priceEur: 12 },
      { id: 'es-25', tier: '25GB', priceEur: 18 },
      { id: 'es-unl', tier: 'Unlimited', priceEur: 29 },
    ],
  },
  {
    code: 'DE',
    name: 'Germany',
    dialCode: '+49',
    plans: [
      { id: 'de-10', tier: '10GB', priceEur: 14 },
      { id: 'de-20', tier: '20GB', priceEur: 19 },
      { id: 'de-unl', tier: 'Unlimited', priceEur: 32 },
    ],
  },
  {
    code: 'AT',
    name: 'Austria',
    dialCode: '+43',
    plans: [
      { id: 'at-8', tier: '8GB', priceEur: 11 },
      { id: 'at-20', tier: '20GB', priceEur: 18 },
      { id: 'at-unl', tier: 'Unlimited', priceEur: 30 },
    ],
  },
]

/** OTP demo code (§8) — also surfaced in the console. */
export const DEMO_OTP = '123456'

/** Serial-like eSIM identifier for display only (not explained on screen). */
export const MOCK_ICCID = '8934 0771 2345 6789 012'

/** Demo install-confirmation delay (~5s), representing the real ~15 min (§6). */
export const INSTALL_TIMER_MS = 5000

/** Provisioning steps fire ~400–600ms apart so the console reads like a live sequence (§6). */
export const PROVISION_STEP_MS = 550

/** Demo membership-verification delay (spinner) before pass/fail resolves. */
export const MEMBERSHIP_CHECK_MS = 1400

/** Emails that always pass the membership check, even in the fail scenario (§8 optional allowlist). */
export const MEMBER_ALLOWLIST = ['member@fcb.com']

/** Static usage figures for the manage dashboard (§8 — usage is static). */
export const MOCK_USAGE = { usedGb: 3.2, totalGb: 10 }

/**
 * SMS-fallback verification (install-not-confirmed path).
 * The user texts VERIFY_CODE from their new line to this Telgea-owned number. The
 * number is monitored: the code identifies the user, and the sending number proves
 * which line it came from — if it's the assigned MSISDN, the new line is live.
 */
export const TELGEA_VERIFY_NUMBER = '+44 7418 310 042'
export const VERIFY_CODE = 'TG-4821'

export const findCountry = (code: string | undefined): Country | undefined =>
  COUNTRIES.find((c) => c.code === code)

export const planLabel = (prefix: string, plan: Plan): string =>
  `${prefix} ${plan.tier} — €${plan.priceEur}/mo`

export const msisdnFor = (dialCode: string): string =>
  `${dialCode} 600 123 456`
