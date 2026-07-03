import type { Actor, LogEntry } from '../types'

/**
 * Every state in the buy + manage journeys.
 * M2 declares them all; M3 (buy) / M5 (manage) wire the transitions and screens.
 */
export type StateId =
  // Buy journey (§6)
  | 'IDLE'
  | 'EMAIL_ENTRY'
  | 'MEMBERSHIP_CHECK'
  | 'OTP_SENT'
  | 'COUNTRY_SELECT'
  | 'PLAN_SELECT'
  | 'PAYMENT'
  | 'PROVISIONING'
  | 'INSTALL_INSTRUCTIONS'
  | 'INSTALL_PENDING'
  | 'SMS_FALLBACK'
  | 'ACTIVE'
  | 'BLOCKED'
  // Manage journey (§7)
  | 'MANAGE_AUTH'
  | 'MANAGE_HOME'
  | 'CANCELLED'

/** Context accumulated as the user moves through the journey. Extended in M5. */
export interface JourneyData {
  /** Partner name captured at journey start, so on-entry logs can reference it. */
  partnerName?: string
  email?: string
  /** Whether the user has authenticated this session (buy flow signs in via OTP). */
  signedIn?: boolean
  country?: string
  countryCode?: string
  dialCode?: string
  /** Selected plan's display label, e.g. "Barça Mobile 10GB — €12/mo". */
  plan?: string
  msisdn?: string
  iccid?: string
  /** Why the plan was cancelled — drives the CANCELLED screen (grace note vs plain). */
  cancelReason?: 'user' | 'membership'
}

/** The single source of truth the reducer owns. Demo settings (brand/gating/scenario) live in App. */
export interface MachineState {
  stateId: StateId
  data: JourneyData
  logs: LogEntry[]
  /** Monotonic id for the next log line (kept in state so the reducer stays pure). */
  nextLogId: number
  /** Wall-clock (performance.now) of the first log after a reset; anchors relative timestamps. */
  startAt: number | null
}

export type Action =
  | { type: 'RESET' }
  | { type: 'LOG'; actor: Actor; message: string; at: number }
  | { type: 'GOTO'; to: StateId; at: number; patch?: Partial<JourneyData> }
