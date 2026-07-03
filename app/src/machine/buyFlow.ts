import type { Brand, Scenario } from '../types'
import {
  DEMO_OTP,
  INSTALL_TIMER_MS,
  MEMBER_ALLOWLIST,
  MEMBERSHIP_CHECK_MS,
  MOCK_ICCID,
  PROVISION_STEP_MS,
  TELGEA_VERIFY_NUMBER,
  VERIFY_CODE,
  msisdnFor,
  type Country,
} from '../data'
import type { Journey } from './useJourney'

/** Handlers the buy-journey screens call. */
export interface BuyActions {
  start: () => void
  submitEmail: (email: string) => void
  verifyOtp: (code: string) => boolean
  selectCountry: (country: Country) => void
  selectPlan: (label: string) => void
  pay: () => void
  confirmInstall: () => void
  simulateSms: () => void
  goManage: () => void
}

/**
 * Build the buy-journey handlers over the state-machine primitives.
 * Called during render so the closures always see the latest state/config;
 * transitions themselves are dispatched (reducer is the source of truth), so
 * timer callbacks that fire later still act on current state.
 *
 * Handles the gating-OFF happy path, the gating-ON membership branch
 * (MEMBERSHIP_CHECK → OTP_SENT / BLOCKED), and the install-not-confirmed
 * SMS-fallback scenario. Driven by the top-bar gating toggle + scenario selector.
 */
export function createBuyActions(
  journey: Journey,
  brand: Brand,
  gating: boolean,
  scenario: Scenario,
): BuyActions {
  const { state, goto, log, runSequence, schedule } = journey

  return {
    start: () => goto('EMAIL_ENTRY', { partnerName: brand.name }),

    submitEmail: (email) => {
      log('Telgea', 'Email submitted')
      if (!gating) {
        goto('OTP_SENT', { email })
        return
      }
      // Gating ON: show the membership spinner, then resolve pass/fail.
      goto('MEMBERSHIP_CHECK', { email })
      schedule(MEMBERSHIP_CHECK_MS, () => {
        const passes =
          scenario !== 'membership-fail' ||
          MEMBER_ALLOWLIST.includes(email.trim().toLowerCase())
        if (passes) {
          log('Partner', `Confirmed: active ${brand.name} member`)
          goto('OTP_SENT', { email })
        } else {
          log('Partner', 'No active membership found for this email')
          goto('BLOCKED')
        }
      })
    },

    verifyOtp: (code) => {
      if (code.trim() !== DEMO_OTP) return false
      log('Telgea', 'Code verified → account created & signed in')
      goto('COUNTRY_SELECT', { signedIn: true })
      return true
    },

    selectCountry: (country) => {
      log('Telgea', `Country selected: ${country.name}`)
      goto('PLAN_SELECT', {
        country: country.name,
        countryCode: country.code,
        dialCode: country.dialCode,
      })
    },

    selectPlan: (label) => {
      log('Telgea', `Plan selected: ${label}`)
      goto('PAYMENT', { plan: label })
    },

    pay: () => {
      const msisdn = msisdnFor(state.data.dialCode ?? '+34')
      log('Payment', 'Payment authorised (Stripe)')
      log('Telgea', 'Telgea recorded as merchant of record')
      log('Telgea', `Revenue share recorded for ${brand.name}`)
      // Enter provisioning ("Provisioning started" on entry) then stream the
      // carrier steps ~550ms apart so the console reads like a live sequence.
      goto('PROVISIONING', { msisdn, iccid: MOCK_ICCID })
      runSequence([
        {
          delay: PROVISION_STEP_MS,
          fn: () => log('Network', `Phone number assigned: ${msisdn}`),
        },
        {
          delay: PROVISION_STEP_MS,
          fn: () => log('eSIM', 'eSIM profile requested from carrier'),
        },
        {
          delay: PROVISION_STEP_MS,
          fn: () => log('eSIM', 'eSIM profile ready'),
        },
        { delay: PROVISION_STEP_MS, fn: () => goto('INSTALL_INSTRUCTIONS') },
      ])
    },

    confirmInstall: () => {
      // Optimistic activation: show "activating", confirm asynchronously (§6).
      goto('INSTALL_PENDING')
      schedule(INSTALL_TIMER_MS, () => {
        if (scenario === 'install-not-confirmed') {
          log('Notify', 'No auto-confirmation → asking user to verify from the new line')
          log(
            'Telgea',
            `Monitoring Telgea number ${TELGEA_VERIFY_NUMBER} for code ${VERIFY_CODE}`,
          )
          goto('SMS_FALLBACK')
        } else {
          goto('ACTIVE')
        }
      })
    },

    // SMS fallback: the code arriving at the Telgea number FROM the assigned MSISDN
    // proves the text came from the new line (not the user's old one) → confirmed.
    simulateSms: () => {
      const from = state.data.msisdn ?? 'the new line'
      log(
        'Network',
        `Code ${VERIFY_CODE} received at ${TELGEA_VERIFY_NUMBER} from ${from} → new line confirmed`,
      )
      goto('ACTIVE')
    },

    // From ACTIVE the user is already signed in, so skip re-auth (§7). MANAGE_HOME is M5.
    goManage: () => goto('MANAGE_HOME'),
  }
}
