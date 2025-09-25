# Three.js 3D Model Personalized

## 🎬 Sistema de Animaciones 3D con Three.js

Un sistema completo de animaciones 3D desarrollado con Three.js que permite cargar un personaje base y aplicar múltiples animaciones con transiciones suaves.

### ✨ Características

- **Personaje 3D**: Modelo base "Erika Archer" con esqueleto completo
- **5 Animaciones**: Capoeira, Dying, Jumping Down, Sitting Laughing, Angry
- **Transiciones Suaves**: Fade in/out entre animaciones
- **Controles por Teclado**: Teclas 1-5 para cambiar animaciones
- **GUI Interactivo**: Panel de control para selección manual
- **Cámara Orbital**: Control libre de la cámara con OrbitControls
- **Iluminación Avanzada**: Sistema de luces con sombras
- **Estadísticas en Tiempo Real**: Monitor de rendimiento

### 🎮 Controles

- **Tecla 1**: Capoeira
- **Tecla 2**: Dying (Muerte)
- **Tecla 3**: Jumping Down (Salto)
- **Tecla 4**: Sitting Laughing (Risa Sentado)
- **Tecla 5**: Angry (Enojo)
- **Mouse**: Rotar, hacer zoom y pan de la cámara

### 🚀 Instalación y Uso

1. Clona el repositorio:
```bash
git clone https://github.com/Jeztorres/-threejs-3d-model-personalized.git
```

2. Abre `index.html` en tu navegador web

3. ¡Disfruta de las animaciones 3D!

### 📁 Estructura del Proyecto

```
├── build/                    # Archivos de Three.js
├── css/                      # Estilos CSS
├── js/                       # Código JavaScript principal
├── jsm/                      # Módulos adicionales de Three.js
│   ├── controls/             # OrbitControls
│   ├── libs/                 # Librerías (Stats, GUI, etc.)
│   └── loaders/              # FBXLoader
├── models/                   # Modelos 3D FBX
│   ├── animations_only/      # Solo animaciones
│   ├── character_animations/ # Personajes con animaciones
│   └── fbx/                  # Modelos adicionales
├── index.html               # Página principal
└── README.md                # Este archivo
```

### 🛠️ Tecnologías Utilizadas

- **Three.js**: Librería 3D principal
- **FBX Loader**: Cargador de modelos FBX
- **OrbitControls**: Control de cámara
- **Lil-GUI**: Interfaz gráfica
- **Stats.js**: Estadísticas de rendimiento

### 👨‍💻 Desarrollador

**Jezrael Jared Gómez Torres**

### 📝 Licencia

Este proyecto está disponible bajo la licencia MIT.

### 🎯 Funcionalidades Técnicas

- Sistema de carga asíncrona de modelos
- Mezclador de animaciones (AnimationMixer)
- Gestión de memoria y limpieza de recursos
- Responsive design
- Optimización de rendimiento
- Manejo de eventos de teclado y mouse

### 🔧 Configuración Avanzada

El sistema está configurado con:
- Cámara perspectiva con campo de visión de 45°
- Sistema de luces hemisféricas y direccionales
- Sombras habilitadas para mayor realismo
- Niebla atmosférica para profundidad
- Grid de referencia para orientación

¡Explora las diferentes animaciones y disfruta de la experiencia 3D!
