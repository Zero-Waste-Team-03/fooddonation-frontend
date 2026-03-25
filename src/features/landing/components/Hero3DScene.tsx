import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { use3DCycle } from "@/hooks/use3DCycle";
import { GlobeObject } from "./hero3d/GlobeObject";
import { EarthObject } from "./hero3d/EarthObject";
import { PeopleObject } from "./hero3d/PeopleObject";

type Hero3DSceneProps = {
  reducedMotion: boolean;
};

function SceneContent({ reducedMotion }: { reducedMotion: boolean }) {
  const { activeIndex, opacity } = use3DCycle({
    count: 3,
    visibleDuration: 3000,
    fadeDuration: 600,
    disabled: reducedMotion,
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      {activeIndex === 0 && <GlobeObject opacity={opacity} />}
      {activeIndex === 1 && <EarthObject opacity={opacity} />}
      {activeIndex === 2 && <PeopleObject opacity={opacity} />}
    </>
  );
}

export function Hero3DScene({ reducedMotion }: Hero3DSceneProps) {
  return (
    <Canvas
      camera={{ position: [-1.2, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <SceneContent reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}
