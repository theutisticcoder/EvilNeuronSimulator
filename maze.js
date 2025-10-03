// maze.js
let scene, camera, renderer;
let mazeData; // 2D array representing the maze (e.g., 0 for path, 1 for wall)
const MAZE_SIZE = 21; // Must be odd for simpler perfect maze generation
var maze = [];



const img = new Image();
img.src = 'maze.png'; // Replace with your image path

function init() {

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data; // This is a 1D array of RGBA values

    for (let y = 0; y < canvas.height; y++) {
        const row = [];
        for (let x = 0; x < canvas.width; x++) {
            const i = (y * canvas.width + x) * 4; // Index of the red component for the current pixel
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            // Assuming black and white, check if the pixel is closer to black or white
            // You might need to adjust the threshold depending on your image
            const isBlack = (r < 128 && g < 128 && b < 128); // Example threshold
            row.push(isBlack ? 1 : 0); // 1 for black (wall), 0 for white (path)
        }
        maze.push(row);
    }

    console.log(maze); // Your 2D array representing the maze

    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Generate maze data (e.g., using Depth-First Search)

    // Create 3D maze objects based on mazeData
    createMazeGeometry(maze);

    // Set camera initial position
    camera.position.set(0, 5, 0); // Adjust as needed
    camera.lookAt(0, 0, 0);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    animate();
}
function AddToGeometry(mainObject, objectToAdd) { objectToAdd.updateMatrix(); mainObject.geometry.merge(objectToAdd.geometry, objectToAdd.matrix); return mainObject;     }
var walls;
function createMazeGeometry(maze) {
    const wallGeometry = new THREE.BoxGeometry(1, 6, 1);
    const wallMaterial = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('/texture.png') })

    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            if (maze[i][j] === 1) { // If it's a wall
                
                const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                wall.position.set(j - maze[i].length / 2, 1, i - maze.length / 2);
                if(i === 0 && j ===0){
                    walls = wall;
                }
                else{
                    AddToGeometry(walls, wall);
                }
            }
        }
    }
                scene.add(walls);

}

// --- PLAYER MOVEMENT (WASD) ---
const playerSpeed = 0.1;
const keys = {};

// Listen for key presses
document.addEventListener('keydown', (event) => {
    keys[event.key.toLowerCase()] = true;
});

// Listen for key releases
document.addEventListener('keyup', (event) => {
    keys[event.key.toLowerCase()] = false;
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    scene.rotation.x = Math.PI / 2;
    // Calculate movement based on keys pressed
    const cameraBoundingBox = new THREE.Box3().setFromObject(camera);

    // 2. Create a bounding box for the wall
    const wallBoundingBox = new THREE.Box3().setFromObject(walls);

    // 3. Check for intersection
    if (!cameraBoundingBox.intersectsBox(wallBoundingBox)) {
        // Collision detected! Handle accordingly
        if (keys['w']) camera.position.y -= playerSpeed;
        if (keys['s']) camera.position.y += playerSpeed;
        if (keys['a']) camera.position.x -= playerSpeed;
        if (keys['d']) camera.position.x += playerSpeed;

    }

    renderer.render(scene, camera);
}

// Start the animation


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

img.onload = init;