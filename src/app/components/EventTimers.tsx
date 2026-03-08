// src/app/components/EventTimers.tsx
// ============================================
// DIABLO IV — LIVE EVENT TIMERS (Season 12)
// World Boss · Helltide · Legion
//
// Data source: helltides.com/api/schedule (proxied via /api/events)
// Refreshes every 60 seconds. Countdown ticks every second via setInterval.
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { Skull, Flame, Users, RefreshCw, AlertTriangle } from 'lucide-react';

// ──────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────

interface WorldBossEvent {
  id: number;
  timestamp: number;
  boss: string;
  startTime: string;
  zone: { id: string; name: string; boss: string }[];
}

interface ScheduledEvent {
  id: number;
  timestamp: number;
  startTime: string;
}

interface ScheduleData {
  world_boss: WorldBossEvent[];
  legion: ScheduledEvent[];
  helltide: ScheduledEvent[];
}

interface EventState {
  label: string;         // e.g. "Ashava" or "Active"
  zone?: string;         // World boss zone name
  nextTime: Date | null; // Absolute time of next/current event
  isActive: boolean;     // Whether the event is currently live
  secondsUntil: number;  // Seconds until start (or seconds remaining if active)
}

// ──────────────────────────────────────────
// CONSTANTS
// ──────────────────────────────────────────

// Event durations in seconds
const HELLTIDE_DURATION_S  = 55 * 60;  // 55 minutes
const WORLD_BOSS_WINDOW_S  = 15 * 60;  // 15-minute kill window
const LEGION_WINDOW_S      = 15 * 60;  // ~15-minute event window

// How often to re-fetch schedule data (ms)
const FETCH_INTERVAL_MS = 60_000;

// World boss icon mapping
const BOSS_EMOJI: Record<string, string> = {
  'Ashava':          '🦂',
  'Avarice':         '💰',
  'Wandering Death': '💀',
  'Azmodan':         '👁️',
};

// ──────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────

