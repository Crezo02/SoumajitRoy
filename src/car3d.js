import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PAINTS = {
  rosso: { color: 0xd91424, metalness: 0.55, roughness: 0.16, clearcoat: 1.0 },
  nero: { color: 0x151821, metalness: 0.72, roughness: 0.18, clearcoat: 1.0 },
  blu: { color: 0x0b3b8c, metalness: 0.65, roughness: 0.16, clearcoat: 1.0 },
  bianco: { color: 0xe9ecf2, metalness: 0.35, roughness: 0.14, clearcoat: 1.0 },
};

function createStudioEnvironment(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x0a0a0c);

  // Clean automotive photography softbox strips
  const stripMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const warmMat = new THREE.MeshBasicMaterial({ color: 0xf7efe4 });
  const silverMat = new THREE.MeshBasicMaterial({ color: 0xd8dee9 });

  const strip1 = new THREE.Mesh(new THREE.PlaneGeometry(18, 1.5), stripMat);
  strip1.position.set(0, 8, 0);
  strip1.rotation.x = Math.PI / 2;
  envScene.add(strip1);

  const strip2 = new THREE.Mesh(new THREE.PlaneGeometry(14, 0.9), silverMat);
  strip2.position.set(-6, 6.5, -5);
  strip2.lookAt(0, 0, 0);
  envScene.add(strip2);

  const strip3 = new THREE.Mesh(new THREE.PlaneGeometry(14, 0.9), warmMat);
  strip3.position.set(6, 5.5, 5);
  strip3.lookAt(0, 0, 0);
  envScene.add(strip3);

  const strip4 = new THREE.Mesh(new THREE.PlaneGeometry(10, 1.1), warmMat);
  strip4.position.set(0, 4, 8);
  strip4.lookAt(0, 0, 0);
  envScene.add(strip4);

  const rt = pmrem.fromScene(envScene, 0.04);
  pmrem.dispose();
  return rt.texture;
}

function buildWheel(radius, width, rimMat, tireMat, discMat, caliperMat, isLeft) {
  const group = new THREE.Group();
  const spinGroup = new THREE.Group();

  // Tire
  const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 40, 1, false);
  tireGeo.rotateZ(Math.PI / 2);
  const tire = new THREE.Mesh(tireGeo, tireMat);
  spinGroup.add(tire);

  // Tire sidewall bevel rings
  const sideGeo = new THREE.TorusGeometry(radius * 0.86, radius * 0.14, 14, 40);
  sideGeo.rotateY(Math.PI / 2);
  const sideOuter = new THREE.Mesh(sideGeo, tireMat);
  sideOuter.position.x = isLeft ? width * 0.42 : -width * 0.42;
  spinGroup.add(sideOuter);

  // Recessed barrel
  const barrelGeo = new THREE.CylinderGeometry(radius * 0.72, radius * 0.72, width * 0.92, 32, 1, true);
  barrelGeo.rotateZ(Math.PI / 2);
  const barrel = new THREE.Mesh(barrelGeo, rimMat);
  spinGroup.add(barrel);

  // 10-spoke forged Y-pattern alloy rim
  const hubGeo = new THREE.CylinderGeometry(radius * 0.16, radius * 0.18, width * 0.45, 20);
  hubGeo.rotateZ(Math.PI / 2);
  const hub = new THREE.Mesh(hubGeo, rimMat);
  hub.position.x = isLeft ? width * 0.25 : -width * 0.25;
  spinGroup.add(hub);

  const centerLock = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.08, radius * 0.08, width * 0.52, 12),
    caliperMat
  );
  centerLock.rotation.z = Math.PI / 2;
  centerLock.position.x = isLeft ? width * 0.28 : -width * 0.28;
  spinGroup.add(centerLock);

  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2;
    const spokeGeo = new THREE.BoxGeometry(width * 0.1, radius * 0.58, radius * 0.055);
    const spoke = new THREE.Mesh(spokeGeo, rimMat);
    const rMid = radius * 0.42;
    spoke.position.set(
      isLeft ? width * 0.36 : -width * 0.36,
      Math.cos(angle) * rMid,
      Math.sin(angle) * rMid
    );
    spoke.rotation.x = angle;
    spinGroup.add(spoke);
  }

  // Cross-drilled carbon-ceramic brake disc
  const discGeo = new THREE.CylinderGeometry(radius * 0.58, radius * 0.58, 0.035, 32);
  discGeo.rotateZ(Math.PI / 2);
  const disc = new THREE.Mesh(discGeo, discMat);
  disc.position.x = isLeft ? width * 0.12 : -width * 0.12;
  spinGroup.add(disc);

  group.add(spinGroup);

  // Fixed Brembo-style brake caliper (does not spin with wheel)
  const caliperGeo = new THREE.BoxGeometry(0.11, radius * 0.38, radius * 0.24);
  const caliper = new THREE.Mesh(caliperGeo, caliperMat);
  caliper.position.set(isLeft ? width * 0.14 : -width * 0.14, radius * 0.24, -radius * 0.28);
  caliper.rotation.x = 0.65;
  group.add(caliper);

  return { group, spinGroup };
}

