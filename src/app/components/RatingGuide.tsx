import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Skull, Flame, Users, AlertCircle } from 'lucide-react';

// ─── Constants ───────────────────────────────────────────────────────────────
const FETCH_INTERVAL_MS = 60_000;
const TICK_INTERVAL_MS = 1_000;
const HELLTIDE_DURATION_S = 55 * 60;
const WORLD_BOSS_WINDOW_S = 15 * 60;
const LEGION_WINDOW_S = 15 * 60;

const BOSS_NAMES: Record<string, string> = {
  ashava: 'Ashava the Pestilent',
  avarice: 'Avarice, the Gold Cursed',
  wandering_death: 'Wandering Death',
  echo_of_varshan: 'Echo of Varshan',
  grigoire: 'Grigoire the Galvanic Saint',
  lord_zir: 'Lord Zir',
  the_beast: 'The Beast in Ice',
  duriel: 'Duriel, King of Maggots',
  andariel: 'Andariel, Maiden of Anguish',
  azmodan: 'Azmodan',
  // fallback: use raw string
};

interface EventData {
  worldBoss: {
    name: string;
    zone: string;
    nextTime: number; // unix seconds
    territory?: string;
  } | null;
  helltide: {
    nextTime: number;
    zone: string;
    territory?: string;
  } | null;
  legion: {
    nextTime: number;
    zone: string;
    territory?: string;
    eventName?: string;
  } | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatCountdown(seconds: number): string {
  if (seconds <= 0) return 'Now';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

function resolveBossName(raw: string): string {
  const key = raw.toLowerCase().replace(/[^a-z_]/g, '_').replace(/_+/g, '_');
  return BOSS_NAMES[key] ?? raw;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function EventTimers() {
  const [events, setEvents] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [lastRefresh, setLastRefresh] = useState(0);

  const fetchEvents = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.json();

      // helltides.com returns arrays sorted ascending by timestamp.
      // We pick the first upcoming (or currently active) entry from each array.
      const now = nowSeconds();

      // ── World Boss ──────────────────────────────────────────────────────────
      // Each entry: { boss, timestamp, zone: [{id, name}] }
      const wbArray: Array<{ boss: string; timestamp: number; zone: Array<{ name: string }> }> =
        raw.world_boss ?? raw.worldBoss ?? [];
      // Find the most recent entry that hasn't fully expired (window = 15 min)
      const wbEntry = wbArray.find((e) => e.timestamp + WORLD_BOSS_WINDOW_S >= now) ?? wbArray[0] ?? null;

      // ── Helltide ────────────────────────────────────────────────────────────
      // Each entry: { timestamp }  (no zone data in this feed)
      const htArray: Array<{ timestamp: number }> = raw.helltide ?? [];
      const htEntry = htArray.find((e) => e.timestamp + HELLTIDE_DURATION_S >= now) ?? htArray[0] ?? null;

      // ── Legion ──────────────────────────────────────────────────────────────
      // Each entry: { timestamp }
      const lgArray: Array<{ timestamp: number }> = raw.legion ?? [];
      const lgEntry = lgArray.find((e) => e.timestamp + LEGION_WINDOW_S >= now) ?? lgArray[0] ?? null;

      setEvents({
        worldBoss: wbEntry
          ? {
              name: wbEntry.boss,
              zone: wbEntry.zone?.[0]?.name ?? '',
              territory: wbEntry.zone?.slice(1).map((z) => z.name).join(', ') ?? undefined,
              nextTime: wbEntry.timestamp,
            }
          : null,
        helltide: htEntry
          ? { nextTime: htEntry.timestamp, zone: '' }
          : null,
        legion: lgEntry
          ? { nextTime: lgEntry.timestamp, zone: '' }
          : null,
      });
      setLastRefresh(nowSeconds());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch + periodic refetch
  useEffect(() => {
    fetchEvents();
    const id = setInterval(fetchEvents, FETCH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchEvents]);

  // 1-second ticker
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), TICK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  // ── Derived state (recalculated every tick) ────────────────────────────────
  const now = nowSeconds();

  function getStatus(startTime: number, durationS: number) {
    const elapsed = now - startTime;
    if (elapsed >= 0 && elapsed < durationS) {
      return { live: true, seconds: durationS - elapsed };
    }
    const until = startTime - now;
    return { live: false, seconds: Math.max(0, until) };
  }

  const wbStatus = events?.worldBoss
    ? getStatus(events.worldBoss.nextTime, WORLD_BOSS_WINDOW_S)
    : null;
  const htStatus = events?.helltide
    ? getStatus(events.helltide.nextTime, HELLTIDE_DURATION_S)
    : null;
  const lgStatus = events?.legion
    ? getStatus(events.legion.nextTime, LEGION_WINDOW_S)
    : null;

  // ── Render helpers ─────────────────────────────────────────────────────────
  function LiveBadge() {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/40 rounded-full text-xs font-bold">
        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
        LIVE
      </span>
    );
  }

  function CountdownBadge({ seconds, live }: { seconds: number; live: boolean }) {
    return (
      <span
        className={`text-xl font-mono font-bold tabular-nums ${
          live ? 'text-green-400' : 'text-white'
        }`}
      >
        {formatCountdown(seconds)}
      </span>
    );
  }

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 space-y-3 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-slate-700 rounded" />
          <div className="h-4 w-16 bg-slate-700 rounded" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-slate-700/50 rounded-lg" />
        ))}
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error || !events) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Live Events</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 text-sm">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>Event data unavailable</span>
          <button
            onClick={fetchEvents}
            className="ml-auto flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 space-y-3">

      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Live Events</span>
        <button
          onClick={fetchEvents}
          title={`Last updated ${Math.round((now - lastRefresh) / 60)}m ago`}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Refresh
        </button>
      </div>

      {/* ── World Boss ── */}
      {events.worldBoss && wbStatus && (
        <div
          className={`relative overflow-hidden rounded-lg border transition-all ${
            wbStatus.live
              ? 'bg-gradient-to-r from-purple-900/60 to-slate-800/60 border-purple-500/40 shadow-sm shadow-purple-500/20'
              : 'bg-slate-900/50 border-slate-700/50'
          }`}
        >
          <div className="flex items-start gap-3 p-3">
            {/* Icon */}
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                wbStatus.live
                  ? 'bg-gradient-to-br from-purple-600 to-pink-700'
                  : 'bg-slate-700'
              }`}
            >
              <Skull className="w-5 h-5 text-white" />
            </div>

            {/* Info block */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">World Boss</span>
                {wbStatus.live && <LiveBadge />}
              </div>
              <p className="text-white font-semibold text-sm leading-tight mt-0.5 truncate">
                {resolveBossName(events.worldBoss.name)}
              </p>
              {events.worldBoss.zone && (
                <p className="text-slate-400 text-xs mt-0.5 truncate">
                  📍 {events.worldBoss.zone}
                  {events.worldBoss.territory && ` · ${events.worldBoss.territory}`}
                </p>
              )}
              <p className="text-slate-500 text-xs mt-1">
                {wbStatus.live ? 'Ends in' : 'Spawns in'}
              </p>
            </div>

            {/* Countdown */}
            <div className="flex-shrink-0 text-right">
              <CountdownBadge seconds={wbStatus.seconds} live={wbStatus.live} />
            </div>
          </div>
        </div>
      )}

      {/* ── Helltide ── */}
      {events.helltide && htStatus && (
        <div
          className={`relative overflow-hidden rounded-lg border transition-all ${
            htStatus.live
              ? 'bg-gradient-to-r from-orange-900/60 to-slate-800/60 border-orange-500/40 shadow-sm shadow-orange-500/20'
              : 'bg-slate-900/50 border-slate-700/50'
          }`}
        >
          <div className="flex items-start gap-3 p-3">
            {/* Icon */}
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                htStatus.live
                  ? 'bg-gradient-to-br from-orange-600 to-red-700'
                  : 'bg-slate-700'
              }`}
            >
              <Flame className="w-5 h-5 text-white" />
            </div>

            {/* Info block */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Helltide</span>
                {htStatus.live && <LiveBadge />}
              </div>
              <p className="text-white font-semibold text-sm leading-tight mt-0.5">
                55-minute event
              </p>
              {events.helltide.zone && (
                <p className="text-slate-400 text-xs mt-0.5 truncate">
                  📍 {events.helltide.zone}
                  {events.helltide.territory && ` · ${events.helltide.territory}`}
                </p>
              )}
              <p className="text-slate-500 text-xs mt-1">
                {htStatus.live ? 'Ends in' : 'Starts in'}
              </p>
            </div>

            {/* Countdown */}
            <div className="flex-shrink-0 text-right">
              <CountdownBadge seconds={htStatus.seconds} live={htStatus.live} />
            </div>
          </div>
        </div>
      )}

      {/* ── Legion ── */}
      {events.legion && lgStatus && (
        <div
          className={`relative overflow-hidden rounded-lg border transition-all ${
            lgStatus.live
              ? 'bg-gradient-to-r from-blue-900/60 to-slate-800/60 border-blue-500/40 shadow-sm shadow-blue-500/20'
              : 'bg-slate-900/50 border-slate-700/50'
          }`}
        >
          <div className="flex items-start gap-3 p-3">
            {/* Icon */}
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                lgStatus.live
                  ? 'bg-gradient-to-br from-blue-600 to-cyan-700'
                  : 'bg-slate-700'
              }`}
            >
              <Users className="w-5 h-5 text-white" />
            </div>

            {/* Info block */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Legion</span>
                {lgStatus.live && <LiveBadge />}
              </div>
              <p className="text-white font-semibold text-sm leading-tight mt-0.5 truncate">
                {events.legion.eventName ?? 'Event Incoming'}
              </p>
              {events.legion.zone && (
                <p className="text-slate-400 text-xs mt-0.5 truncate">
                  📍 {events.legion.zone}
                  {events.legion.territory && ` · ${events.legion.territory}`}
                </p>
              )}
              <p className="text-slate-500 text-xs mt-1">
                {lgStatus.live ? 'Ends in' : 'Starts in'}
              </p>
            </div>

            {/* Countdown */}
            <div className="flex-shrink-0 text-right">
              <CountdownBadge seconds={lgStatus.seconds} live={lgStatus.live} />
            </div>
          </div>
        </div>
      )}

      {/* Attribution */}
      <p className="text-right text-xs text-slate-600">
        Powered by{' '}
        <a
          href="https://helltides.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-2"
        >
          helltides.com
        </a>
      </p>
    </div>
  );
}
