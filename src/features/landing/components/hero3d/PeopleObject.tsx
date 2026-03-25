import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

type PeopleObjectProps = {
  opacity: number;
};

function ConnectionLine({
  from,
  to,
  opacity,
  color,
}: {
  from: [number, number, number];
  to: [number, number, number];
  opacity: number;
  color: string;
}) {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const dz = to[2] - from[2];
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const midX = (from[0] + to[0]) / 2;
  const midY = (from[1] + to[1]) / 2;
  const midZ = (from[2] + to[2]) / 2;
  const angle = Math.atan2(dx, dy);

  return (
    <mesh position={[midX, midY, midZ]} rotation={[0, 0, -angle]}>
      <cylinderGeometry args={[0.02, 0.02, length, 8]} />
      <meshBasicMaterial color={color} transparent opacity={opacity * 0.4} />
    </mesh>
  );
}

export function PeopleObject({ opacity }: PeopleObjectProps) {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
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

  const positions: [number, number, number][] = [
    [0, 1.6, 0],
    [-1.4, -0.8, 0],
    [1.4, -0.8, 0],
  ];

  const radii = [0.72, 0.58, 0.58];

  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[radii[i], 32, 32]} />
          <meshStandardMaterial
            color={primaryColor}
            roughness={0.7}
            metalness={0.15}
            transparent
            opacity={opacity * 0.65}
          />
        </mesh>
      ))}
      <ConnectionLine
        from={positions[0]}
        to={positions[1]}
        opacity={opacity}
        color={primaryColor}
      />
      <ConnectionLine
        from={positions[0]}
        to={positions[2]}
        opacity={opacity}
        color={primaryColor}
      />
      <ConnectionLine
        from={positions[1]}
        to={positions[2]}
        opacity={opacity}
        color={primaryColor}
      />
    </group>
  );
}
