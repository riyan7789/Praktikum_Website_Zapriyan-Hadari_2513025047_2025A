let running = true;

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
);

camera.position.set(0, 120, 500);

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    window.devicePixelRatio
);

document.body.appendChild(
    renderer.domElement
);

// Orbit Controls
const controls = new THREE.OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.enableZoom = true;
controls.zoomSpeed = 1.2;
controls.minDistance = 50;
controls.maxDistance = 3000;

controls.enablePan = true;
controls.panSpeed = 0.8;

// Background Stars
const starGeometry = new THREE.BufferGeometry();
const starVertices = [];

for (let i = 0; i < 15000; i++) {

    starVertices.push(
        (Math.random() - 0.5) * 8000,
        (Math.random() - 0.5) * 8000,
        (Math.random() - 0.5) * 8000
    );

}

starGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(
        starVertices,
        3
    )
);

const starMaterial =
new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.2
});

const stars =
new THREE.Points(
    starGeometry,
    starMaterial
);

scene.add(stars);

// Lighting
scene.add(
    new THREE.AmbientLight(
        0x404040,
        2
    )
);

const sunLight =
new THREE.PointLight(
    0xffffff,
    5,
    5000
);

scene.add(sunLight);

// Sun
const sun =
new THREE.Mesh(

    new THREE.SphereGeometry(
        25,
        64,
        64
    ),

    new THREE.MeshBasicMaterial({
        color: 0xffcc00
    })

);

scene.add(sun);

// Planet Data
const planetData = [

{
name: "Mercury",
size: 3,
distance: 50,
speed: 0.004,
color: 0x9e9e9e
},

{
name: "Venus",
size: 5,
distance: 75,
speed: 0.003,
color: 0xd9a066
},

{
name: "Earth",
size: 5.5,
distance: 105,
speed: 0.0025,
color: 0x2196f3
},

{
name: "Mars",
size: 4,
distance: 135,
speed: 0.002,
color: 0xc1440e
},

{
name: "Jupiter",
size: 14,
distance: 190,
speed: 0.0015,
color: 0xd2b48c
},

{
name: "Saturn",
size: 12,
distance: 260,
speed: 0.0012,
color: 0xe6d690
},

{
name: "Uranus",
size: 9,
distance: 340,
speed: 0.0009,
color: 0x7fffd4
},

{
name: "Neptune",
size: 9,
distance: 420,
speed: 0.0007,
color: 0x4169e1
}

];

const planets = [];

// Create Planets
planetData.forEach((data, index) => {

    const planet =
    new THREE.Mesh(

        new THREE.SphereGeometry(
            data.size,
            32,
            32
        ),

        new THREE.MeshStandardMaterial({
            color: data.color
        })

    );

    scene.add(planet);

    const orbit =
    new THREE.Mesh(

        new THREE.RingGeometry(
            data.distance - 0.5,
            data.distance + 0.5,
            256
        ),

        new THREE.MeshBasicMaterial({
            color: 0x444444,
            side: THREE.DoubleSide
        })

    );

    orbit.rotation.x = Math.PI / 2;

    scene.add(orbit);

    planets.push({
        mesh: planet,
        distance: data.distance,
        speed: data.speed,
        angle: Math.random() * Math.PI * 2
    });

});

// Saturn Ring
const saturnRing =
new THREE.Mesh(

    new THREE.RingGeometry(
        16,
        25,
        128
    ),

    new THREE.MeshBasicMaterial({
        color: 0xc2b280,
        side: THREE.DoubleSide
    })

);

saturnRing.rotation.x = Math.PI / 2;

scene.add(saturnRing);

// Buttons
document.getElementById("playBtn").onclick = () => {
    running = true;
};

document.getElementById("pauseBtn").onclick = () => {
    running = false;
};

// Zoom In
document.getElementById("zoomInBtn").onclick = () => {

    const direction = new THREE.Vector3();

    camera.getWorldDirection(direction);

    camera.position.add(
        direction.multiplyScalar(30)
    );

};

// Zoom Out
document.getElementById("zoomOutBtn").onclick = () => {

    const direction = new THREE.Vector3();

    camera.getWorldDirection(direction);

    camera.position.add(
        direction.multiplyScalar(-30)
    );

};

// Animation
function animate() {

    requestAnimationFrame(animate);

    if (running) {

        sun.rotation.y += 0.0005;

        planets.forEach((planet, index) => {

            planet.angle += planet.speed;

            planet.mesh.position.x =
            Math.cos(planet.angle) *
            planet.distance;

            planet.mesh.position.z =
            Math.sin(planet.angle) *
            planet.distance;

            planet.mesh.rotation.y += 0.003;

            if (index === 5) {

                saturnRing.position.copy(
                    planet.mesh.position
                );

            }

        });

    }

    controls.update();

    renderer.render(
        scene,
        camera
    );

}

animate();

// Responsive
window.addEventListener(
'resize',
() => {

camera.aspect =
window.innerWidth /
window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(
window.innerWidth,
window.innerHeight
);

});