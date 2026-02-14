"use client";

import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  ACESFilmicToneMapping,
  AnimationMixer,
  Box3,
  LinearFilter,
  LinearMipmapLinearFilter,
  LoopOnce,
  LoopRepeat,
  NearestFilter,
  SRGBColorSpace,
  Vector3,
} from "three";
import type * as THREE from "three";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Bounds,
  ContactShadows,
  Environment,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";

class ModelErrorBoundary extends Component<
  { fallback?: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

function pickClip(animations: THREE.AnimationClip[], requestedName?: string) {
  const valid = animations.filter(
    (c) => Number.isFinite(c.duration) && c.duration > 0.001 && c.tracks.length > 0
  );
  const list = valid.length ? valid : animations;

  const normalizedRequested = (requestedName ?? "").trim().toLowerCase();
  const keys = list.map((c) => c.name);

  if (normalizedRequested) {
    const exactName = keys.find((k) => k.trim().toLowerCase() === normalizedRequested);
    if (exactName) return { clip: list.find((c) => c.name === exactName), key: exactName };

    const containsName = keys.find((k) => k.trim().toLowerCase().includes(normalizedRequested));
    if (containsName) return { clip: list.find((c) => c.name === containsName), key: containsName };
  }

  const idleName = keys.find((k) => k.trim().toLowerCase().includes("idle"));
  if (idleName) return { clip: list.find((c) => c.name === idleName), key: idleName };

  return { clip: list[0], key: list[0]?.name };
}

function Model({ url, animation }: { url: string; animation?: string }) {
  const group = useRef<THREE.Group>(null);
  const spinGroup = useRef<THREE.Group>(null);
  const gltf = useGLTF(url);
  const { camera, gl } = useThree();

  const mixer = useMemo(() => new AnimationMixer(gltf.scene), [gltf.scene]);

  const bounds = useMemo(() => {
    const box = new Box3().setFromObject(gltf.scene);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const offset = new Vector3(-center.x, -center.y, -center.z);
    return { box, size, center, maxDim, offset };
  }, [gltf.scene]);

  // Intentionally do not force cast/receive shadows here.
  // Shadow maps (and contact shadows) are the #1 source of "blocky squares" artifacts.

  useEffect(() => {
    // Fix common GLB export issues that look like "square / blocky" textures
    const fixMaterial = (material: THREE.Material) => {
      const anyMat = material as unknown as Record<string, unknown>;

      const maxAnisotropy = Math.max(1, gl.capabilities.getMaxAnisotropy?.() ?? 1);
      const isWebGL2 = Boolean(gl.capabilities.isWebGL2);

      const isPowerOfTwo = (n: number) => (n & (n - 1)) === 0 && n !== 0;

      const maybeFixTexture = (key: string, opts?: { srgb?: boolean }) => {
        const tex = anyMat[key] as THREE.Texture | undefined;
        if (!tex) return;

        // Anisotropy reduces shimmering/blockiness at grazing angles.
        tex.anisotropy = Math.min(8, maxAnisotropy);

        if (opts?.srgb) {
          // Albedo/baseColor and emissive maps should be sRGB
          // (Three r152+ uses `colorSpace`)
          (tex as unknown as { colorSpace?: unknown }).colorSpace = SRGBColorSpace;
        }

        // If the exporter set NEAREST, it will look like big squares.
        if (tex.magFilter === NearestFilter) tex.magFilter = LinearFilter;

        // Mipmaps only when safe. NPOT + WebGL1 cannot use mipmaps.
        const image = tex.image as { width?: number; height?: number } | undefined;
        const w = image?.width ?? 0;
        const h = image?.height ?? 0;
        const hasSize = Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0;
        const canMip = !hasSize || isWebGL2 || (isPowerOfTwo(w) && isPowerOfTwo(h));

        if (canMip) {
          if (tex.minFilter === NearestFilter) tex.minFilter = LinearMipmapLinearFilter;
          if (tex.minFilter === LinearFilter) tex.minFilter = LinearMipmapLinearFilter;
          tex.generateMipmaps = true;
        } else {
          // Best fallback for NPOT on WebGL1.
          tex.generateMipmaps = false;
          if (tex.minFilter === NearestFilter) tex.minFilter = LinearFilter;
          if (tex.minFilter === LinearMipmapLinearFilter) tex.minFilter = LinearFilter;
        }

        tex.needsUpdate = true;
      };

      // Color textures
      maybeFixTexture("map", { srgb: true });
      maybeFixTexture("emissiveMap", { srgb: true });

      // Linear data textures (keep linear, but fix filtering if needed)
      maybeFixTexture("normalMap");
      maybeFixTexture("metalnessMap");
      maybeFixTexture("roughnessMap");
      maybeFixTexture("aoMap");

      material.needsUpdate = true;
    };

    gltf.scene.traverse((obj) => {
      const mesh = obj as unknown as { isMesh?: boolean; material?: THREE.Material | THREE.Material[] };
      if (!mesh.isMesh || !mesh.material) return;

      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const mat of materials) fixMaterial(mat);
    });
  }, [gltf.scene]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;

    // Helpful debug: confirm the baseColor texture resolution + filters.
    const logs: string[] = [];
    gltf.scene.traverse((obj) => {
      const mesh = obj as unknown as { isMesh?: boolean; material?: THREE.Material | THREE.Material[] };
      if (!mesh.isMesh || !mesh.material) return;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const mat of materials) {
        const anyMat = mat as unknown as { name?: string; map?: THREE.Texture };
        const map = anyMat.map;
        if (!map) continue;
        const img = map.image as { width?: number; height?: number } | undefined;
        const w = img?.width;
        const h = img?.height;
        logs.push(
          `[GLB] baseColor map ${anyMat.name ? `(${anyMat.name}) ` : ""}${w ?? "?"}x${h ?? "?"} min=${map.minFilter} mag=${map.magFilter} aniso=${map.anisotropy}`
        );
      }
    });

    if (logs.length) console.log(logs.join("\n"));
  }, [gltf.scene]);

  const picked = useMemo(
    () => pickClip(gltf.animations as unknown as THREE.AnimationClip[], animation),
    [gltf.animations, animation]
  );
  const currentAction = useRef<THREE.AnimationAction | null>(null);

  useFrame((_, delta) => {
    // Force advancing time even if something disables drei's internal mixer updates.
    mixer.update(delta);
  });

  useEffect(() => {
    // Auto-frame the model in view (handles wildly different scales/origins)
    const { size, maxDim } = bounds;
    if (!Number.isFinite(maxDim) || maxDim <= 0) return;

    if (!("fov" in camera)) return;

    const fov = ((camera as THREE.PerspectiveCamera).fov * Math.PI) / 180;
    let distance = (maxDim / 2) / Math.tan(fov / 2);
    distance *= 1.35;

    camera.near = Math.max(0.01, distance / 100);
    camera.far = distance * 100;
    // After centering, the model is roughly around the origin.
    const lookY = size.y * 0.06;
    camera.position.set(0, size.y * 0.10, distance);
    camera.lookAt(0, lookY, 0);
    camera.updateProjectionMatrix();
  }, [bounds, camera]);

  useEffect(() => {
    const clip = picked.clip;
    if (!clip) return;

    if (currentAction.current) {
      currentAction.current.fadeOut(0.15);
      currentAction.current.stop();
      currentAction.current = null;
    }

    const key = (picked.key ?? clip.name ?? "").trim().toLowerCase();
    const isOneShot = key.includes("roar") || key.includes("attack");

    const action = mixer.clipAction(clip, group.current ?? gltf.scene);
    action.reset();
    action.enabled = true;
    action.paused = false;
    action.setEffectiveWeight(1);
    action.setEffectiveTimeScale(1);
    action.setLoop(isOneShot ? LoopOnce : LoopRepeat, isOneShot ? 1 : Infinity);
    action.clampWhenFinished = isOneShot;
    action.fadeIn(0.2).play();
    mixer.timeScale = 1;
    currentAction.current = action;

    return () => {
      action.fadeOut(0.15);
      action.stop();
    };
  }, [gltf.scene, mixer, picked]);

  return (
    <group ref={group} dispose={null}>
      <group ref={spinGroup}>
        {/* Center model pivot so it sits nicely inside the card */}
        <group position={[bounds.offset.x, bounds.offset.y, bounds.offset.z]}>
          <primitive object={gltf.scene} />
        </group>
      </group>
    </group>
  );
}

