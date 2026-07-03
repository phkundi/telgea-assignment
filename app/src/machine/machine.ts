import type { Actor } from '../types'
import type { Action, MachineState } from './types'
import { entryLogsFor } from './entryLogs'

export const initialState: MachineState = {
  stateId: 'IDLE',
  data: {},
  logs: [],
  nextLogId: 0,
  startAt: null,
}

/**
 * Append one log line, stamping a monotonic id and a timestamp relative to the
 * first log after reset. Pure: the caller supplies `at` (performance.now()), so
 * the reducer is safe under React StrictMode's double-invocation.
 */
function appendLog(
  state: MachineState,
  actor: Actor,
  message: string,
  at: number,
): MachineState {
  const startAt = state.startAt ?? at
  return {
    ...state,
    startAt,
    logs: [
      ...state.logs,
      { id: state.nextLogId, actor, message, tMs: at - startAt },
    ],
    nextLogId: state.nextLogId + 1,
  }
}

export function reducer(state: MachineState, action: Action): MachineState {
  switch (action.type) {
    case 'RESET':
      return initialState

    case 'LOG':
      return appendLog(state, action.actor, action.message, action.at)

    case 'GOTO': {
      const data = action.patch
        ? { ...state.data, ...action.patch }
        : state.data
      // Enter the state, then append its on-entry log lines atomically.
      let next: MachineState = { ...state, stateId: action.to, data }
      for (const line of entryLogsFor(action.to, data)) {
        next = appendLog(next, line.actor, line.message, action.at)
      }
      return next
    }

    default:
      return state
  }
}
