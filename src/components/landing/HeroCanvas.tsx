import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  phase: number;
};

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Helper to check if color is hex
    const isHex = (str: string) => /^#[0-9A-F]{6}$/i.test(str);

    let primaryHex = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-primary")
      .trim();

    // Fallback if not a valid hex for the opacity hack
    if (!isHex(primaryHex)) {
      primaryHex = "#2d6a4f";
    }

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
      init();
    };

    const init = () => {
      const count = Math.floor((width * height) / 8000);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.2 + 1,
        opacity: Math.random() * 0.25 + 0.1,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx + Math.sin(t * 0.0004 + p.phase) * 0.3;
        p.y += p.vy + Math.cos(t * 0.0003 + p.phase) * 0.2;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `${primaryHex}${Math.floor((1 - dist / 120) * 18)
              .toString(16)
              .padStart(2, "0")}`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${primaryHex}${Math.floor(p.opacity * 255)
          .toString(16)
          .padStart(2, "0")}`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    if (!prefersReduced.matches) {
      raf = requestAnimationFrame(draw);
    } else {
      draw(0);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  );
}
