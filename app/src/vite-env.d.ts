/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Password gating the whole app. When empty, the gate is disabled. */
  readonly VITE_APP_PASSWORD?: string
}
