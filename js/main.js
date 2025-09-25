/**
 * SISTEMA DE ANIMACIONES 3D CON THREE.JS
 * =====================================
 * 
 * Desarrollado por: Jezrael Jared Gómez Torres
 * 
 * Este sistema permite cargar un personaje 3D base y aplicar múltiples animaciones
 * con transiciones suaves entre ellas.
 * 
 * ESTRUCTURA:
 * - 1 Personaje base: "Catwalk Walk Turn 180 Tight.fbx" (contiene la malla del personaje)
 * - 4 Animaciones adicionales: Capoeira, Jumping Down (1), Jumping Down, Sitting Laughing
 * 
 * CONTROLES:
 * - Teclas 1-5: Cambiar entre animaciones
 * - Panel GUI: Selección manual de animaciones
 */

import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

// ========================================
// CONFIGURACIÓN Y VARIABLES GLOBALES
// ========================================

const manager = new THREE.LoadingManager();

// Variables principales de Three.js
let camera, scene, renderer, stats, object, loader, guiMorphsFolder;
let mixer; // Mezclador de animaciones

const clock = new THREE.Clock();

// Configuración de parámetros para el GUI
const params = {
  asset: "Capoeira", // Animación por defecto
};

// Lista de todas las animaciones disponibles
const assets = [
  "Capoeira",                  // Animación de capoeira
  "Dying",                    // Animación de muerte
  "Jumping Down",             // Animación de salto
  "Sitting Laughing",         // Animación de risa sentado
  "Angry"                     // Animación de enojo
];

// Mapeo de teclas del teclado a animaciones
const keyToAnimation = {
  '1': "Capoeira",              // Tecla 1: Capoeira
  '2': "Dying",                // Tecla 2: Muerte
  '3': "Jumping Down",          // Tecla 3: Salto
  '4': "Sitting Laughing",     // Tecla 4: Risa sentado
  '5': "Angry"                 // Tecla 5: Enojo
};

// Variables para control de animaciones
let currentAction = null;    // Animación actualmente reproduciéndose
let previousAction = null;  // Animación anterior
let characterLoaded = false; // Flag para saber si el personaje base está cargado
let allAnimations = {};     // Objeto que almacena todas las animaciones cargadas

// ========================================
// FUNCIÓN PRINCIPAL DE INICIALIZACIÓN
// ========================================

init();

function init() {
  console.log("🎬 Iniciando sistema de animaciones 3D...");
  
  // Crear contenedor principal
  const container = document.createElement("div");
  document.body.appendChild(container);

  // Configurar cámara
  setupCamera();
  
  // Configurar escena
  setupScene();
  
  // Configurar iluminación
  setupLighting();
  
  // Crear suelo y grid
  setupEnvironment();
  
  // Configurar renderer
  setupRenderer(container);
  
  // Configurar controles de cámara
  setupControls();
  
  // Configurar eventos
  setupEvents();
  
  // Configurar estadísticas
  setupStats(container);
  
  // Configurar interfaz GUI
  setupGUI();
  
  // Cargar el personaje base
  loadCharacterBase();
}

// ========================================
// CONFIGURACIÓN DE LA CÁMARA
// ========================================

function setupCamera() {
  camera = new THREE.PerspectiveCamera(
    45,                                    // Campo de visión
    window.innerWidth / window.innerHeight, // Aspecto
    1,                                     // Plano cercano
    2000                                   // Plano lejano
  );
  camera.position.set(0, 100, 200); // Posición inicial de la cámara (más cerca y centrada)
}

// ========================================
// CONFIGURACIÓN DE LA ESCENA
// ========================================

function setupScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0); // Color de fondo gris
  scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000); // Niebla para profundidad
}

// ========================================
// CONFIGURACIÓN DE ILUMINACIÓN
// ========================================

function setupLighting() {
  // Luz ambiental (hemisférica)
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 5);
  hemiLight.position.set(0, 200, 0);
  scene.add(hemiLight);

  // Luz direccional principal
  const dirLight = new THREE.DirectionalLight(0xffffff, 5);
  dirLight.position.set(0, 200, 100);
  dirLight.castShadow = true;
  
  // Configurar sombras
  dirLight.shadow.camera.top = 180;
  dirLight.shadow.camera.bottom = -100;
  dirLight.shadow.camera.left = -120;
  dirLight.shadow.camera.right = 120;
  scene.add(dirLight);
}

// ========================================
// CONFIGURACIÓN DEL ENTORNO
// ========================================

function setupEnvironment() {
  // Crear suelo
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2000, 2000),
    new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);

  // Crear grid de referencia
  const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  scene.add(grid);
}

// ========================================
// CONFIGURACIÓN DEL RENDERER
// ========================================

function setupRenderer(container) {
  loader = new FBXLoader(manager);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);
}

// ========================================
// CONFIGURACIÓN DE CONTROLES
// ========================================

function setupControls() {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 50, 0); // Target más bajo para centrar en el personaje
  controls.update();
}

// ========================================
// CONFIGURACIÓN DE EVENTOS
// ========================================

function setupEvents() {
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("keydown", onKeyDown);
}

// ========================================
// CONFIGURACIÓN DE ESTADÍSTICAS
// ========================================

function setupStats(container) {
  stats = new Stats();
  container.appendChild(stats.dom);
}

// ========================================
// CONFIGURACIÓN DE INTERFAZ GUI
// ========================================

function setupGUI() {
  const gui = new GUI();
  
  // Selector de animaciones
  gui.add(params, "asset", assets).onChange(function (value) {
    console.log(`🎭 Cambiando a animación: ${value}`);
    playAnimationByName(value);
  });

  guiMorphsFolder = gui.addFolder("Morphs").hide();
}

