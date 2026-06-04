import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useState, useCallback } from "react";

const GRID_W = 80;
const GRID_H = 60;

function Particles({ imageData, hovered }) {
  const meshRef = useRef();
  const progress = useRef(0);

  const { posArray, colArray, velArray, originArray } = useMemo(() => {
    if (!imageData) return {};

    const count = GRID_W * GRID_H;
    const posArray   = new Float32Array(count * 3);
    const colArray   = new Float32Array(count * 3);
    const velArray   = new Float32Array(count * 3);

    for (let i = 0; i < GRID_H; i++) {
      for (let j = 0; j < GRID_W; j++) {
        const idx     = i * GRID_W + j;
        const px      = Math.floor((j / GRID_W) * imageData.width);
        const py      = Math.floor((i / GRID_H) * imageData.height);
        const dataIdx = (py * imageData.width + px) * 4;

        posArray[idx * 3]     = (j / GRID_W - 0.5) * 2;
        posArray[idx * 3 + 1] = (0.5 - i / GRID_H) * 2;
        posArray[idx * 3 + 2] = 0;

        colArray[idx * 3]     = imageData.data[dataIdx]     / 255;
        colArray[idx * 3 + 1] = imageData.data[dataIdx + 1] / 255;
        colArray[idx * 3 + 2] = imageData.data[dataIdx + 2] / 255;

        // Scatter direction: explode outward + upward with randomness
        const cx = (j / GRID_W - 0.5);
        const cy = (0.5 - i / GRID_H);
        velArray[idx * 3]     = cx * (1.5 + Math.random() * 2.5);
        velArray[idx * 3 + 1] = cy * (1.5 + Math.random() * 2.5) + Math.random() * 0.5;
        velArray[idx * 3 + 2] = (Math.random() - 0.3) * 1.5;
      }
    }

    return { posArray, colArray, velArray, originArray: new Float32Array(posArray) };
  }, [imageData]);

  useFrame((_, delta) => {
    if (!meshRef.current || !originArray) return;

    const target = hovered ? 1 : 0;
    const speed  = hovered ? 3.8 : 6;
    progress.current += (target - progress.current) * delta * speed;

    const p = meshRef.current.geometry.attributes.position.array;
    const t = progress.current;

    for (let i = 0; i < p.length; i += 3) {
      p[i]     = originArray[i]     + velArray[i]     * t;
      p[i + 1] = originArray[i + 1] + velArray[i + 1] * t;
      p[i + 2] = originArray[i + 2] + velArray[i + 2] * t;
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.material.opacity = Math.max(0, 1 - t * 0.85);
  });

  if (!posArray) return null;

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={posArray.length / 3}
          array={posArray}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colArray.length / 3}
          array={colArray}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={1}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

export default function PhotoCard3D({
  src,
  alt,
  className,
  imgClassName,
  onClick,
  ariaLabel,
  children,
}) {
  const [hovered, setHovered]     = useState(false);
  const [imageData, setImageData] = useState(null);
  const imgRef = useRef(null);
  const sampled = useRef(false);

  const sample = useCallback(() => {
    if (sampled.current) return;
    const img = imgRef.current;
    if (!img || !img.complete) return;
    try {
      const canvas = document.createElement("canvas");
      canvas.width  = GRID_W;
      canvas.height = GRID_H;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, GRID_W, GRID_H);
      const data = ctx.getImageData(0, 0, GRID_W, GRID_H);
      setImageData(data);
      sampled.current = true;
    } catch {
      // CORS issue — skip particle effect gracefully
    }
  }, []);

  return (
    <button
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
      onMouseEnter={() => { sample(); setHovered(true); }}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: "relative", borderRadius: "inherit" }}>
        {/* Base image — fades as particles appear */}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={imgClassName}
          loading="lazy"
          onLoad={sample}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            opacity: hovered && imageData ? 0 : 1,
            transition: "opacity 0.18s ease",
          }}
        />

        {/* Grain + vignette overlay (always present) */}
        <div
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            borderRadius: "inherit", zIndex: 2,
            background: hovered
              ? "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)"
              : "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%)",
            transition: "background 0.3s ease",
          }}
        />

        {/* Particle canvas */}
        {imageData && (
          <Canvas
            style={{
              position: "absolute", inset: 0,
              pointerEvents: "none", zIndex: 3,
              borderRadius: "inherit",
            }}
            camera={{ position: [0, 0, 1.5], fov: 70 }}
            frameloop="always"
            gl={{ alpha: true, antialias: false }}
          >
            <Particles imageData={imageData} hovered={hovered} />
          </Canvas>
        )}
      </div>

      {children}
    </button>
  );
}
