import * as THREE from 'three';

function mat(color: string, opts: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.65, metalness: 0.05, ...opts });
}

function mesh(
  geo: THREE.BufferGeometry,
  material: THREE.Material,
  x = 0,
  y = 0,
  z = 0,
  rx = 0,
  ry = 0,
  rz = 0
) {
  const m = new THREE.Mesh(geo, material);
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  return m;
}

function group(...children: THREE.Object3D[]) {
  const g = new THREE.Group();
  children.forEach((c) => g.add(c));
  return g;
}

function fourLegs(w: number, d: number, legH: number, legR: number, color: string, inset = 0.06) {
  const g = new THREE.Group();
  const m = mat(color);
  const xs = [-(w / 2 - inset), w / 2 - inset];
  const zs = [-(d / 2 - inset), d / 2 - inset];
  xs.forEach((x) => zs.forEach((z) => g.add(mesh(new THREE.CylinderGeometry(legR, legR, legH, 8), m, x, legH / 2, z))));
  return g;
}

// ---- Classroom ----

function desk(color: string) {
  const top = mesh(new THREE.BoxGeometry(1.4, 0.08, 0.8), mat(color), 0, 0.76, 0);
  return group(top, fourLegs(1.3, 0.7, 0.72, 0.04, '#6b4a2b'));
}

function chair(color: string) {
  const seat = mesh(new THREE.BoxGeometry(0.5, 0.06, 0.5), mat(color), 0, 0.44, 0);
  const back = mesh(new THREE.BoxGeometry(0.5, 0.5, 0.06), mat(color), 0, 0.72, -0.22);
  return group(seat, back, fourLegs(0.44, 0.44, 0.44, 0.03, '#4a3018'));
}

function book(color: string) {
  const cover = mesh(new THREE.BoxGeometry(0.42, 0.05, 0.3), mat(color), 0, 0.025, 0);
  const pages = mesh(new THREE.BoxGeometry(0.37, 0.035, 0.26), mat('#f7f2e7'), 0, 0.0675, 0.01);
  return group(cover, pages);
}

function pencil(color: string) {
  const r = 0.028;
  const body = mesh(new THREE.CylinderGeometry(r, r, 0.36, 6), mat(color), -0.02, r, 0, 0, 0, Math.PI / 2);
  const tip = mesh(new THREE.ConeGeometry(r, 0.08, 6), mat('#e8b688'), 0.19, r, 0, 0, 0, -Math.PI / 2);
  const lead = mesh(new THREE.ConeGeometry(0.009, 0.02, 6), mat('#2b2b2b'), 0.245, r, 0, 0, 0, -Math.PI / 2);
  const ferrule = mesh(new THREE.CylinderGeometry(r + 0.002, r + 0.002, 0.03, 8), mat('#c9c9c9', { metalness: 0.6, roughness: 0.3 }), -0.215, r, 0, 0, 0, Math.PI / 2);
  const eraser = mesh(new THREE.CylinderGeometry(r, r, 0.05, 8), mat('#f4a6c6'), -0.255, r, 0, 0, 0, Math.PI / 2);
  return group(body, tip, lead, ferrule, eraser);
}

function blackboard(color: string) {
  const frame = mesh(new THREE.BoxGeometry(3.1, 1.7, 0.08), mat('#8a5a2b'), 0, 1.6, -0.02);
  const board = mesh(new THREE.BoxGeometry(2.9, 1.5, 0.04), mat(color), 0, 1.6, 0.02);
  const tray = mesh(new THREE.BoxGeometry(2.9, 0.06, 0.12), mat('#8a5a2b'), 0, 0.78, 0.08);
  const chalk = mesh(new THREE.BoxGeometry(0.08, 0.03, 0.03), mat('#ffffff'), 0.6, 0.82, 0.08);
  return group(frame, board, tray, chalk);
}

