"use client";

import { useEffect, useRef } from "react";
import {
  Vector3 as a,
  MeshPhysicalMaterial as c,
  InstancedMesh as d,
  AmbientLight as f,
  SphereGeometry as g,
  ShaderChunk as h,
  Scene as i,
  Color as l,
  Object3D as m,
  SRGBColorSpace as n,
  MathUtils as o,
  PMREMGenerator as p,
  Vector2 as r,
  WebGLRenderer as s,
  PerspectiveCamera as t,
  PointLight as u,
  ACESFilmicToneMapping as v,
  Plane as w,
  Raycaster as y,
  Clock,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/* ── Tiny Three wrapper ── */
class ThreeApp {
  canvas: HTMLCanvasElement;
  camera: t;
  cameraFov: number;
  cameraMinAspect?: number;
  cameraMaxAspect?: number;
  scene: i;
  renderer!: s;
  size = { width: 0, height: 0, wWidth: 0, wHeight: 0, ratio: 0, pixelRatio: 0 };
  onBeforeRender: (clk: { elapsed: number; delta: number }) => void = () => {};
  onAfterResize: (size: typeof this.size) => void = () => {};
  render: () => void;
  isDisposed = false;

  private _visible = false;
  private _running = false;
  private _rafId = 0;
  private _clock = new Clock();
  private _clkData = { elapsed: 0, delta: 0 };
  private _resizeTimer?: ReturnType<typeof setTimeout>;
  private _io?: IntersectionObserver;
  private _ro?: ResizeObserver;
  private _opts: { canvas?: HTMLCanvasElement; size?: string };

  constructor(opts: { canvas?: HTMLCanvasElement; size?: string }) {
    this._opts = opts;
    this.camera = new t();
    this.cameraFov = this.camera.fov;
    this.scene = new i();
    this.canvas = opts.canvas!;
    this.canvas.style.display = "block";
    this.renderer = new s({ canvas: this.canvas, antialias: true, alpha: true });
    this.renderer.outputColorSpace = n;
    this.render = () => this.renderer.render(this.scene, this.camera);
    this._setupObservers();
    this._resize();
  }

  private _setupObservers() {
    window.addEventListener("resize", this._onResize);
    if (this._opts.size === "parent" && this.canvas.parentElement) {
      this._ro = new ResizeObserver(this._onResize);
      this._ro.observe(this.canvas.parentElement);
    }
    this._io = new IntersectionObserver((entries) => {
      this._visible = entries[0].isIntersecting;
      this._visible ? this._start() : this._stop();
    });
    this._io.observe(this.canvas);
    document.addEventListener("visibilitychange", this._onVisibility);
  }

  private _onResize = () => {
    clearTimeout(this._resizeTimer);
    this._resizeTimer = setTimeout(() => this._resize(), 100);
  };

  private _onVisibility = () => {
    if (this._visible) { document.hidden ? this._stop() : this._start(); }
  };

  private _resize() {
    let w: number, h: number;
    if (this._opts.size === "parent" && this.canvas.parentElement) {
      w = this.canvas.parentElement.offsetWidth;
      h = this.canvas.parentElement.offsetHeight;
    } else {
      w = window.innerWidth; h = window.innerHeight;
    }
    this.size.width = w; this.size.height = h; this.size.ratio = w / h;
    this.camera.aspect = w / h;
    if (this.cameraMaxAspect && this.camera.aspect > this.cameraMaxAspect) {
      const tan = Math.tan(o.degToRad(this.cameraFov / 2)) / (this.camera.aspect / this.cameraMaxAspect);
      this.camera.fov = 2 * o.radToDeg(Math.atan(tan));
    } else {
      this.camera.fov = this.cameraFov;
    }
    this.camera.updateProjectionMatrix();
    const fovRad = (this.camera.fov * Math.PI) / 180;
    this.size.wHeight = 2 * Math.tan(fovRad / 2) * this.camera.position.length();
    this.size.wWidth = this.size.wHeight * this.camera.aspect;
    this.renderer.setSize(w, h);
    const dpr = Math.min(window.devicePixelRatio, 2);
    this.renderer.setPixelRatio(dpr);
    this.size.pixelRatio = dpr;
    this.onAfterResize(this.size);
  }

  private _start() {
    if (this._running) return;
    this._running = true;
    this._clock.start();
    const loop = () => {
      this._rafId = requestAnimationFrame(loop);
      this._clkData.delta = this._clock.getDelta();
      this._clkData.elapsed += this._clkData.delta;
      this.onBeforeRender(this._clkData);
      this.render();
    };
    loop();
  }

  private _stop() {
    if (!this._running) return;
    cancelAnimationFrame(this._rafId);
    this._running = false;
  }

  clear() {
    this.scene.traverse((obj: any) => {
      if (obj.isMesh) { obj.material?.dispose(); obj.geometry?.dispose(); }
    });
    this.scene.clear();
  }

  dispose() {
    window.removeEventListener("resize", this._onResize);
    document.removeEventListener("visibilitychange", this._onVisibility);
    this._ro?.disconnect();
    this._io?.disconnect();
    this._stop();
    this.clear();
    this.renderer.dispose();
    // NOTE: do NOT call forceContextLoss() — React Strict Mode remounts using
    // the same canvas ref, and a lost context cannot be recovered.
    this.isDisposed = true;
  }
}

/* ── Pointer tracker ── */
const _pointers = new Map<Element, any>();
let _listening = false;
const _mouse = new r();

function trackPointer(opts: { domElement: HTMLCanvasElement; onMove: (p: any) => void; onLeave: (p: any) => void }) {
  const state = { position: new r(), nPosition: new r(), hover: false, ...opts };
  _pointers.set(opts.domElement, state);
  if (!_listening) {
    document.body.addEventListener("pointermove", _onMove);
    document.body.addEventListener("pointerleave", _onLeave);
    _listening = true;
  }
  return {
    ...state,
    dispose() {
      _pointers.delete(opts.domElement);
      if (_pointers.size === 0) {
        document.body.removeEventListener("pointermove", _onMove);
        document.body.removeEventListener("pointerleave", _onLeave);
        _listening = false;
      }
    },
  };
}
function _onMove(e: PointerEvent) {
  _mouse.set(e.clientX, e.clientY);
  for (const [el, state] of _pointers) {
    const rect = el.getBoundingClientRect();
    const inside = _mouse.x >= rect.left && _mouse.x <= rect.right && _mouse.y >= rect.top && _mouse.y <= rect.bottom;
    state.position.set(_mouse.x - rect.left, _mouse.y - rect.top);
    state.nPosition.set((state.position.x / rect.width) * 2 - 1, (-state.position.y / rect.height) * 2 + 1);
    if (inside) { state.hover = true; state.onMove(state); }
    else if (state.hover) { state.hover = false; state.onLeave(state); }
  }
}
function _onLeave() {
  for (const state of _pointers.values()) {
    if (state.hover) { state.hover = false; state.onLeave(state); }
  }
}

/* ── Physics ── */
const _tmp = Array.from({ length: 10 }, () => new a());

class Physics {
  config: any;
  positionData: Float32Array;
  velocityData: Float32Array;
  sizeData: Float32Array;
  center = new a();

  constructor(cfg: any) {
    this.config = cfg;
    this.positionData = new Float32Array(3 * cfg.count).fill(0);
    this.velocityData = new Float32Array(3 * cfg.count).fill(0);
    this.sizeData = new Float32Array(cfg.count).fill(1);
    this._init();
    this.setSizes();
  }
  private _init() {
    const { config: c, positionData: pd } = this;
    this.center.toArray(pd, 0);
    for (let i = 1; i < c.count; i++) {
      const b = 3 * i;
      pd[b] = o.randFloatSpread(2 * c.maxX);
      pd[b + 1] = o.randFloatSpread(2 * c.maxY);
      pd[b + 2] = o.randFloatSpread(2 * c.maxZ);
    }
  }
  setSizes() {
    const { config: c, sizeData: sd } = this;
    sd[0] = c.size0;
    for (let i = 1; i < c.count; i++) sd[i] = o.randFloat(c.minSize, c.maxSize);
  }
  update(clk: { delta: number }) {
    const { config: c, center: ctr, positionData: pd, sizeData: sd, velocityData: vd } = this;
    const [F, I, O, V, B, N, _a, j, H] = _tmp;
    let start = 0;
    if (c.controlSphere0) {
      start = 1;
      F.fromArray(pd, 0).lerp(ctr, 0.1).toArray(pd, 0);
      V.set(0, 0, 0).toArray(vd, 0);
    }
    for (let idx = start; idx < c.count; idx++) {
      const base = 3 * idx;
      I.fromArray(pd, base); B.fromArray(vd, base);
      B.y -= clk.delta * c.gravity * sd[idx];
      B.multiplyScalar(c.friction).clampLength(0, c.maxVelocity);
      I.add(B).toArray(pd, base); B.toArray(vd, base);
    }
    for (let idx = start; idx < c.count; idx++) {
      const base = 3 * idx;
      I.fromArray(pd, base); B.fromArray(vd, base);
      const rad = sd[idx];
      for (let jdx = idx + 1; jdx < c.count; jdx++) {
        const ob = 3 * jdx;
        O.fromArray(pd, ob); N.fromArray(vd, ob);
        const or2 = sd[jdx];
        _a.copy(O).sub(I);
        const dist = _a.length(), sum = rad + or2;
        if (dist < sum) {
          const ov = sum - dist;
          j.copy(_a).normalize().multiplyScalar(0.5 * ov);
          H.copy(j).multiplyScalar(Math.max(B.length(), 1));
          I.sub(j); B.sub(H); I.toArray(pd, base); B.toArray(vd, base);
          O.add(j); N.add(H); O.toArray(pd, ob); N.toArray(vd, ob);
        }
      }
      if (c.controlSphere0) {
        F.fromArray(pd, 0);
        _a.copy(F).sub(I);
        const d2 = _a.length(), s2 = rad + sd[0];
        if (d2 < s2) {
          j.copy(_a.normalize()).multiplyScalar(s2 - d2);
          H.copy(j).multiplyScalar(Math.max(B.length(), 2));
          I.sub(j); B.sub(H);
        }
      }
      if (Math.abs(I.x) + rad > c.maxX) { I.x = Math.sign(I.x) * (c.maxX - rad); B.x = -B.x * c.wallBounce; }
      if (c.gravity === 0) {
        if (Math.abs(I.y) + rad > c.maxY) { I.y = Math.sign(I.y) * (c.maxY - rad); B.y = -B.y * c.wallBounce; }
      } else if (I.y - rad < -c.maxY) { I.y = -c.maxY + rad; B.y = -B.y * c.wallBounce; }
      const mb = Math.max(c.maxZ, c.maxSize);
      if (Math.abs(I.z) + rad > mb) { I.z = Math.sign(I.z) * (c.maxZ - rad); B.z = -B.z * c.wallBounce; }
      I.toArray(pd, base); B.toArray(vd, base);
    }
  }
}

/* ── Custom material ── */
class SubsurfaceMaterial extends (c as any) {
  uniforms: Record<string, { value: number }>;
  onBeforeCompile2?: (shader: any) => void;
  constructor(params: any) {
    super(params);
    this.uniforms = {
      thicknessDistortion: { value: 0.1 },
      thicknessAmbient: { value: 0 },
      thicknessAttenuation: { value: 0.1 },
      thicknessPower: { value: 2 },
      thicknessScale: { value: 10 },
    };
    (this as any).defines = { ...(this as any).defines, USE_UV: "" };
    (this as any).onBeforeCompile = (shader: any) => {
      Object.assign(shader.uniforms, this.uniforms);
      shader.fragmentShader = `uniform float thicknessPower;uniform float thicknessScale;uniform float thicknessDistortion;uniform float thicknessAmbient;uniform float thicknessAttenuation;\n` + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace("void main() {", `void RE_Direct_Scattering(const in IncidentLight directLight,const in vec2 uv,const in vec3 geometryPosition,const in vec3 geometryNormal,const in vec3 geometryViewDir,const in vec3 geometryClearcoatNormal,inout ReflectedLight reflectedLight){vec3 scatteringHalf=normalize(directLight.direction+(geometryNormal*thicknessDistortion));float scatteringDot=pow(saturate(dot(geometryViewDir,-scatteringHalf)),thicknessPower)*thicknessScale;vec3 scatteringIllu=(scatteringDot+thicknessAmbient)*diffuse;reflectedLight.directDiffuse+=scatteringIllu*thicknessAttenuation*directLight.color;}\nvoid main() {`);
      const patched = (h as any).lights_fragment_begin.replaceAll(
        "RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );",
        "RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\nRE_Direct_Scattering(directLight,vUv,geometryPosition,geometryNormal,geometryViewDir,geometryClearcoatNormal,reflectedLight);"
      );
      shader.fragmentShader = shader.fragmentShader.replace("#include <lights_fragment_begin>", patched);
    };
  }
}

/* ── Instanced sphere mesh ── */
const _dummy = new m();
const DEFAULT_CFG = {
  count: 200, colors: [0xffffff, 0xdddddd, 0xaaaaaa], ambientColor: 0xffffff, ambientIntensity: 1,
  lightIntensity: 200, materialParams: { metalness: 0.5, roughness: 0.5, clearcoat: 1, clearcoatRoughness: 0.15 },
  minSize: 0.5, maxSize: 1, size0: 1, gravity: 0.5, friction: 0.9975, wallBounce: 0.95,
  maxVelocity: 0.15, maxX: 5, maxY: 5, maxZ: 2, controlSphere0: false, followCursor: true,
};

class BallMesh extends (d as any) {
  config: any;
  physics: Physics;
  ambientLight: f;
  light: u;

  constructor(renderer: s, cfg: any) {
    const merged = { ...DEFAULT_CFG, ...cfg };
    const envTex = new p(renderer, 0.04).fromScene(new RoomEnvironment()).texture;
    const mat = new SubsurfaceMaterial({ envMap: envTex, ...merged.materialParams });
    (mat as any).envMapRotation.x = -Math.PI / 2;
    super(new g(), mat, merged.count);
    this.config = merged;
    this.physics = new Physics(merged);
    this.ambientLight = new f(merged.ambientColor, merged.ambientIntensity);
    this.add(this.ambientLight);
    this.light = new u(merged.colors[0], merged.lightIntensity);
    this.add(this.light);
    this._setColors(merged.colors);
  }

  private _setColors(colors: number[]) {
    if (!Array.isArray(colors) || colors.length < 2) return;
    const cols = colors.map((c2) => new l(c2));
    const getAt = (ratio: number) => {
      const scaled = Math.max(0, Math.min(1, ratio)) * (cols.length - 1);
      const idx = Math.floor(scaled);
      if (idx >= cols.length - 1) return cols[idx].clone();
      const alpha = scaled - idx;
      const s2 = cols[idx], e = cols[idx + 1];
      return new l(s2.r + alpha * (e.r - s2.r), s2.g + alpha * (e.g - s2.g), s2.b + alpha * (e.b - s2.b));
    };
    for (let i = 0; i < this.count; i++) {
      (this as any).setColorAt(i, getAt(i / this.count));
      if (i === 0) this.light.color.copy(getAt(0));
    }
    (this as any).instanceColor.needsUpdate = true;
  }

  update(clk: { delta: number }) {
    this.physics.update(clk);
    for (let i = 0; i < this.count; i++) {
      _dummy.position.fromArray(this.physics.positionData, 3 * i);
      _dummy.scale.setScalar(i === 0 && !this.config.followCursor ? 0 : this.physics.sizeData[i]);
      _dummy.updateMatrix();
      (this as any).setMatrixAt(i, _dummy.matrix);
      if (i === 0) this.light.position.copy(_dummy.position);
    }
    (this as any).instanceMatrix.needsUpdate = true;
  }
}

/* ── Factory ── */
function createBallpit(canvas: HTMLCanvasElement, cfg: any) {
  const app = new ThreeApp({ canvas, size: "parent" });

  // WebGL context failed to initialize — bail silently
  if (app.isDisposed || !app.renderer) return { dispose() {} };

  app.renderer.toneMapping = v;
  app.camera.position.set(0, 0, 20);
  app.camera.lookAt(0, 0, 0);
  app.cameraMaxAspect = 1.5;

  let mesh: BallMesh;
  function init(config: any) {
    if (mesh) { app.clear(); app.scene.remove(mesh); }
    mesh = new BallMesh(app.renderer, config);
    app.scene.add(mesh);
  }
  init(cfg);

  const raycaster = new y();
  const plane = new w(new a(0, 0, 1), 0);
  const hit = new a();

  const pointer = trackPointer({
    domElement: canvas,
    onMove() {
      raycaster.setFromCamera(pointer.nPosition, app.camera);
      app.camera.getWorldDirection(plane.normal);
      raycaster.ray.intersectPlane(plane, hit);
      mesh.physics.center.copy(hit);
      mesh.config.controlSphere0 = true;
    },
    onLeave() { mesh.config.controlSphere0 = false; },
  });

  app.onBeforeRender = (clk) => mesh.update(clk);
  app.onAfterResize = (size) => {
    mesh.config.maxX = size.wWidth / 2;
    mesh.config.maxY = size.wHeight / 2;
  };

  return {
    dispose() { pointer.dispose(); app.dispose(); },
  };
}

/* ── React Component ── */
export interface BallpitProps {
  className?: string;
  count?: number;
  gravity?: number;
  friction?: number;
  wallBounce?: number;
  followCursor?: boolean;
  colors?: number[];
  ambientColor?: number;
  ambientIntensity?: number;
  lightIntensity?: number;
  minSize?: number;
  maxSize?: number;
  size0?: number;
  maxVelocity?: number;
  maxX?: number;
  maxY?: number;
  maxZ?: number;
}

export default function Ballpit({ className = "", followCursor = true, ...props }: BallpitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const instance = createBallpit(canvas, { followCursor, ...props });
    return () => instance.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
