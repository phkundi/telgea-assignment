import type { Actor } from '../types'
import type { JourneyData, StateId } from './types'

/** A log line without id/timestamp — the reducer stamps those on entry. */
export interface LogLine {
  actor: Actor
  message: string
}

/**
 * Synchronous log lines emitted when a state is entered (§6 "Logs emitted" column).
 *
 * The engine deliberately supports two kinds of logs:
 *   - on-entry lines (here) — appended atomically by the GOTO reducer; used for
 *     system consequences that happen the moment a screen appears.
 *   - async / staggered / user-action lines — emitted by the buy-flow handlers via
 *     the timer helper / log() (see machine/buyFlow.ts), so they can be paced and
 *     can depend on user input (e.g. "Email submitted", "Country selected: …").
 */
export function entryLogsFor(state: StateId, data: JourneyData): LogLine[] {
  const partner = data.partnerName ?? 'the partner'
  switch (state) {
    case 'EMAIL_ENTRY':
      return [
        {
          actor: 'Partner',
          message:
            'Partner CTA clicked → opening branded plan page (powered by Telgea)',
        },
      ]
    case 'MEMBERSHIP_CHECK':
      return [
        { actor: 'Partner', message: `Checking membership with ${partner}` },
      ]
    case 'OTP_SENT':
      return [
        { actor: 'Notify', message: 'One-time code sent (demo code: 123456)' },
      ]
    case 'PROVISIONING':
      return [{ actor: 'Telgea', message: 'Provisioning started' }]
    case 'INSTALL_INSTRUCTIONS':
      return [
        {
          actor: 'Telgea',
          message: 'eSIM activation offered (one-tap install on device, or QR)',
        },
      ]
    case 'INSTALL_PENDING':
      return [
        {
          actor: 'Network',
          message:
            'Waiting for install confirmation (in production this can take ~15 min)',
        },
      ]
    case 'ACTIVE':
      return [
        { actor: 'Network', message: 'Line active — install confirmed' },
        { actor: 'Notify', message: `Notified ${partner}: plan activated` },
        { actor: 'Telgea', message: 'Journey complete' },
      ]
    case 'MANAGE_AUTH':
      return [
        {
          actor: 'Partner',
          message: 'Manage link clicked → opening branded plan page',
        },
      ]
    // MEMBERSHIP_CHECK / BLOCKED / SMS_FALLBACK → M4; MANAGE_HOME / CANCELLED → M5.
    default:
      return []
  }
}