function backpack(color: string) {
  const body = mesh(new THREE.BoxGeometry(0.5, 0.62, 0.28), mat(color), 0, 0.31, 0);
  const pocket = mesh(new THREE.BoxGeometry(0.32, 0.28, 0.08), mat(color, { roughness: 0.8 }), 0, 0.24, 0.17);
  const flap = mesh(new THREE.BoxGeometry(0.5, 0.14, 0.3), mat(color, { roughness: 0.75 }), 0, 0.69, 0);
  const strapMat = mat('#333333');
  const strapL = mesh(new THREE.BoxGeometry(0.06, 0.55, 0.05), strapMat, -0.16, 0.4, -0.15);
  const strapR = mesh(new THREE.BoxGeometry(0.06, 0.55, 0.05), strapMat, 0.16, 0.4, -0.15);
  const zipper = mesh(new THREE.BoxGeometry(0.02, 0.5, 0.02), mat('#222222'), 0, 0.4, 0.211);
  return group(body, pocket, flap, strapL, strapR, zipper);
}

// ---- Airport ----

function airplane(color: string) {
  const bodyMat = mat(color, { roughness: 0.35, metalness: 0.15 });
  const accent = mat('#2563eb');
  const gearMat = mat('#333333');
  const fuselage = mesh(new THREE.CylinderGeometry(0.22, 0.22, 1.6, 16), bodyMat, 0, 0.9, 0, 0, 0, Math.PI / 2);
  const nose = mesh(new THREE.ConeGeometry(0.22, 0.5, 16), bodyMat, 0.95, 0.9, 0, 0, 0, -Math.PI / 2);
  const tailCap = mesh(new THREE.ConeGeometry(0.22, 0.3, 16), bodyMat, -0.85, 0.9, 0, 0, 0, Math.PI / 2);
  const wingL = mesh(new THREE.BoxGeometry(0.9, 0.05, 0.32), bodyMat, -0.05, 0.85, 0.55, 0, 0.08, 0);
  const wingR = mesh(new THREE.BoxGeometry(0.9, 0.05, 0.32), bodyMat, -0.05, 0.85, -0.55, 0, -0.08, 0);
  const tailFin = mesh(new THREE.BoxGeometry(0.22, 0.45, 0.05), accent, -0.78, 1.15, 0);
  const stabL = mesh(new THREE.BoxGeometry(0.32, 0.04, 0.16), bodyMat, -0.78, 0.95, 0.22);
  const stabR = mesh(new THREE.BoxGeometry(0.32, 0.04, 0.16), bodyMat, -0.78, 0.95, -0.22);
  const stripe = mesh(new THREE.BoxGeometry(1.5, 0.06, 0.02), accent, 0.05, 0.78, 0.221);
  const gearGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8);
  const gearFront = mesh(gearGeo, gearMat, 0.5, 0.37, 0);
  const gearL = mesh(gearGeo, gearMat, -0.3, 0.37, 0.25);
  const gearR = mesh(gearGeo, gearMat, -0.3, 0.37, -0.25);
  const wheelGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.05, 12);
  const wheelFront = mesh(wheelGeo, gearMat, 0.5, 0.07, 0, Math.PI / 2, 0, 0);
  const wheelL = mesh(wheelGeo, gearMat, -0.3, 0.07, 0.25, Math.PI / 2, 0, 0);
  const wheelR = mesh(wheelGeo, gearMat, -0.3, 0.07, -0.25, Math.PI / 2, 0, 0);
  return group(fuselage, nose, tailCap, wingL, wingR, tailFin, stabL, stabR, stripe, gearFront, gearL, gearR, wheelFront, wheelL, wheelR);
}

function gate(color: string) {
  const frameMat = mat('#9aa5b1', { metalness: 0.3, roughness: 0.5 });
  const glassMat = mat('#bcdffb', { transparent: true, opacity: 0.35, roughness: 0.1, metalness: 0.1 });
  const postL = mesh(new THREE.BoxGeometry(0.12, 2, 0.12), frameMat, -0.55, 1, 0);
  const postR = mesh(new THREE.BoxGeometry(0.12, 2, 0.12), frameMat, 0.55, 1, 0);
  const lintel = mesh(new THREE.BoxGeometry(1.22, 0.14, 0.14), frameMat, 0, 2.02, 0);
  const glass = mesh(new THREE.BoxGeometry(0.9, 1.7, 0.03), glassMat, 0, 1.0, 0.05);
  const sign = mesh(new THREE.BoxGeometry(1.0, 0.3, 0.06), mat(color), 0, 2.35, 0);
  return group(postL, postR, lintel, glass, sign);
}

