import { useEffect, useRef, useState } from "react";

type UseCountUpOptions = {
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
};

export function useCountUp(
  inView: boolean,
  options: UseCountUpOptions
) {
  const { end, duration = 2000, decimals = 0, prefix = "", suffix = "" } = options;
  const [display, setDisplay] = useState(`${prefix}0${suffix}`);
  const frame = useRef<number>(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * end;
      setDisplay(
        `${prefix}${current.toFixed(decimals)}${suffix}`
      );
      if (progress < 1) {
        frame.current = requestAnimationFrame(step);
      }
    };
    frame.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame.current);
  }, [inView, end, duration, decimals, prefix, suffix]);

  return display;
}
