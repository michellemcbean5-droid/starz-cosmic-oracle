/**
 * Ephemeris Engine Client
 * ========================
 * Talks to the Starz Cosmic Oracle backend (server/), which runs the real
 * Swiss Ephemeris for astronomically exact planet/house/aspect positions,
 * plus Sabian symbols, Arabic Lots, and plain-English "slang" predictions.
 *
 * Configure the backend URL via EXPO_PUBLIC_EPHEMERIS_API_URL in .env
 * (defaults to a local dev server). All calls fail soft — screens should
 * treat `null` as "fall back to the offline estimate" per the project's
 * AI-fallback convention (see AGENTS.md).
 */

import {
  PreciseChartResponse,
  WorldForecast,
  AIReadingResponse,
} from '../types';

const API_BASE =
  process.env.EXPO_PUBLIC_EPHEMERIS_API_URL || 'http://localhost:8420';

const TIMEOUT_MS = 12000;

async function withTimeout<T>(promise: Promise<T>): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Ephemeris engine request timed out')), TIMEOUT_MS)
    ),
  ]);
}

export type BirthInput = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  city?: string;
  latitude?: number;
  longitude?: number;
  tzOffset?: number;
  name?: string;
};

function toPayload(input: BirthInput) {
  return {
    year: input.year,
    month: input.month,
    day: input.day,
    hour: input.hour,
    minute: input.minute,
    city: input.city,
    latitude: input.latitude,
    longitude: input.longitude,
    tz_offset: input.tzOffset,
    name: input.name,
  };
}

/** Fetch a precise natal chart. Returns null if the engine is unreachable. */
export async function fetchPreciseChart(input: BirthInput): Promise<PreciseChartResponse | null> {
  try {
    const res = await withTimeout(
      fetch(`${API_BASE}/api/chart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toPayload(input)),
      })
    );
    if (!res.ok) return null;
    return (await res.json()) as PreciseChartResponse;
  } catch {
    return null;
  }
}

/** Ask the AI (Claude, via the backend) for a fully personalized slang report. */
export async function fetchAIReading(
  input: BirthInput,
  question?: string,
  voice = 'easy street slang'
): Promise<AIReadingResponse | null> {
  try {
    const res = await withTimeout(
      fetch(`${API_BASE}/api/reading/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...toPayload(input), question, voice }),
      })
    );
    if (!res.ok) return null;
    return (await res.json()) as AIReadingResponse;
  } catch {
    return null;
  }
}

/** World / mundane astrology forecast — not tied to any one person. */
export async function fetchWorldForecast(year?: number): Promise<WorldForecast | null> {
  try {
    const qs = year ? `?year=${year}` : '';
    const res = await withTimeout(fetch(`${API_BASE}/api/world${qs}`));
    if (!res.ok) return null;
    return (await res.json()) as WorldForecast;
  } catch {
    return null;
  }
}

/** List of birth cities the engine knows coordinates + UTC offset for. */
export async function fetchEngineCities(): Promise<string[] | null> {
  try {
    const res = await withTimeout(fetch(`${API_BASE}/api/cities`));
    if (!res.ok) return null;
    const data = await res.json();
    return data.cities as string[];
  } catch {
    return null;
  }
}

/** Quick reachability check, e.g. to show an "offline mode" banner. */
export async function isEngineOnline(): Promise<boolean> {
  try {
    const res = await withTimeout(fetch(`${API_BASE}/api/health`));
    return res.ok;
  } catch {
    return false;
  }
}