function suitcase(color: string) {
  const body = mesh(new THREE.BoxGeometry(0.55, 0.42, 0.22), mat(color), 0, 0.29, 0);
  const stripe = mesh(new THREE.BoxGeometry(0.57, 0.05, 0.24), mat('#222222'), 0, 0.29, 0);
  const handleMat = mat('#333333', { metalness: 0.4, roughness: 0.4 });
  const hL = mesh(new THREE.BoxGeometry(0.03, 0.12, 0.03), handleMat, -0.12, 0.56, 0);
  const hR = mesh(new THREE.BoxGeometry(0.03, 0.12, 0.03), handleMat, 0.12, 0.56, 0);
  const hTop = mesh(new THREE.BoxGeometry(0.27, 0.03, 0.03), handleMat, 0, 0.62, 0);
  const wheelGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.03, 12);
  const wheelMat = mat('#111111');
  const wL = mesh(wheelGeo, wheelMat, -0.2, 0.04, 0, Math.PI / 2, 0, 0);
  const wR = mesh(wheelGeo, wheelMat, 0.2, 0.04, 0, Math.PI / 2, 0, 0);
  return group(body, stripe, hL, hR, hTop, wL, wR);
}

function passport(color: string) {
  const cover = mesh(new THREE.BoxGeometry(0.26, 0.035, 0.36), mat(color), 0, 0.0175, 0);
  const pages = mesh(new THREE.BoxGeometry(0.24, 0.02, 0.34), mat('#f2ede1'), 0, 0.045, 0);
  const emblem = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.005, 16), mat('#d4af37', { metalness: 0.7, roughness: 0.3 }), 0, 0.036, -0.05, Math.PI / 2, 0, 0);
  return group(cover, pages, emblem);
}

function runway(color: string) {
  const strip = mesh(new THREE.BoxGeometry(1.2, 0.04, 3), mat(color), 0, 0.02, 0);
  const stripeMat = mat('#f4f4f4');
  const g = group(strip);
  for (let i = -1.3; i <= 1.3; i += 0.5) {
    g.add(mesh(new THREE.BoxGeometry(0.08, 0.01, 0.3), stripeMat, 0, 0.045, i));
  }
  return g;
}

// ---- Cafe ----

function cup(color: string) {
  const body = mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.22, 20), mat(color), 0, 0.11, 0);
  const coffee = mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.02, 20), mat('#3c2415'), 0, 0.215, 0);
  const handle = mesh(new THREE.TorusGeometry(0.06, 0.014, 8, 16), mat(color), 0.11, 0.13, 0, Math.PI / 2, Math.PI / 2, 0);
  return group(body, coffee, handle);
}

function cafeTable(color: string) {
  const top = mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.05, 32), mat(color), 0, 0.7, 0);
  const pole = mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.62, 16), mat('#3a3a3a'), 0, 0.36, 0);
  const base = mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.04, 32), mat('#3a3a3a'), 0, 0.02, 0);
  return group(top, pole, base);
}

function menu(color: string) {
  const cardMat = mat('#fdfaf3');
  const left = mesh(new THREE.BoxGeometry(0.16, 0.22, 0.01), cardMat, -0.045, 0.11, 0, 0, 0, 0.35);
  const right = mesh(new THREE.BoxGeometry(0.16, 0.22, 0.01), cardMat, 0.045, 0.11, 0, 0, 0, -0.35);
  const stripe = mesh(new THREE.BoxGeometry(0.16, 0.03, 0.012), mat(color), -0.045, 0.19, 0, 0, 0, 0.35);
  return group(left, right, stripe);
}

function juice(color: string) {
  const glass = mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.24, 20), mat('#dff1f7', { transparent: true, opacity: 0.35, roughness: 0.1 }), 0, 0.12, 0);
  const liquid = mesh(new THREE.CylinderGeometry(0.075, 0.06, 0.16, 20), mat(color, { transparent: true, opacity: 0.9 }), 0, 0.09, 0);
  const straw = mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.34, 8), mat('#ff5d8f'), 0.03, 0.2, 0, 0, 0, -0.2);
  return group(glass, liquid, straw);
}

function cake(color: string) {
  const tier1 = mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.09, 24), mat(color), 0, 0.045, 0);
  const tier2 = mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.07, 24), mat('#ffe3ee'), 0, 0.125, 0);
  const cherry = mesh(new THREE.SphereGeometry(0.025, 12, 12), mat('#c1121f'), 0, 0.185, 0);
  return group(tier1, tier2, cherry);
}