function buildHypercar() {
  const car = new THREE.Group();

  const paintMat = new THREE.MeshPhysicalMaterial({
    color: PAINTS.rosso.color,
    metalness: PAINTS.rosso.metalness,
    roughness: PAINTS.rosso.roughness,
    clearcoat: PAINTS.rosso.clearcoat,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.45,
  });

  const carbonMat = new THREE.MeshPhysicalMaterial({
    color: 0x11141b,
    metalness: 0.45,
    roughness: 0.32,
    clearcoat: 0.65,
    clearcoatRoughness: 0.18,
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x070a10,
    metalness: 0.1,
    roughness: 0.05,
    clearcoat: 1.0,
    opacity: 0.86,
    transparent: true,
    envMapIntensity: 1.8,
  });

  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    metalness: 0.92,
    roughness: 0.18,
  });

  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x121318,
    metalness: 0.05,
    roughness: 0.85,
  });

  const discMat = new THREE.MeshStandardMaterial({
    color: 0x525866,
    metalness: 0.85,
    roughness: 0.35,
  });

  const caliperMat = new THREE.MeshStandardMaterial({
    color: 0xff2e4c,
    metalness: 0.4,
    roughness: 0.25,
    emissive: 0x330008,
  });

  const drlMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xe6f4ff,
    emissiveIntensity: 2.8,
    roughness: 0.1,
  });

  const tailMat = new THREE.MeshStandardMaterial({
    color: 0xff1e3c,
    emissive: 0xff1e3c,
    emissiveIntensity: 3.4,
    roughness: 0.15,
  });

  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xff2e4c,
    emissive: 0xff2e4c,
    emissiveIntensity: 1.6,
    roughness: 0.2,
  });

  // 1. Sculpted Hypercar Lower Body Profile (extruded along X)
  const bodyShape = new THREE.Shape();
  bodyShape.moveTo(-2.32, 0.24); // front splitter tip
  bodyShape.lineTo(-2.15, 0.42); // front nose
  bodyShape.quadraticCurveTo(-1.55, 0.7, -0.85, 0.72); // front fender arch
  bodyShape.quadraticCurveTo(-0.35, 0.74, 0.2, 0.78); // door beltline
  bodyShape.quadraticCurveTo(0.95, 0.86, 1.75, 0.84); // rear haunch
  bodyShape.lineTo(2.22, 0.76); // rear decklid
  bodyShape.lineTo(2.26, 0.34); // rear fascia
  bodyShape.lineTo(2.05, 0.22); // rear diffuser
  bodyShape.lineTo(-2.32, 0.22); // undertray

  const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
    depth: 1.88,
    bevelEnabled: true,
    bevelThickness: 0.14,
    bevelSize: 0.1,
    bevelSegments: 6,
    curveSegments: 24,
  });
  bodyGeo.translate(0, 0, -0.94);
  bodyGeo.rotateY(Math.PI / 2); // align car length along Z (+Z front or -Z front)
  // Let's orient: -Z = front, +Z = rear
  bodyGeo.rotateY(Math.PI);
  // Wait: let's keep X = width, Y = up, Z = length (-Z = front, +Z = rear)
  const mainBody = new THREE.Mesh(bodyGeo, paintMat);
  car.add(mainBody);

  // Actually let's double check orientation of ExtrudeGeometry:
  // Original shape was in XY: X = -2.32 (front) to +2.26 (rear), extruded along Z (-0.94..+0.94).
  // Rotating Y by -PI/2 maps X -> +Z, Z -> +X. Rotating Y by +PI/2 maps X -> -Z, Z -> -X.
  // Above we did rotateY(PI/2) then rotateY(PI) = rotateY(3PI/2) = rotateY(-PI/2), so X=-2.32 mapped to Z=+2.32!
  // Let's normalize cleanly by resetting mainBody rotation:
  mainBody.rotation.y = Math.PI; // Now -2.32 is at Z = -2.32 (front), +2.26 is at Z = +2.26 (rear)

  // 2. Carbon-Fiber Undertray, Front Splitter & Side Skirts
  const splitter = new THREE.Mesh(new THREE.BoxGeometry(2.02, 0.05, 0.55), carbonMat);
  splitter.position.set(0, 0.19, -2.18);
  car.add(splitter);

  const floorTray = new THREE.Mesh(new THREE.BoxGeometry(1.98, 0.06, 4.3), carbonMat);
  floorTray.position.set(0, 0.2, 0.0);
  car.add(floorTray);

  [-0.99, 0.99].forEach((x) => {
    const skirt = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 2.2), carbonMat);
    skirt.position.set(x, 0.24, 0.0);
    car.add(skirt);

    // Side air intake scoop
    const intake = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.34, 0.9), carbonMat);
    intake.position.set(x * 0.94, 0.56, 0.55);
    car.add(intake);
  });

  // 3. Teardrop Glass Cockpit Canopy
  const canopyShape = new THREE.Shape();
  canopyShape.moveTo(-0.98, 0.68);
  canopyShape.quadraticCurveTo(-0.42, 1.13, 0.18, 1.12);
  canopyShape.quadraticCurveTo(0.88, 1.09, 1.38, 0.8);
  canopyShape.lineTo(-0.98, 0.68);

  const canopyGeo = new THREE.ExtrudeGeometry(canopyShape, {
    depth: 1.24,
    bevelEnabled: true,
    bevelThickness: 0.12,
    bevelSize: 0.08,
    bevelSegments: 5,
    curveSegments: 20,
  });
  canopyGeo.translate(0, 0, -0.62);
  canopyGeo.rotateY(-Math.PI / 2);
  const canopy = new THREE.Mesh(canopyGeo, glassMat);
  car.add(canopy);

  // Roofline spine
  const roofSpine = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.04, 1.35), paintMat);
  roofSpine.position.set(0, 1.13, 0.15);
  car.add(roofSpine);

  // Side mirrors
  [-1.06, 1.06].forEach((x) => {
    const stalk = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, 0.06), carbonMat);
    stalk.position.set(x * 0.92, 0.78, -0.58);
    car.add(stalk);
    const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.12), paintMat);
    mirror.position.set(x, 0.82, -0.56);
    car.add(mirror);
  });

  // 4. Rear V12 Hybrid Engine Bay & Louvres
  const engineBay = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.16, 1.05), carbonMat);
  engineBay.position.set(0, 0.78, 1.35);
  car.add(engineBay);

  const engineCore = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.08, 0.75), coreMat);
  engineCore.position.set(0, 0.82, 1.35);
  car.add(engineCore);

  for (let i = 0; i < 4; i++) {
    const louvre = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.025, 0.12), carbonMat);
    louvre.position.set(0, 0.88 - i * 0.015, 1.02 + i * 0.22);
    louvre.rotation.x = 0.22;
    car.add(louvre);
  }

  // 5. Active Rear Aero Wing (actuates dynamically on scroll speed!)
  const aeroWingGroup = new THREE.Group();
  aeroWingGroup.position.set(0, 0.86, 2.08);

  const wingBlade = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.045, 0.34), carbonMat);
  wingBlade.position.set(0, 0.16, 0.04);
  aeroWingGroup.add(wingBlade);

  [-0.94, 0.94].forEach((x) => {
    const endplate = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.18, 0.42), paintMat);
    endplate.position.set(x, 0.14, 0.04);
    aeroWingGroup.add(endplate);
  });

  [-0.45, 0.45].forEach((x) => {
    const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.2, 0.14), carbonMat);
    pylon.position.set(x, 0.06, -0.02);
    aeroWingGroup.add(pylon);
  });
  car.add(aeroWingGroup);

  // 6. Rear Diffuser + Quad Chrome Exhausts
  const diffuser = new THREE.Mesh(new THREE.BoxGeometry(1.86, 0.16, 0.28), carbonMat);
  diffuser.position.set(0, 0.25, 2.22);
  car.add(diffuser);

  for (let i = -2; i <= 2; i++) {
    if (i === 0) continue;
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.18, 0.32), carbonMat);
    fin.position.set(i * 0.36, 0.24, 2.26);
    car.add(fin);
  }

  [-0.64, -0.48, 0.48, 0.64].forEach((x) => {
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.14, 16), rimMat);
    pipe.rotation.x = Math.PI / 2;
    pipe.position.set(x, 0.34, 2.3);
    car.add(pipe);
  });

  // 7. LED DRL Headlights & Twin Circular Halo Taillights
  [-0.72, 0.72].forEach((x) => {
    const drl = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.04, 0.46), drlMat);
    drl.position.set(x, 0.53, -2.02);
    drl.rotation.y = x < 0 ? -0.24 : 0.24;
    drl.rotation.x = 0.22;
    car.add(drl);

    // Rear circular halo taillight
    const tailRing = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.028, 12, 24), tailMat);
    tailRing.position.set(x, 0.65, 2.29);
    car.add(tailRing);
  });

  // 8. Four Wheel Assemblies
  const wheelCoords = [
    { x: -0.96, y: 0.36, z: -1.42, r: 0.36, w: 0.28, left: true },
    { x: 0.96, y: 0.36, z: -1.42, r: 0.36, w: 0.28, left: false },
    { x: -0.98, y: 0.39, z: 1.38, r: 0.39, w: 0.34, left: true },
    { x: 0.98, y: 0.39, z: 1.38, r: 0.39, w: 0.34, left: false },
  ];

  const wheels = wheelCoords.map((wc) => {
    const w = buildWheel(wc.r, wc.w, rimMat, tireMat, discMat, caliperMat, wc.left);
    w.group.position.set(wc.x, wc.y, wc.z);
    car.add(w.group);
    return w;
  });

  return { car, paintMat, aeroWingGroup, wheels, drlMat, tailMat };
}

