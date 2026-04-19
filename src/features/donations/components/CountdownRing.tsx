import { useEffect, useRef, useState } from "react";
import {
  calculateCountdown,
  formatCountdownLabel,
  type CountdownState,
} from "../utils/countdown";

type CountdownRingProps = {
  expiresAt: string | null | undefined;
  totalDurationSeconds?: number;
  size?: number;
  strokeWidth?: number;
  onExpire?: () => void;
};

export function CountdownRing({
  expiresAt,
  totalDurationSeconds = 7200,
  size = 160,
  strokeWidth = 10,
  onExpire,
}: CountdownRingProps) {
  const [state, setState] = useState<CountdownState>(() =>
    calculateCountdown(expiresAt, totalDurationSeconds)
  );
  const [prefersReduced, setPrefersReduced] = useState(false);
  const frameRef = useRef<number | null>(null);
  const firedExpire = useRef(false);
  const lastSecondRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    setPrefersReduced(media.matches);
    media.addEventListener("change", onChange);

    return () => {
      media.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    firedExpire.current = false;
    lastSecondRef.current = null;

    const updateState = () => {
      const next = calculateCountdown(expiresAt, totalDurationSeconds);
      setState(next);

      if (next.isExpired && !firedExpire.current) {
        firedExpire.current = true;
        onExpire?.();
      }
    };

    const tick = () => {
      const nowSecond = Math.floor(Date.now() / 1000);

      if (lastSecondRef.current !== nowSecond) {
        lastSecondRef.current = nowSecond;
        updateState();
      }

      frameRef.current = window.requestAnimationFrame(tick);
    };

    updateState();
    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [expiresAt, totalDurationSeconds, onExpire]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - state.progress);

  const ringColor = (() => {
    if (state.isExpired) return "var(--color-destructive)";
    if (state.progress > 0.5) return "var(--color-primary)";
    if (state.progress > 0.25) return "var(--color-warning)";
    return "var(--color-destructive)";
  })();

  const label = formatCountdownLabel(state);
  const sublabel = state.isExpired
    ? "Reservation window closed"
    : "remaining to collect";

  if (prefersReduced) {
    return (
      <div className="flex flex-col items-center gap-1 py-4">
        <span
          className="text-3xl font-bold tabular-nums"
          style={{ color: ringColor }}
          aria-live="polite"
          aria-label={`${label} ${sublabel}`}
        >
          {label}
        </span>
        <span className="text-sm text-muted-foreground">{sublabel}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={strokeWidth}
          />
          <circle
            className="countdown-ring-stroke"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-0.5"
          aria-live="polite"
          aria-label={`${label} ${sublabel}`}
        >
          <span
            className="text-2xl font-bold tabular-nums leading-none"
            style={{ color: ringColor }}
          >
            {label}
          </span>
          <span className="text-xs text-muted-foreground text-center px-2">{sublabel}</span>
        </div>
      </div>
    </div>
  );
}