function formatCountdown(totalSeconds: number): string {
  if (totalSeconds <= 0) return '00:00';
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Given a list of scheduled events sorted by startTime, find the event
 * that is either currently active or next up. Returns a derived EventState.
 */
function resolveTimedEvent(
  events: ScheduledEvent[],
  durationSeconds: number,
  now: number
): EventState {
  if (!events || events.length === 0) {
    return { label: '—', nextTime: null, isActive: false, secondsUntil: 0 };
  }

  for (const ev of events) {
    const start = new Date(ev.startTime).getTime();
    const end   = start + durationSeconds * 1000;

    if (now >= start && now < end) {
      // Currently active
      return {
        label: 'Active',
        nextTime: new Date(end),
        isActive: true,
        secondsUntil: Math.max(0, Math.round((end - now) / 1000)),
      };
    }

    if (start > now) {
      // Next upcoming
      return {
        label: 'Starting in',
        nextTime: new Date(start),
        isActive: false,
        secondsUntil: Math.max(0, Math.round((start - now) / 1000)),
      };
    }
  }

  // All events in the list are in the past — shouldn't happen with a live feed
  return { label: '—', nextTime: null, isActive: false, secondsUntil: 0 };
}

/**
 * Specialised resolver for World Boss — returns the boss name and zone.
 */
function resolveWorldBoss(
  events: WorldBossEvent[],
  now: number
): EventState & { bossName: string; zone: string } {
  const fallback = { label: '—', nextTime: null, isActive: false, secondsUntil: 0, bossName: '—', zone: '' };

  if (!events || events.length === 0) return fallback;

  for (const ev of events) {
    const start = new Date(ev.startTime).getTime();
    const end   = start + WORLD_BOSS_WINDOW_S * 1000;

    if (now >= start && now < end) {
      return {
        label: 'Active',
        nextTime: new Date(end),
        isActive: true,
        secondsUntil: Math.max(0, Math.round((end - now) / 1000)),
        bossName: ev.boss,
        zone: ev.zone.map((z) => z.name).join(' / '),
      };
    }

    if (start > now) {
      return {
        label: 'Next up',
        nextTime: new Date(start),
        isActive: false,
        secondsUntil: Math.max(0, Math.round((start - now) / 1000)),
        bossName: ev.boss,
        zone: ev.zone.map((z) => z.name).join(' / '),
      };
    }
  }

  return fallback;
}

// ──────────────────────────────────────────
// TIMER CARD COMPONENT
// ──────────────────────────────────────────

interface TimerCardProps {
  icon: React.ReactNode;
  title: string;
  accentClass: string;        // Tailwind gradient classes for the icon bg
  borderClass: string;        // Tailwind border color class
  isActive: boolean;
  label: string;
  countdown: string;
  subtitle?: string;
  activePulseClass: string;   // Pulse ring color when active
}

function TimerCard({
  icon, title, accentClass, borderClass,
  isActive, label, countdown, subtitle, activePulseClass,
}: TimerCardProps) {
  return (
    <div className={`relative bg-slate-800/60 backdrop-blur-sm border ${borderClass} rounded-xl p-4 flex items-center gap-4 transition-all hover:bg-slate-800/80 overflow-hidden`}>
      {/* Active pulse glow */}
      {isActive && (
        <span className={`absolute inset-0 rounded-xl animate-pulse opacity-10 ${activePulseClass}`} />
      )}

      {/* Icon */}
      <div className={`w-10 h-10 ${accentClass} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}>
        {icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        {subtitle && (
          <p className="text-sm font-medium text-white truncate">{subtitle}</p>
        )}
        <p className="text-xs text-slate-500 truncate">{label}</p>
      </div>

      {/* Countdown */}
      <div className="text-right flex-shrink-0">
        <p className={`text-xl font-mono font-bold tabular-nums ${isActive ? 'text-green-400' : 'text-white'}`}>
          {countdown}
        </p>
        {isActive && (
          <span className="inline-flex items-center gap-1 text-xs text-green-400 font-semibold">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            LIVE
          </span>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────

export function EventTimers() {
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [now, setNow] = useState(() => Date.now());

  // Fetch schedule data from our proxy
  const fetchSchedule = useCallback(async () => {
    try {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error('Schedule unavailable');
      const data: ScheduleData = await res.json();
      setSchedule(data);
      setFetchError(null);
    } catch {
      setFetchError('Could not load event timers');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch + refresh every 60s
  useEffect(() => {
    fetchSchedule();
    const fetchTimer = setInterval(fetchSchedule, FETCH_INTERVAL_MS);
    return () => clearInterval(fetchTimer);
  }, [fetchSchedule]);

  // Tick every second to keep countdowns live
  useEffect(() => {
    const ticker = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(ticker);
  }, []);

  // ── Derived event states ─────────────────
  const worldBoss = schedule
    ? resolveWorldBoss(schedule.world_boss ?? [], now)
    : null;

  const helltide = schedule
    ? resolveTimedEvent(schedule.helltide ?? [], HELLTIDE_DURATION_S, now)
    : null;

  const legion = schedule
    ? resolveTimedEvent(schedule.legion ?? [], LEGION_WINDOW_S, now)
    : null;

  // ── Loading skeleton ─────────────────────
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {['World Boss', 'Helltide', 'Legion'].map((name) => (
          <div key={name} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex items-center gap-4 animate-pulse">
            <div className="w-10 h-10 bg-slate-700 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-slate-700 rounded w-16" />
              <div className="h-4 bg-slate-700 rounded w-24" />
            </div>
            <div className="h-7 bg-slate-700 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  // ── Error state ──────────────────────────
  if (fetchError || !schedule) {
    return (
      <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-slate-700/40 rounded-xl p-3 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-slate-600" />
          <span>Event timers unavailable</span>
        </div>
        <button
          onClick={() => { setIsLoading(true); fetchSchedule(); }}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
      </div>
    );
  }

  const bossEmoji = worldBoss ? (BOSS_EMOJI[worldBoss.bossName] ?? '👹') : '👹';

  return (
    <div className="space-y-2">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Events</p>
        <button
          onClick={() => { setIsLoading(true); fetchSchedule(); }}
          className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-400 transition-colors"
          title="Refresh event timers"
        >
          <RefreshCw className="w-3 h-3" />
          Refresh
        </button>
      </div>

      {/* Timer grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

        {/* World Boss */}
        <TimerCard
          icon={<Skull className="w-5 h-5 text-white" />}
          title="World Boss"
          accentClass="bg-gradient-to-br from-purple-600 to-rose-700"
          borderClass={worldBoss?.isActive ? 'border-purple-500/60' : 'border-slate-700/50'}
          activePulseClass="bg-purple-600"
          isActive={worldBoss?.isActive ?? false}
          label={worldBoss?.isActive ? `Ends in` : (worldBoss?.zone ? `📍 ${worldBoss.zone}` : 'Spawns in')}
          countdown={worldBoss ? formatCountdown(worldBoss.secondsUntil) : '--:--'}
          subtitle={worldBoss?.bossName ? `${bossEmoji} ${worldBoss.bossName}` : undefined}
        />

        {/* Helltide */}
        <TimerCard
          icon={<Flame className="w-5 h-5 text-white" />}
          title="Helltide"
          accentClass="bg-gradient-to-br from-orange-600 to-red-700"
          borderClass={helltide?.isActive ? 'border-orange-500/60' : 'border-slate-700/50'}
          activePulseClass="bg-orange-600"
          isActive={helltide?.isActive ?? false}
          label={helltide?.isActive ? 'Ends in' : 'Starts in'}
          countdown={helltide ? formatCountdown(helltide.secondsUntil) : '--:--'}
          subtitle={helltide?.isActive ? '55-min window active' : '55 min duration'}
        />

        {/* Legion */}
        <TimerCard
          icon={<Users className="w-5 h-5 text-white" />}
          title="Legion"
          accentClass="bg-gradient-to-br from-blue-600 to-cyan-700"
          borderClass={legion?.isActive ? 'border-blue-500/60' : 'border-slate-700/50'}
          activePulseClass="bg-blue-600"
          isActive={legion?.isActive ?? false}
          label={legion?.isActive ? 'Ends in' : 'Starts in'}
          countdown={legion ? formatCountdown(legion.secondsUntil) : '--:--'}
          subtitle={legion?.isActive ? 'Event in progress' : 'Every ~25 minutes'}
        />

      </div>

      {/* Attribution */}
      <p className="text-right text-xs text-slate-700">
        Powered by{' '}
        <a
          href="https://helltides.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-600 hover:text-slate-400 transition-colors underline underline-offset-2"
        >
          helltides.com
        </a>
      </p>
    </div>
  );
}