// ========================================
// CARGA DEL PERSONAJE BASE
// ========================================

function loadCharacterBase() {
  console.log("👤 Cargando personaje base (Erika Archer)...");
  
  // Detectar la ruta base para GitHub Pages
  const basePath = window.location.pathname.includes('/-threejs-3d-model-personalized') 
    ? '/-threejs-3d-model-personalized' 
    : '.';
  
  // Cargar el personaje base con su animación inicial
  loader.load(`${basePath}/models/character_animations/Erika Archer.fbx`, function (group) {
    console.log("✅ Personaje base cargado exitosamente");
    
    // Limpiar objeto anterior si existe
    if (object) {
      disposeObject(object);
      scene.remove(object);
    }

    object = group;
    characterLoaded = true;

    // Configurar el personaje
    setupCharacter();
    
    // Cargar animaciones adicionales
    loadAdditionalAnimations();
  });
}

// ========================================
// CONFIGURACIÓN DEL PERSONAJE
// ========================================

function setupCharacter() {
    if (object.animations && object.animations.length) {
      mixer = new THREE.AnimationMixer(object);

    // Crear acción para la animación base de Erika
    const baseAction = mixer.clipAction(object.animations[0]);
    allAnimations["Erika Archer"] = baseAction;
    
    // Reproducir animación base temporalmente
    currentAction = baseAction;
    currentAction.play();
    
    console.log("🎬 Personaje base iniciado - esperando animaciones adicionales...");
  }

  // Configurar sombras y morfos
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

      // Configurar morfos si existen
        if (child.morphTargetDictionary) {
          guiMorphsFolder.show();
          const meshFolder = guiMorphsFolder.addFolder(
            child.name || child.uuid
          );
          Object.keys(child.morphTargetDictionary).forEach((key) => {
            meshFolder.add(
              child.morphTargetInfluences,
              child.morphTargetDictionary[key],
              0,
              1,
              0.01
            );
          });
        }
      }
    });

    scene.add(object);
}

// ========================================
// CARGA DE ANIMACIONES ADICIONALES
// ========================================

function loadAdditionalAnimations() {
  console.log("🎭 Cargando animaciones adicionales...");
  
  // Detectar la ruta base para GitHub Pages
  const basePath = window.location.pathname.includes('/-threejs-3d-model-personalized') 
    ? '/-threejs-3d-model-personalized' 
    : '.';
  
  const animationFiles = [
    "Capoeira",
    "Dying",
    "Jumping Down",
    "Sitting Laughing",
    "Angry"
  ];

  let loadedCount = 0;
  
  animationFiles.forEach((animationName, index) => {
    loader.load(`${basePath}/models/animations_only/${animationName}.fbx`, function (group) {
      console.log(`✅ Animación cargada: ${animationName}`);
      
      // Extraer la animación del grupo
      if (group.animations && group.animations.length > 0) {
        const clip = group.animations[0];
        clip.name = animationName; // Asegurar nombre correcto
        
        // Crear acción y almacenarla
        const action = mixer.clipAction(clip);
        allAnimations[animationName] = action;
        
        // Si es Capoeira, cambiar automáticamente a esa animación
        if (animationName === "Capoeira") {
          console.log("🎭 Cambiando automáticamente a Capoeira...");
          playAnimationByName("Capoeira");
        }
        
        loadedCount++;
        
        if (loadedCount === animationFiles.length) {
          console.log("🎉 Todas las animaciones cargadas exitosamente");
        }
      }
    });
  });
}

// ========================================
// SISTEMA DE REPRODUCCIÓN DE ANIMACIONES
// ========================================

function playAnimationByName(animationName) {
  if (!mixer || !allAnimations[animationName]) {
    console.warn(`⚠️ Animación no encontrada: ${animationName}`);
    return;
  }

  const action = allAnimations[animationName];
  
  if (currentAction === action) {
    console.log(`🔄 Ya reproduciendo: ${animationName}`);
    return;
  }

  console.log(`🎬 Cambiando a: ${animationName}`);
  
  // Transición suave entre animaciones
  if (currentAction) {
    currentAction.fadeOut(0.5); // Fade out en 0.5 segundos
  }
  
  // Configurar y reproducir nueva animación
  action.reset();
  action.fadeIn(0.5); // Fade in en 0.5 segundos
  action.play();
  
  previousAction = currentAction;
  currentAction = action;
}

// ========================================
// CONTROL POR TECLADO
// ========================================

function onKeyDown(event) {
  const key = event.key;
  
  if (keyToAnimation[key] && mixer) {
    const animationName = keyToAnimation[key];
    console.log(`⌨️ Tecla presionada: ${key} -> ${animationName}`);
    playAnimationByName(animationName);
  }
}

// ========================================
// LIMPIEZA DE RECURSOS
// ========================================

function disposeObject(obj) {
  obj.traverse(function (child) {
    if (child.isSkinnedMesh) {
      child.skeleton.dispose();
    }

    if (child.material) {
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];
      materials.forEach((material) => {
        if (material.map) material.map.dispose();
        material.dispose();
      });
    }

    if (child.geometry) child.geometry.dispose();
  });
}

// ========================================
// MANEJO DE REDIMENSIONAMIENTO
// ========================================

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// ========================================
// BUCLE PRINCIPAL DE ANIMACIÓN
// ========================================

function animate() {
  const delta = clock.getDelta();

  // Actualizar mezclador de animaciones
  if (mixer) {
    mixer.update(delta);
  }

  // Renderizar escena
  renderer.render(scene, camera);

  // Actualizar estadísticas
  stats.update();
}