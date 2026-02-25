/**
 * vis3d.js — Interactive 3D Neural Network Visualization
 * Powered by Three.js
 */

(function () {
    const container = document.getElementById("vis3d");
    if (!container) return;

    let scene, camera, renderer, nodes = [], lines, raycaster, mouse;
    const NODE_COUNT = 80;
    const CONNECT_DIST = 180;

    function init() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        camera.position.z = 600;

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        // Create Nodes
        const geometry = new THREE.SphereGeometry(2, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0x6c63ff });

        for (let i = 0; i < NODE_COUNT; i++) {
            const node = new THREE.Mesh(geometry, material);
            node.position.x = (Math.random() - 0.5) * 1200;
            node.position.y = (Math.random() - 0.5) * 800;
            node.position.z = (Math.random() - 0.5) * 600;

            // Store velocity for movement
            node.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.8,
                    (Math.random() - 0.5) * 0.8,
                    (Math.random() - 0.5) * 0.8
                ),
                originalPos: node.position.clone()
            };

            scene.add(node);
            nodes.push(node);
        }

        // Lines are updated in the animate loop
        window.addEventListener("resize", onWindowResize);
        window.addEventListener("mousemove", onMouseMove);
        animate();
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    function animate() {
        requestAnimationFrame(animate);

        // Update Nodes
        nodes.forEach(node => {
            node.position.add(node.userData.velocity);

            // Bounce off boundaries
            if (Math.abs(node.position.x) > 700) node.userData.velocity.x *= -1;
            if (Math.abs(node.position.y) > 500) node.userData.velocity.y *= -1;
            if (Math.abs(node.position.z) > 400) node.userData.velocity.z *= -1;

            // Subtle mouse interaction
            const mouseEffect = new THREE.Vector3(mouse.x * 200, mouse.y * 200, 0);
            const dist = node.position.distanceTo(mouseEffect);
            if (dist < 300) {
                node.position.x += (mouseEffect.x - node.position.x) * 0.005;
                node.position.y += (mouseEffect.y - node.position.y) * 0.005;
            }
        });

        // Draw lines manually using a BufferGeometry (more efficient)
        if (lines) scene.remove(lines);

        const positions = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dist = nodes[i].position.distanceTo(nodes[j].position);
                if (dist < CONNECT_DIST) {
                    positions.push(nodes[i].position.x, nodes[i].position.y, nodes[i].position.z);
                    positions.push(nodes[j].position.x, nodes[j].position.y, nodes[j].position.z);
                }
            }
        }

        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x6c63ff,
            transparent: true,
            opacity: 0.15
        });
        lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lines);

        // Rotation effect for the entire scene
        scene.rotation.y += 0.001;
        scene.rotation.x += 0.0005;

        renderer.render(scene, camera);
    }

    init();
})();
