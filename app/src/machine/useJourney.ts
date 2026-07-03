import { useCallback, useEffect, useReducer, useRef } from 'react'
import type { Actor } from '../types'
import type { JourneyData, StateId } from './types'
import { initialState, reducer } from './machine'

/** One step of a staggered sequence: `delay` ms after the previous step, run `fn`. */
export interface SequenceStep {
  delay: number
  fn: () => void
}

/**
 * Central state-machine hook. Wraps the pure reducer, stamps timestamps at
 * dispatch time, and owns a timer registry for async steps that is cleared on
 * reset / unmount so the demo stays deterministic and leak-free.
 *
 * Transitions are driven from event handlers (not effects), so nothing double-fires
 * under React StrictMode.
 */
export function useJourney() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }, [])

  // Clear any pending timers if the app unmounts.
  useEffect(() => clearTimers, [clearTimers])

  /** Run `fn` after `delay` ms; auto-cancelled by reset/unmount. */
  const schedule = useCallback((delay: number, fn: () => void) => {
    const id = setTimeout(() => {
      timers.current = timers.current.filter((t) => t !== id)
      fn()
    }, delay)
    timers.current.push(id)
    return id
  }, [])

  /** Fire a list of steps, each `step.delay` ms after the previous one. */
  const runSequence = useCallback(
    (steps: SequenceStep[]) => {
      let acc = 0
      for (const step of steps) {
        acc += step.delay
        schedule(acc, step.fn)
      }
    },
    [schedule],
  )

  const log = useCallback((actor: Actor, message: string) => {
    dispatch({ type: 'LOG', actor, message, at: performance.now() })
  }, [])

  const goto = useCallback((to: StateId, patch?: Partial<JourneyData>) => {
    dispatch({ type: 'GOTO', to, at: performance.now(), patch })
  }, [])

  const reset = useCallback(() => {
    clearTimers()
    dispatch({ type: 'RESET' })
  }, [clearTimers])

  return { state, goto, log, schedule, runSequence, reset }
}

export type Journey = ReturnType<typeof useJourney>