// ---- Check-in counter ----

function ticket(color: string) {
  const base = mesh(new THREE.BoxGeometry(0.26, 0.01, 0.12), mat('#fbfaf6'), 0, 0.005, 0);
  const stripe = mesh(new THREE.BoxGeometry(0.06, 0.012, 0.12), mat(color), -0.08, 0.006, 0);
  const perf = mesh(new THREE.BoxGeometry(0.01, 0.013, 0.12), mat('#cccccc'), -0.05, 0.007, 0);
  return group(base, stripe, perf);
}

function counter(color: string) {
  const body = mesh(new THREE.BoxGeometry(2.4, 0.95, 0.6), mat(color), 0, 0.475, 0);
  const top = mesh(new THREE.BoxGeometry(2.5, 0.06, 0.68), mat('#dcdfe3'), 0, 0.98, 0);
  const panel = mesh(new THREE.BoxGeometry(2.3, 0.6, 0.02), mat('#37474f'), 0, 0.4, 0.31);
  return group(body, top, panel);
}

function luggage(color: string) {
  const body = mesh(new THREE.BoxGeometry(0.42, 0.55, 0.28), mat(color), 0, 0.315, 0);
  const handleBar = mesh(new THREE.BoxGeometry(0.28, 0.03, 0.03), mat('#333333'), 0, 0.77, 0);
  const rodMat = mat('#555555');
  const rodL = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.2, 8), rodMat, -0.12, 0.68, 0);
  const rodR = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.2, 8), rodMat, 0.12, 0.68, 0);
  const wheelGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.03, 12);
  const wheelMat = mat('#111111');
  const wL = mesh(wheelGeo, wheelMat, -0.15, 0.04, 0, Math.PI / 2, 0, 0);
  const wR = mesh(wheelGeo, wheelMat, 0.15, 0.04, 0, Math.PI / 2, 0, 0);
  return group(body, handleBar, rodL, rodR, wL, wR);
}

function boardingpass(color: string) {
  const base = mesh(new THREE.BoxGeometry(0.24, 0.01, 0.1), mat('#ffffff'), 0, 0.005, 0);
  const stripe = mesh(new THREE.BoxGeometry(0.24, 0.012, 0.025), mat(color), 0, 0.006, -0.035);
  const stub = mesh(new THREE.BoxGeometry(0.05, 0.012, 0.1), mat('#eeeeee'), 0.095, 0.006, 0);
  return group(base, stripe, stub);
}

function scale(color: string) {
  const platform = mesh(new THREE.BoxGeometry(0.5, 0.06, 0.5), mat(color), 0, 0.03, 0);
  const post = mesh(new THREE.BoxGeometry(0.05, 0.35, 0.05), mat('#555555'), 0.18, 0.235, -0.18);
  const display = mesh(new THREE.BoxGeometry(0.14, 0.1, 0.03), mat('#1a1a1a'), 0.18, 0.46, -0.18);
  const readout = mesh(new THREE.BoxGeometry(0.1, 0.05, 0.005), mat('#7cff6b', { emissive: '#2fbf3f', emissiveIntensity: 0.6 }), 0.18, 0.46, -0.163);
  return group(platform, post, display, readout);
}

function fallback(color: string) {
  return mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), mat(color), 0, 0.2, 0);
}

const BUILDERS: Record<string, (color: string) => THREE.Object3D> = {
  desk,
  chair,
  book,
  pencil,
  blackboard,
  backpack,
  airplane,
  gate,
  suitcase,
  passport,
  runway,
  cup,
  table: cafeTable,
  menu,
  juice,
  cake,
  ticket,
  counter,
  luggage,
  boardingpass,
  scale,
};

export function buildHotspotObject(hotspot: { id: string; color: string; position: [number, number, number] }): THREE.Group {
  const g = new THREE.Group();
  const builder = BUILDERS[hotspot.id] ?? fallback;
  g.add(builder(hotspot.color));
  g.position.set(...hotspot.position);
  g.traverse((o) => {
    o.userData.hotspotId = hotspot.id;
    if (o instanceof THREE.Mesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  return g;
}
