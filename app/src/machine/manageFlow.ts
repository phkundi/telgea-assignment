import type { Brand } from '../types'
import { DEMO_OTP } from '../data'
import type { Journey } from './useJourney'

/** Handlers the manage-journey screens call. */
export interface ManageActions {
  /** Column A "Manage my plan": skip re-auth if already signed in this session (§7). */
  openManage: () => void
  sendCode: () => void
  reauth: (code: string) => boolean
  topUp: () => void
  changePlan: (label: string) => void
  cancel: () => void
  membershipEnded: () => void
}

/**
 * Manage-journey handlers over the state-machine primitives (§7).
 * Top-up and change-plan patch state but stay in MANAGE_HOME (goto same state with
 * no on-entry logs); cancel and membership-loss transition to CANCELLED.
 */
export function createManageActions(
  journey: Journey,
  _brand: Brand,
): ManageActions {
  const { state, goto, log } = journey

  return {
    openManage: () => goto(state.data.signedIn ? 'MANAGE_HOME' : 'MANAGE_AUTH'),

    sendCode: () => log('Notify', 'One-time code sent (demo code: 123456)'),

    reauth: (code) => {
      if (code.trim() !== DEMO_OTP) return false
      log('Telgea', 'Returning user re-authenticated')
      goto('MANAGE_HOME', { signedIn: true })
      return true
    },

    topUp: () => log('Payment', 'Top-up purchased'),

    changePlan: (label) => {
      log('Telgea', `Plan changed: ${label}`)
      goto('MANAGE_HOME', { plan: label })
    },

    cancel: () => {
      log('Telgea', 'Plan cancelled')
      goto('CANCELLED', { cancelReason: 'user' })
    },

    // Lifecycle edge: partner reports the membership lapsed → Telgea starts a 7-day grace (§7).
    membershipEnded: () => {
      log('Partner', 'Membership ended for this user')
      log('Telgea', '7-day grace period started — plan stays active for 7 days')
      goto('CANCELLED', { cancelReason: 'membership' })
    },
  }
}
