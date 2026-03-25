import { useState, useEffect, useRef } from "react";

type CycleOptions = {
  count: number;
  visibleDuration: number;
  fadeDuration: number;
  disabled?: boolean;
};

type CycleState = {
  activeIndex: number;
  opacity: number;
};

export function use3DCycle({
  count,
  visibleDuration,
  fadeDuration,
  disabled = false,
}: CycleOptions): CycleState {
  const [activeIndex, setActiveIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);

  // Use a single ref object to keep track of animation state
  // to avoid closure staleness and ensure synchronous updates within the tick
  const stateRef = useRef({
    phase: "visible" as "visible" | "fadeOut" | "fadeIn",
    startTime: -1, // -1 indicates not started
    currentIndex: 0,
    rafId: 0,
  });

  useEffect(() => {
    if (disabled) {
      setActiveIndex(0);
      setOpacity(1);
      // Cancel any running animation if we switch to disabled
      if (stateRef.current.rafId) {
        cancelAnimationFrame(stateRef.current.rafId);
        stateRef.current.rafId = 0;
      }
      return;
    }

    // Reset state for new cycle
    stateRef.current.phase = "visible";
    stateRef.current.startTime = -1;
    stateRef.current.currentIndex = 0;
    setActiveIndex(0);
    setOpacity(1);

    const tick = (now: number) => {
      const state = stateRef.current;

      // Initialize startTime on the very first frame of this cycle
      // using the timestamp passed by requestAnimationFrame
      if (state.startTime === -1) {
        state.startTime = now;
      }

      const elapsed = now - state.startTime;

      if (state.phase === "visible") {
        // Ensure opacity is 1 during visible phase
        setOpacity(1);

        if (elapsed >= visibleDuration) {
          state.phase = "fadeOut";
          state.startTime = now;
        }
      } else if (state.phase === "fadeOut") {
        const progress = Math.min(elapsed / fadeDuration, 1);
        setOpacity(1 - progress);

        if (progress >= 1) {
          state.phase = "fadeIn";
          state.startTime = now;
          // Advance index
          state.currentIndex = (state.currentIndex + 1) % count;
          setActiveIndex(state.currentIndex);
        }
      } else if (state.phase === "fadeIn") {
        const progress = Math.min(elapsed / fadeDuration, 1);
        setOpacity(progress);

        if (progress >= 1) {
          state.phase = "visible";
          state.startTime = now;
        }
      }

      state.rafId = requestAnimationFrame(tick);
    };

    stateRef.current.rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(stateRef.current.rafId);
    };
  }, [count, visibleDuration, fadeDuration, disabled]);

  return { activeIndex, opacity };
}
