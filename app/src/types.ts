// Shared types for the PoC. Kept small; M2 extends this with the state machine.

/** Who a console line is attributed to (Column C tags). */
export type Actor =
  | "Partner"
  | "Telgea"
  | "Payment"
  | "eSIM"
  | "Network"
  | "Notify";

/** A single "behind the scenes" console line. */
export interface LogEntry {
  id: number;
  actor: Actor;
  message: string;
  /** Milliseconds since the journey started, used to render `t+0.4s`. */
  tMs: number;
}

/** Demo scenarios selectable from the top bar. */
export type Scenario = "happy" | "membership-fail" | "install-not-confirmed";

export interface ScenarioOption {
  id: Scenario;
  label: string;
}

export const SCENARIOS: ScenarioOption[] = [
  { id: "happy", label: "Happy path" },
  { id: "membership-fail", label: "Membership check fails" },
  {
    id: "install-not-confirmed",
    label: "Install not confirmed (SMS fallback)",
  },
];

import fcbLogo from "./assets/fcb.webp";
import psgLogo from "./assets/psg.webp";

/** A white-label partner brand. The plan page re-skins entirely from this. */
export interface Brand {
  id: string;
  name: string;
  /** Short prefix for plan names, e.g. "Barça Mobile". */
  planPrefix: string;
  /** Telgea-hosted, partner-branded domain shown in the browser bar. */
  webHost: string;
  colors: {
    primary: string;
    primaryDark: string;
    accent: string;
    /** Text colour that reads well on `primary`. */
    onPrimary: string;
    /** Text colour that reads well on `accent`. */
    onAccent: string;
  };
  /** Crest image (preferred); falls back to `logoText` initials when absent. */
  logo?: string;
  logoText: string;
}

export const BRANDS: Brand[] = [
  {
    id: "fcb",
    name: "FC Barcelona",
    planPrefix: "Barça Mobile",
    webHost: "fcbarcelona.telgea.com",
    colors: {
      primary: "#0A0927",
      primaryDark: "#050418",
      accent: "#FDC52C",
      onPrimary: "#ffffff",
      onAccent: "#0A0927",
    },
    logo: fcbLogo,
    logoText: "FCB",
  },
  {
    id: "psg",
    name: "Paris Saint-Germain",
    planPrefix: "PSG Mobile",
    webHost: "psg.telgea.com",
    colors: {
      primary: "#04244B",
      primaryDark: "#001a38",
      accent: "#DA291C",
      onPrimary: "#ffffff",
      onAccent: "#ffffff",
    },
    logoText: "PSG",
    logo: psgLogo,
  },
];
