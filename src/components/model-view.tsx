import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/** Last path segment, lower-cased, so "textures\\Hair_01.png" and "./hair_01.png" match the same picked file. */
const base = (p: string) => decodeURIComponent(p.split(/[\\/]/).pop() ?? p).toLowerCase();

/**
 * Rotatable viewer for a model the user exported from their own game with wow.export (glTF or OBJ),
 * picked together with its .bin, .mtl and texture files. Nothing is uploaded: files are read as local blobs.
 */
export default function ModelView({ files, onError }: { files: File[]; onError: (msg: string) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const el = host.current!;
    const urls = new Map(files.map((f) => [base(f.name), URL.createObjectURL(f)]));
    const ours = new Set(urls.values());
    const missing = new Set<string>();
    const manager = new THREE.LoadingManager();
    manager.setURLModifier((url) => {
      // The loaders resolve "Body.bin" against the blob URL of the main file, so match by file name, not by prefix.
      if (url.startsWith("data:") || ours.has(url)) return url;
      const hit = urls.get(base(url));
      if (!hit) missing.add(base(url));
      return hit ?? url;
    });

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.cssText = "display:block;width:100%;height:100%";
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 0x404050, 2.2));
    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.position.set(2, 4, 3);
    scene.add(sun);
    const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 1000);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;
    controls.addEventListener("start", () => (controls.autoRotate = false));

    const fit = () => {
      const w = el.clientWidth,
        h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    fit();

    let raf = 0;
    const tick = () => {
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const show = (obj: THREE.Object3D) => {
      // WoW models are Z-up in some exports; glTF from wow.export is already Y-up. Frame whatever we got.
      obj.traverse((o) => {
        const m = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
        for (const mat of [m].flat()) if (mat) mat.side = THREE.DoubleSide;
      });
      scene.add(obj);
      const box = new THREE.Box3().setFromObject(obj);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const dist = (Math.max(size.y, size.x, size.z) / (2 * Math.tan((camera.fov * Math.PI) / 360))) * 1.25;
      camera.position.set(center.x, center.y + size.y * 0.05, center.z + dist);
      camera.near = dist / 100;
      camera.far = dist * 100;
      camera.updateProjectionMatrix();
      controls.target.copy(center);
      setLoading(false);
      if (missing.size)
        onError(`Some files the model refers to weren't picked, so parts may show without textures: ${[...missing].join(", ")}`);
    };
    const fail = (e: unknown) => {
      setLoading(false);
      onError(`This model couldn't be opened: ${e instanceof Error ? e.message : String(e)}`);
    };

    const pick = (ext: string) => files.find((f) => f.name.toLowerCase().endsWith(ext));
    const gltf = pick(".gltf") ?? pick(".glb");
    const obj = pick(".obj");
    if (gltf) {
      new GLTFLoader(manager).load(urls.get(base(gltf.name))!, (g) => show(g.scene), undefined, fail);
    } else if (obj) {
      const mtl = pick(".mtl");
      const loadObj = (materials?: MTLLoader.MaterialCreator) => {
        const loader = new OBJLoader(manager);
        if (materials) loader.setMaterials(materials);
        loader.load(urls.get(base(obj.name))!, show, undefined, fail);
      };
      if (mtl) new MTLLoader(manager).load(urls.get(base(mtl.name))!, (m) => (m.preload(), loadObj(m)), undefined, fail);
      else loadObj();
    } else fail(new Error("pick a .gltf, .glb or .obj file along with its other files"));

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        mesh.geometry?.dispose();
        for (const mat of [mesh.material].flat()) if (mat) (mat as THREE.Material).dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
      for (const u of urls.values()) URL.revokeObjectURL(u);
    };
  }, [files]);

  return (
    <div
      ref={host}
      className="relative h-full min-h-[22rem] w-full cursor-grab active:cursor-grabbing"
      aria-label="3D model, drag to rotate, scroll to zoom"
    >
      {loading && <p className="absolute inset-0 grid place-items-center text-sm text-fg-faint">Loading model…</p>}
    </div>
  );
}
