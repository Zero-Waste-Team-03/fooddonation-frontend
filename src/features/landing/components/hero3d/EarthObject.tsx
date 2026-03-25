import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

type EarthObjectProps = {
  opacity: number;
};

export function EarthObject({ opacity }: EarthObjectProps) {
  const coreRef = useRef<Mesh>(null);
  const atmosphereRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.1;
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
      <mesh ref={coreRef}>
        <sphereGeometry args={[2.0, 64, 64]} />
        <meshStandardMaterial
          color={primaryColor}
          roughness={0.85}
          metalness={0.1}
          transparent
          opacity={opacity * 0.7}
        />
      </mesh>
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.28, 32, 32]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={opacity * 0.06}
          side={2}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.35, 32, 32]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={opacity * 0.03}
          side={2}
        />
      </mesh>
      <pointLight
        color={primaryColor}
        intensity={opacity * 1.5}
        distance={8}
        position={[0, 0, 3]}
      />
    </group>
  );
}