export function initCar3D(reducedMotion = false) {
  const canvas = document.getElementById('car3dCanvas');
  if (!canvas) return null;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.65;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0c, 0.028);
  scene.environment = createStudioEnvironment(renderer);

  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(4.1, 1.65, -4.4);

  // Clean Photographic Studio Lighting
  const ambient = new THREE.AmbientLight(0xf5f3ee, 0.72);
  scene.add(ambient);

  const keyLight = new THREE.SpotLight(0xfffaf2, 105, 38, Math.PI / 3.2, 0.65, 1.2);
  keyLight.position.set(4.5, 8.5, -4.5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.bias = -0.0005;
  keyLight.shadow.radius = 4;
  scene.add(keyLight);

  const frontFill = new THREE.DirectionalLight(0xf4f6fa, 1.5);
  frontFill.position.set(-2, 3.5, -6);
  scene.add(frontFill);

  const rimWarm = new THREE.PointLight(0xf5eadb, 22, 20, 1.4);
  rimWarm.position.set(-4.5, 2.2, 4.2);
  scene.add(rimWarm);

  const rimCool = new THREE.PointLight(0xe2e8f0, 22, 20, 1.4);
  rimCool.position.set(4.8, 2.2, -3.5);
  scene.add(rimCool);

  // Matte Obsidian Studio Floor + Subtle Architectural Grid
  const floorGeo = new THREE.CircleGeometry(24, 64);
  floorGeo.rotateX(-Math.PI / 2);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a0c,
    metalness: 0.78,
    roughness: 0.28,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.receiveShadow = true;
  scene.add(floor);

  const grid = new THREE.PolarGridHelper(12, 16, 8, 64, 0x2c2c34, 0x18181d);
  grid.position.y = 0.004;
  grid.material.opacity = 0.18;
  grid.material.transparent = true;
  scene.add(grid);

  // Subtle neutral airflow streamlines
  const particleCount = 120;
  const pPos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 4.5;
    pPos[i * 3 + 1] = 0.2 + Math.random() * 1.8;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 14;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0xdcd9d0,
    size: 0.025,
    transparent: true,
    opacity: 0.22,
  });
  const aeroParticles = new THREE.Points(pGeo, pMat);
  scene.add(aeroParticles);

  // Build fallback hypercar immediately, then swap in real Ferrari LaFerrari GLB
  const fallback = buildHypercar();
  const activeRoot = new THREE.Group();
  activeRoot.add(fallback.car);
  scene.add(activeRoot);

  let activePaintMats = [fallback.paintMat];
  let activeDrlMats = [fallback.drlMat];
  let activeWheelNodes = fallback.wheels.map((w) => w.spinGroup);
  let activeAeroWing = fallback.aeroWingGroup;

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/draco/');
  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);

  gltfLoader.load(
    '/models/ferrari_laferrari.glb',
    (gltf) => {
      const model = gltf.scene;

      // Normalize scale (~4.7m length) and ground at y = 0
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const scale = 4.7 / maxDim;
      model.scale.setScalar(scale);

      const scaledBox = new THREE.Box3().setFromObject(model);
      const center = scaledBox.getCenter(new THREE.Vector3());
      model.position.set(-center.x, -scaledBox.min.y, -center.z);

      const glbPaintMats = [];
      const glbDrlMats = [];
      const glbWheels = [];

      model.traverse((obj) => {
        if (obj.isMesh) {
          obj.castShadow = true;
          obj.receiveShadow = true;
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => {
            if (!m) return;
            const mName = (m.name || '').toLowerCase();
            const oName = (obj.name || '').toLowerCase();
            if (m.isMeshStandardMaterial || m.isMeshPhysicalMaterial) {
              m.envMapIntensity = Math.max(m.envMapIntensity || 1, 1.45);
            }
            // Detect car body paint materials
            const isRedHue = m.color && m.color.r > 0.35 && m.color.g < 0.2 && m.color.b < 0.2;
            if (
              mName.includes('paint') ||
              mName.includes('body') ||
              mName.includes('car') ||
              mName.includes('rosso') ||
              oName.includes('body') ||
              isRedHue
            ) {
              if (!glbPaintMats.includes(m)) glbPaintMats.push(m);
            }
            // Detect headlights / DRL
            if (
              mName.includes('headlight') ||
              mName.includes('drl') ||
              mName.includes('lamp') ||
              oName.includes('headlight') ||
              oName.includes('light_front')
            ) {
              if (!glbDrlMats.includes(m)) glbDrlMats.push(m);
            }
          });
        }
        const n = (obj.name || '').toLowerCase();
        if (
          (n.includes('wheel') || n.includes('rim') || n.includes('tire') || n.includes('tyre')) &&
          obj.children.length > 0
        ) {
          glbWheels.push(obj);
        }
      });

      // Swap fallback out with smooth scale reveal
      activeRoot.remove(fallback.car);
      activeRoot.add(model);
      if (glbPaintMats.length) activePaintMats = glbPaintMats;
      if (glbDrlMats.length) activeDrlMats = glbDrlMats;
      if (glbWheels.length) activeWheelNodes = glbWheels;
      activeAeroWing = null;

      if (!reducedMotion) {
        model.scale.setScalar(scale * 0.94);
        gsap.to(model.scale, {
          x: scale,
          y: scale,
          z: scale,
          duration: 0.9,
          ease: 'power3.out',
        });
      }
    },
    undefined,
    () => {
      // Keep procedural fallback if GLB fails to load
    }
  );

  // Camera Choreography State driven by GSAP ScrollTrigger
  // Vector math keeps (C - T) · Right > 0 so the car sits clearly in the open right viewport
  const camRig = {
    x: 4.3,
    y: 1.42,
    z: -4.3,
    tx: 1.15,
    ty: 0.36,
    tz: 0.95,
    carRotY: -0.25,
    wingLift: 0,
  };

  if (!reducedMotion) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.1,
      },
    });

    tl.to(camRig, {
      x: 5.4,
      y: 1.85,
      z: 0.4,
      tx: 0.0,
      ty: 0.42,
      tz: 1.45,
      carRotY: 0.25,
      wingLift: 1,
      ease: 'none',
    })
      .to(camRig, {
        x: 3.4,
        y: 1.55,
        z: 4.8,
        tx: -1.35,
        ty: 0.45,
        tz: 0.9,
        carRotY: 0.85,
        wingLift: 1,
        ease: 'none',
      })
      .to(camRig, {
        x: -4.0,
        y: 1.35,
        z: 3.8,
        tx: -1.05,
        ty: 0.42,
        tz: -1.15,
        carRotY: 1.65,
        wingLift: 0.4,
        ease: 'none',
      })
      .to(camRig, {
        x: 0.2,
        y: 3.2,
        z: -5.0,
        tx: 0,
        ty: 0.42,
        tz: 0,
        carRotY: Math.PI * 1.15,
        wingLift: 0,
        ease: 'none',
      });
  }

  // Pointer parallax + scroll velocity tracking
  let mouseX = 0;
  let mouseY = 0;
  let scrollBoost = 0;
  let lastScroll = window.scrollY;
  let headlightsOn = true;

  window.addEventListener(
    'pointermove',
    (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.45;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.22;
    },
    { passive: true }
  );

  window.addEventListener(
    'scroll',
    () => {
      const delta = Math.abs(window.scrollY - lastScroll);
      lastScroll = window.scrollY;
      scrollBoost = Math.min(1.6, scrollBoost + delta * 0.008);
    },
    { passive: true }
  );

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onResize);

  let lastTime = performance.now();
  const animate = (now) => {
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    scrollBoost *= 0.93;

    // Spin wheels & flow wind-tunnel particles
    const wheelSpeed = (0.8 + scrollBoost * 7.5) * dt;
    activeWheelNodes.forEach((w) => {
      w.rotation.x -= wheelSpeed;
    });

    const posAttr = pGeo.getAttribute('position');
    const flowSpeed = (2.8 + scrollBoost * 16) * dt;
    for (let i = 0; i < particleCount; i++) {
      let z = posAttr.getZ(i) + flowSpeed;
      if (z > 7) z = -7;
      posAttr.setZ(i, z);
    }
    posAttr.needsUpdate = true;

    // Active rear aero wing actuation (for procedural fallback)
    if (activeAeroWing) {
      const aeroTarget = Math.min(1, camRig.wingLift * 0.5 + scrollBoost * 0.7);
      activeAeroWing.position.y = 0.86 + aeroTarget * 0.14;
      activeAeroWing.rotation.x = aeroTarget * 0.24;
    }

    // Update car & camera
    activeRoot.rotation.y = camRig.carRotY;
    grid.rotation.y = camRig.carRotY * 0.5;

    camera.position.set(
      camRig.x + mouseX,
      Math.max(0.55, camRig.y - mouseY),
      camRig.z
    );
    camera.lookAt(camRig.tx, camRig.ty, camRig.tz);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  if (!reducedMotion) {
    requestAnimationFrame(animate);
  } else {
    camera.position.set(camRig.x, camRig.y, camRig.z);
    camera.lookAt(camRig.tx, camRig.ty, camRig.tz);
    renderer.render(scene, camera);
  }

  return {
    setPaint(key) {
      const spec = PAINTS[key];
      if (!spec) return;
      activePaintMats.forEach((mat) => {
        if (mat.color) {
          gsap.to(mat.color, {
            r: ((spec.color >> 16) & 255) / 255,
            g: ((spec.color >> 8) & 255) / 255,
            b: (spec.color & 255) / 255,
            duration: 0.55,
            ease: 'power2.out',
          });
        }
        if ('metalness' in mat) mat.metalness = spec.metalness;
        if ('roughness' in mat) mat.roughness = spec.roughness;
      });
    },
    toggleLights() {
      headlightsOn = !headlightsOn;
      activeDrlMats.forEach((mat) => {
        if ('emissiveIntensity' in mat) {
          mat.emissiveIntensity = headlightsOn ? 2.8 : 0.05;
        }
      });
      return headlightsOn;
    },
  };
}
