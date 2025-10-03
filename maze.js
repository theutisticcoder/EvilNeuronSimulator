// maze.js
let scene, camera, renderer;
let mazeData; // 2D array representing the maze (e.g., 0 for path, 1 for wall)
const MAZE_SIZE = 21; // Must be odd for simpler perfect maze generation

function init() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Generate maze data (e.g., using Depth-First Search)
    mazeData = generateMaze(MAZE_SIZE, MAZE_SIZE);

    // Create 3D maze objects based on mazeData
    createMazeGeometry(mazeData);

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

function generateMaze(width, height) {
    // Implement a maze generation algorithm (e.g., Depth-First Search)
    // This is a placeholder; a full implementation is complex.
    const maze = Array(height).fill(0).map(() => Array(width).fill(1)); // All walls initially

    // Basic example: clear a path
    for (let i = 1; i < height - 1; i += 2) {
        for (let j = 1; j < width - 1; j += 2) {
            maze[i][j] = 0; // Path
        }
    }
    return maze;
}

function createMazeGeometry(maze) {
    const wallGeometry = new THREE.BoxGeometry(1, 2, 1);
    const wallMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });

    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            if (maze[i][j] === 1) { // If it's a wall
                const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                wall.position.set(j - maze[i].length / 2, 1, i - maze.length / 2);
                scene.add(wall);
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    // Add player movement, collision detection, etc. here
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();