function LoadingFallback() {
  return null;
}

export function GltfModelCanvas({
  url,
  animation,
  animationCycle,
  animationCycleSeconds,
  models,
  spin,
  spinSpeed,
  recomputeNormals,
  contactShadow,
  className,
}: {
  url: string;
  animation?: string;
  animationCycle?: readonly string[];
  animationCycleSeconds?: number;
  models?: readonly {
    url: string;
    animation?: string;
    animationCycle?: readonly string[];
    animationCycleSeconds?: number;
  }[];
  spin?: boolean;
  spinSpeed?: number;
  recomputeNormals?: boolean;
  contactShadow?: boolean;
  className?: string;
}) {
  const modelList = useMemo(() => (models ?? []).filter((m) => Boolean(m?.url)), [models]);
  const modelListKey = useMemo(
    () => modelList.map((m) => m.url).join("|"),
    [modelList]
  );
  const [{ modelIndex, cycleIndex }, setCycleState] = useState(() => ({
    modelIndex: 0,
    cycleIndex: 0,
  }));

  useEffect(() => {
    // If the provided list changes, reset state.
    setCycleState({ modelIndex: 0, cycleIndex: 0 });
  }, [modelListKey]);

  const effectiveModel = modelList.length
    ? modelList[modelIndex % modelList.length]
    : undefined;

  const effectiveUrl = effectiveModel?.url ?? url;
  const effectiveAnimationSeconds =
    effectiveModel?.animationCycleSeconds ?? animationCycleSeconds;
  const effectiveAnimationCycle = effectiveModel?.animationCycle ?? animationCycle;
  const effectiveSingleAnimation = effectiveModel?.animation ?? animation;

  const cycleList = useMemo(() => {
    const source = effectiveAnimationCycle ?? [];
    return source.map((a) => a.trim()).filter(Boolean);
  }, [effectiveAnimationCycle]);

  const cycleMs = Math.max(250, (effectiveAnimationSeconds ?? 0) * 1000);

  useEffect(() => {
    if (!cycleList.length) return;
    const id = window.setInterval(() => {
      setCycleState((prev) => {
        const nextCycleIndex = (prev.cycleIndex + 1) % cycleList.length;
        const shouldAdvanceModel = nextCycleIndex === 0 && modelList.length > 1;
        const nextModelIndex = shouldAdvanceModel
          ? (prev.modelIndex + 1) % modelList.length
          : prev.modelIndex;
        return { modelIndex: nextModelIndex, cycleIndex: nextCycleIndex };
      });
    }, cycleMs);
    return () => window.clearInterval(id);
  }, [cycleList.length, cycleMs, modelList.length]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (modelList.length <= 1) return;
    // eslint-disable-next-line no-console
    console.log(`[GLB] active model: ${effectiveUrl}`);
  }, [effectiveUrl, modelList.length]);

  const effectiveAnimation = cycleList.length
    ? cycleList[cycleIndex]
    : effectiveSingleAnimation;

  return (
    <div
      className={
        className ?? "relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
      }
    >
      <Canvas
        // Avoid shadow-map artifacts by default (Sketchfab look is more like HDRI + soft fill)
        shadows={false}
        frameloop="always"
        camera={{ position: [0, 0.8, 2.6], fov: 35 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = SRGBColorSpace;
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
        }}
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[3, 4, 2]} intensity={0.55} />
        <directionalLight position={[-2, 2, -2]} intensity={0.25} />
        <Environment preset="studio" />

        <ModelErrorBoundary fallback={null}>
          <Suspense fallback={<LoadingFallback />}>
            <Bounds fit clip margin={1.15}>
              <ModelWithSpin
                key={effectiveUrl}
                url={effectiveUrl}
                animation={effectiveAnimation}
                spin={spin}
                spinSpeed={spinSpeed}
                recomputeNormals={recomputeNormals}
              />
            </Bounds>

            {contactShadow ? (
              <ContactShadows
                opacity={0.22}
                scale={10}
                blur={2.6}
                far={7}
                resolution={1024}
                position={[0, -1.1, 0]}
              />
            ) : null}
          </Suspense>
        </ModelErrorBoundary>

        <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />
    </div>
  );
}

