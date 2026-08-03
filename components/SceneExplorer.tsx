'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { scenes, type Hotspot } from '@/data/scenes';
import { buildHotspotObject } from '@/lib/models';
import InfoPanel from './InfoPanel';
import BrowserNotice from './BrowserNotice';

export default function SceneExplorer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [selected, setSelected] = useState<Hotspot | null>(null);
  const [visited, setVisited] = useState<Set<string>>(new Set());

  const threeRef = useRef<{
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    group: THREE.Group;
    frameId: number;
    defaultCamPos: THREE.Vector3;
  } | null>(null);

  const activeScene = scenes[sceneIndex];

  // Initialize the renderer once.
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    const defaultCamPos = new THREE.Vector3(3.5, 3, 5);
    camera.position.copy(defaultCamPos);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x444455, 1.1);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(4, 6, 3);
    sun.castShadow = true;
    scene.add(sun);

    const group = new THREE.Group();
    scene.add(group);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let frameId = 0;
    const animate = () => {
      group.rotation.y += 0.0015;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    threeRef.current = {
      renderer,
      camera,
      scene,
      raycaster,
      mouse,
      group,
      frameId,
      defaultCamPos,
    };

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Zoom: mouse wheel, keyboard up/down arrows, and click-drag all dolly
    // the camera along its current view direction. Clamped by distance from
    // the scene center so it can't clip through the floor or fly off into space.
    const MIN_DIST = 1.2;
    const MAX_DIST = 11;
    const viewDir = new THREE.Vector3();
    const dolly = (amount: number) => {
      camera.getWorldDirection(viewDir);
      const nextPos = camera.position.clone().addScaledVector(viewDir, amount);
      const dist = nextPos.length();
      if (dist > MIN_DIST && dist < MAX_DIST) {
        camera.position.copy(nextPos);
      }
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      dolly(-event.deltaY * 0.0025);
    };
    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        dolly(0.3);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        dolly(-0.3);
      }
    };
    window.addEventListener('keydown', handleKeydown);

    let dragStartY: number | null = null;
    let dragMoved = false;
    const DRAG_THRESHOLD = 4;

    const handlePointerDown = (event: PointerEvent) => {
      dragStartY = event.clientY;
      dragMoved = false;
    };
    const handlePointerMove = (event: PointerEvent) => {
      if (dragStartY === null) return;
      const dy = event.clientY - dragStartY;
      if (Math.abs(dy) > DRAG_THRESHOLD) {
        dragMoved = true;
        dolly(-dy * 0.01);
        dragStartY = event.clientY;
      }
    };
    const handlePointerUp = () => {
      dragStartY = null;
    };
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    const handleClick = (event: MouseEvent) => {
      if (dragMoved) {
        dragMoved = false;
        return;
      }
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(group.children, true);
      if (intersects.length > 0) {
        const id = intersects[0].object.userData.hotspotId as string | undefined;
        if (id) handleHotspotClickRef.current?.(id);
      }
    };
    renderer.domElement.addEventListener('click', handleClick);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep a stable ref to the latest click handler so the click listener above
  // (registered once) always calls current state/scene logic.
  const handleHotspotClickRef = useRef<(id: string) => void>();
  useEffect(() => {
    handleHotspotClickRef.current = (id: string) => {
      const hotspot = activeScene.hotspots.find((h) => h.id === id);
      if (!hotspot) return;
      setSelected(hotspot);
      setVisited((prev) => new Set(prev).add(`${activeScene.id}:${id}`));
      const three = threeRef.current;
      if (three) {
        gsap.to(three.camera.position, {
          x: hotspot.position[0] + 1.4,
          y: hotspot.position[1] + 1,
          z: hotspot.position[2] + 1.6,
          duration: 0.9,
          ease: 'power2.out',
        });
      }
    };
  }, [activeScene]);

  // Rebuild the objects whenever the active scene changes.
  useEffect(() => {
    const three = threeRef.current;
    if (!three) return;
    const { group, camera, scene, renderer } = three;

    while (group.children.length) {
      const obj = group.children.pop();
      if (!obj) continue;
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
    }

    const floorGeo = new THREE.CylinderGeometry(4, 4, 0.05, 40);
    const floorMat = new THREE.MeshStandardMaterial({ color: activeScene.floorColor });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.02;
    floor.receiveShadow = true;
    group.add(floor);

    activeScene.hotspots.forEach((h) => group.add(buildHotspotObject(h)));

    scene.background = new THREE.Color(activeScene.bgColor);
    setSelected(null);

    gsap.to(camera.position, {
      x: three.defaultCamPos.x,
      y: three.defaultCamPos.y,
      z: three.defaultCamPos.z,
      duration: 0.8,
      ease: 'power2.inOut',
    });
    renderer.render(scene, camera);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneIndex]);

  const progress = activeScene.hotspots.filter((h) =>
    visited.has(`${activeScene.id}:${h.id}`)
  ).length;

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <BrowserNotice />
      <div ref={mountRef} className="h-full w-full" />

      {/* Scene switcher */}
      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
        {scenes.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setSceneIndex(i)}
            className={`rounded-full px-4 py-2 text-sm font-semibold shadow transition ${
              i === sceneIndex
                ? 'bg-ink text-white'
                : 'bg-white/90 text-ink hover:bg-white'
            }`}
          >
            {s.titleKo}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="absolute right-4 top-4 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-ink shadow">
        {progress} / {activeScene.hotspots.length} 발견
      </div>

      {/* Hint */}
      {!selected && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-4 py-2 text-sm text-slate-600 shadow">
          장면 속 물건을 클릭해서 영어 단어를 배워보세요!
        </div>
      )}

      {selected && (
        <InfoPanel hotspot={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
