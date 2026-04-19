export type CountdownState = {
  totalSeconds: number;
  remainingSeconds: number;
  hours: number;
  minutes: number;
  seconds: number;
  progress: number;
  isExpired: boolean;
};

export function calculateCountdown(
  expiresAt: string | null | undefined,
  totalDurationSeconds: number = 7200
): CountdownState {
  if (!expiresAt) {
    return {
      totalSeconds: totalDurationSeconds,
      remainingSeconds: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      progress: 0,
      isExpired: true,
    };
  }

  const now = Date.now();
  const end = new Date(expiresAt).getTime();
  const remainingMs = Math.max(0, end - now);
  const remainingSeconds = Math.floor(remainingMs / 1000);

  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;
  const progress = remainingSeconds / totalDurationSeconds;

  return {
    totalSeconds: totalDurationSeconds,
    remainingSeconds,
    hours,
    minutes,
    seconds,
    progress: Math.min(1, Math.max(0, progress)),
    isExpired: remainingSeconds === 0,
  };
}

export function formatCountdownLabel(state: CountdownState): string {
  if (state.isExpired) return "Expired";
  const h = String(state.hours).padStart(2, "0");
  const m = String(state.minutes).padStart(2, "0");
  const s = String(state.seconds).padStart(2, "0");
  if (state.hours > 0) return `${h}:${m}:${s}`;
  return `${m}:${s}`;
}
