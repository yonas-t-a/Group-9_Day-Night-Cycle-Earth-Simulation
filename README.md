# Day/Night Earth Simulation

A 3D interactive simulation of the Earth, Sun, Moon, and a satellite, built with [Three.js](https://threejs.org/). The simulation features realistic day/night textures, animated clouds, a glowing sun, orbiting moon and satellite, a starfield background, and interactive controls.

## Features

- **Realistic Earth**: Day and night textures, bump mapping, and animated cloud layer.
- **Sun**: Textured, glowing sun with point light illumination.
- **Moon**: Orbits the Earth; click to pause/resume its orbit.
- **Satellite**: 3D GLTF model orbits the Earth and highlights on mouse hover.
- **Starfield**: 3D background of randomly placed stars.
- **Camera Controls**: Orbit, zoom, and pan using mouse (OrbitControls).
- **Responsive**: Resizes to fit your browser window.

## Project Structure

```
├── assets
│   ├── models
│   │   └── Satellite.glb
│   └── textures
│       ├── earth_clouds.jpg
│       ├── earth_day.jpg
│       ├── earth_night.jpg
│       └── sun.jpg
├── doc.md
├── Group_9_Day_Night Earth Simulation_Documentation.pdf
├── index.html
└── styles
    └── style.css
```

## Getting Started

1. **Clone or Download** this repository.
2. **Open `index.html`** in your web browser.  
   No build step or server is required; all scripts are loaded via CDN.

> **Note:** For the satellite model to load, you must open the project using a local server (due to browser security restrictions on loading `.glb` files).  
> You can use [VS Code Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) or run:
> ```bash
> python3 -m http.server
> ```
> and open [http://localhost:8000](http://localhost:8000) in your browser.

## Controls & Interactions

- **Rotate, Zoom, Pan**: Use your mouse to interact with the scene.
- **Satellite Highlight**: Hover your mouse over the satellite to highlight it.
- **Toggle Moon Orbit**: Click on the moon to pause/resume its orbit.

## Dependencies

- [Three.js](https://threejs.org/) (loaded via CDN)
- [OrbitControls](https://threejs.org/docs/#examples/en/controls/OrbitControls) (CDN)
- [GLTFLoader](https://threejs.org/docs/#examples/en/loaders/GLTFLoader) (CDN)

## Credits

- Earth, sun, and cloud textures: NASA Visible Earth
- Satellite model: [Your source or attribution here, if required]



Enjoy exploring the# Group-9_Day-Night-Cycle-Earth-Simulation