function ModelWithSpin({
  url,
  animation,
  spin,
  spinSpeed,
  recomputeNormals,
}: {
  url: string;
  animation?: string;
  spin?: boolean;
  spinSpeed?: number;
  recomputeNormals?: boolean;
}) {
  const spinGroup = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!spin) return;
    const speed = Number.isFinite(spinSpeed) ? (spinSpeed as number) : 0.45;
    if (!spinGroup.current) return;
    spinGroup.current.rotation.y += delta * speed;
  });

  return (
    <group ref={spinGroup}>
      <ModelWithFixes url={url} animation={animation} recomputeNormals={recomputeNormals} />
    </group>
  );
}

function ModelWithFixes({
  url,
  animation,
  recomputeNormals,
}: {
  url: string;
  animation?: string;
  recomputeNormals?: boolean;
}) {
  const gltf = useGLTF(url);

  useEffect(() => {
    if (!recomputeNormals) return;
    gltf.scene.traverse((obj) => {
      const mesh = obj as unknown as { isMesh?: boolean; geometry?: THREE.BufferGeometry; material?: THREE.Material | THREE.Material[] };
      if (!mesh.isMesh || !mesh.geometry) return;

      // Smooth shading can remove the "square" look that comes from hard normals.
      try {
        mesh.geometry.computeVertexNormals();
        mesh.geometry.attributes.normal.needsUpdate = true;
      } catch {
        // ignore
      }

      if (mesh.material) {
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const mat of mats) {
          const anyMat = mat as unknown as { flatShading?: boolean; needsUpdate?: boolean };
          if (typeof anyMat.flatShading === "boolean") anyMat.flatShading = false;
          mat.needsUpdate = true;
        }
      }
    });
  }, [gltf.scene, recomputeNormals]);

  // Delegate to the main animated/centered model
  return <Model url={url} animation={animation} />;
}
