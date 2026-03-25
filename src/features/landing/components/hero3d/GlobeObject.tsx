import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

type GlobeObjectProps = {
  opacity: number;
};

export function GlobeObject({ opacity }: GlobeObjectProps) {
  const meshRef = useRef<Mesh>(null);
  const linesRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y += delta * 0.15;
    }
  });

  const primaryColor = useMemo(() => {
    if (typeof window === "undefined") return "#4ade80";
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-primary")
        .trim() || "#4ade80"
    );
  }, []);

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial
          color={primaryColor}
          wireframe
          transparent
          opacity={opacity * 0.18}
        />
      </mesh>
      <mesh ref={linesRef}>
        <sphereGeometry args={[2.21, 16, 16]} />
        <meshBasicMaterial
          color={primaryColor}
          wireframe
          transparent
          opacity={opacity * 0.35}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.18, 64, 64]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={opacity * 0.04}
        />
      </mesh>
    </group>
  );
}
