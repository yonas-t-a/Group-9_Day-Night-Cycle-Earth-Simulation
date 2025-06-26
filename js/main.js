// earth-simulation/main.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Scene and Camera (define these first!)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('webglCanvas'),
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const loader = new THREE.TextureLoader();
const earthDayMap = loader.load('./assets/textures/earth_day.jpg');
const earthNightMap = loader.load('./assets/textures/earth_night.jpg');
const bumpMap = loader.load('./assets/textures/earth_bump.jpg');
const cloudMap = loader.load('./assets/textures/earth_clouds.jpg'); // Use .jpg as in your example

const sunTexture = loader.load(
  './assets/textures/sun.jpg',
  () => console.log('✅ Sun texture loaded'),
  undefined,
  (error) => console.error('❌ Failed to load sun texture:', error)
);

// Earth
const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
const earthMaterial = new THREE.MeshPhongMaterial({
  map: earthDayMap,
  bumpMap: bumpMap,
  bumpScale: 0.05,
  specular: new THREE.Color('grey'),
  shininess: 5,
  emissiveMap: earthNightMap,
  emissiveIntensity: 1.5,
  emissive: new THREE.Color(0xffffff)
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.name = 'Earth';
scene.add(earth);

// Clouds
const cloudGeometry = new THREE.SphereGeometry(2.02, 64, 64);
const cloudMaterial = new THREE.MeshPhongMaterial({
  map: cloudMap,
  transparent: true,
  opacity: 0.4,
  depthWrite: false
});
const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
scene.add(clouds);

// Lighting
const ambientLight = new THREE.AmbientLight(0x111111);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

// Sun
const sunGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({
  map: sunTexture,
  emissiveMap: sunTexture,
  emissive: new THREE.Color(0xffaa33),
  emissiveIntensity: 1.5
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(8, 0, 0);
scene.add(sun);

// Sunlight (improve intensity and range)
const sunlight = new THREE.PointLight(0xffee88, 3, 1000);
sunlight.position.copy(sun.position);
sunlight.castShadow = true;
scene.add(sunlight);

// (Optional) Enable shadow casting/receiving for objects
renderer.shadowMap.enabled = true;
sun.castShadow = false;
earth.castShadow = true;
earth.receiveShadow = true;
clouds.castShadow = false;
clouds.receiveShadow = true;

// Moon (move this up before referencing moon)
const moonGeometry = new THREE.SphereGeometry(0.27, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.name = 'Moon';
scene.add(moon);

// Now you can safely set moon's shadow properties
moon.castShadow = true;
moon.receiveShadow = true;

// Satellite
let satelliteModel = null;
const gltfLoader = new GLTFLoader();
gltfLoader.load(
  './assets/models/Satellite.glb',
  (gltf) => {
    satelliteModel = gltf.scene;
    satelliteModel.scale.set(0.03, 0.03, 0.03);
    satelliteModel.name = 'Satellite';
    scene.add(satelliteModel);
  },
  undefined,
  (error) => {
    console.error('Error loading satellite model:', error);
  }
);

// 🌌 Starfield
function addStarField(count = 1000) {
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = [];

  for (let i = 0; i < count; i++) {
    const x = THREE.MathUtils.randFloatSpread(200);
    const y = THREE.MathUtils.randFloatSpread(200);
    const z = THREE.MathUtils.randFloatSpread(200);
    starPositions.push(x, y, z);
  }

  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));

  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5,
    sizeAttenuation: true
  });

  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}

addStarField();

// ⭐ Interactions
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let moonOrbitEnabled = true;

// Hover on satellite: highlight
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  if (!satelliteModel) return;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(satelliteModel, true);

  satelliteModel.traverse((child) => {
    if (child.isMesh) {
      child.material.color.set(intersects.length > 0 ? 0xff0000 : 0xffffff);
    }
  });
});

// Click on moon: toggle orbit
window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(moon);

  if (intersects.length > 0) {
    moonOrbitEnabled = !moonOrbitEnabled;
    console.log('🌙 Moon orbit', moonOrbitEnabled ? 'resumed' : 'paused');
  }
});

// 🎬 Animation
let moonAngle = 0;
let satAngle = 0;

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const animate = () => {
  requestAnimationFrame(animate);

  earth.rotation.y += 0.001;
  clouds.rotation.y += 0.0012;

  // Moon orbit
  if (moonOrbitEnabled) {
    moonAngle += 0.002;
  }

  moon.position.set(
    earth.position.x + Math.cos(moonAngle) * 3,
    0,
    earth.position.z + Math.sin(moonAngle) * 3
  );

  // Satellite orbit
  if (satelliteModel) {
    satAngle += 0.005;
    satelliteModel.position.set(
      earth.position.x + Math.sin(satAngle) * 4,
      Math.sin(satAngle) * 1,
      earth.position.z + Math.cos(satAngle) * 4
    );
    satelliteModel.rotation.y += 0.01;
  }

  controls.update();
  renderer.render(scene, camera);
};

animate();
