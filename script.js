import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ===== NAVIGATION =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

document.querySelectorAll('.projet-card, .membre-card, .partenaire-card').forEach(el => {
    observer.observe(el);
});

// ===== STATS COUNTER ANIMATION =====
const stats = document.querySelectorAll('.stat-number');
const statsSection = document.querySelector('.hero');

const animateStats = () => {
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 30);
    });
};

// Trigger animation when page loads
setTimeout(animateStats, 500);

// ===== PARCOURS MAP ANIMATION =====
const routePath = document.getElementById('route-path');

// Observe when map section is visible
const mapObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate the route path
            if (routePath) {
                const pathLength = routePath.getTotalLength();
                routePath.style.strokeDasharray = pathLength;
                routePath.style.strokeDashoffset = pathLength;

                // Trigger route animation with delay
                setTimeout(() => {
                    routePath.style.strokeDashoffset = '0';
                }, 500);
            }

            mapObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const parcoursSection = document.querySelector('.parcours-section');
if (parcoursSection) {
    mapObserver.observe(parcoursSection);
}

// ===== THREE.JS 3D MODEL =====
const canvasContainer = document.getElementById('canvas-container');
const loadingOverlay = document.getElementById('loading-model');

if (canvasContainer) {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background

    // Camera
    const camera = new THREE.PerspectiveCamera(
        50,
        canvasContainer.clientWidth / canvasContainer.clientHeight,
        0.1,
        1000
    );
    camera.position.set(-5, 2.5, 3.5); // 3/4 front left view

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true, // Enable transparency
        powerPreference: "high-performance",
        precision: "highp"
    });
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // Use full device pixel ratio for better quality
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0; // More neutral exposure like Blender
    renderer.physicallyCorrectLights = true;

    // Enable additional WebGL extensions for better quality
    const gl = renderer.getContext();
    const ext = gl.getExtension('EXT_texture_filter_anisotropic');
    if (ext) {
        renderer.capabilities.getMaxAnisotropy();
    }

    canvasContainer.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI / 2.1;

    // Lights - Blender-like lighting setup (3-point lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Key light (main light)
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.8);
    mainLight.position.set(8, 12, 8);
    mainLight.castShadow = true;
    mainLight.shadow.camera.near = 0.1;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -15;
    mainLight.shadow.camera.right = 15;
    mainLight.shadow.camera.top = 15;
    mainLight.shadow.camera.bottom = -15;
    mainLight.shadow.mapSize.width = 4096;
    mainLight.shadow.mapSize.height = 4096;
    mainLight.shadow.bias = -0.0001;
    mainLight.shadow.normalBias = 0.02;
    scene.add(mainLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-10, 5, -5);
    scene.add(fillLight);

    // Back light (rim light)
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
    rimLight.position.set(0, 10, -15);
    scene.add(rimLight);

    // Hemisphere light for more realistic sky/ground lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    // Simple ground shadow plane (subtle)
    const groundGeometry = new THREE.CircleGeometry(10, 32);
    const groundMaterial = new THREE.ShadowMaterial({
        opacity: 0.3
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    scene.add(ground);

    // Load 3D model
    let car = null;
    let carBaseY = 0;
    const loader = new GLTFLoader();

    loader.load(
        'R4L-TrophyF6.glb',
        (gltf) => {
            car = gltf.scene;

            // Enable shadows and enhance material quality to match Blender
            car.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;

                    if (child.material) {
                        const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

                        // Enhance all texture maps
                        if (child.material.map) {
                            child.material.map.anisotropy = maxAnisotropy;
                            child.material.map.generateMipmaps = true;
                        }
                        if (child.material.normalMap) {
                            child.material.normalMap.anisotropy = maxAnisotropy;
                        }
                        if (child.material.roughnessMap) {
                            child.material.roughnessMap.anisotropy = maxAnisotropy;
                        }
                        if (child.material.metalnessMap) {
                            child.material.metalnessMap.anisotropy = maxAnisotropy;
                        }
                        if (child.material.aoMap) {
                            child.material.aoMap.anisotropy = maxAnisotropy;
                        }

                        // Ensure proper material rendering
                        child.material.side = THREE.FrontSide;
                        child.material.flatShading = false;
                        child.material.needsUpdate = true;
                    }
                }
            });

            // Center and scale model
            const box = new THREE.Box3().setFromObject(car);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            car.position.x = -center.x;
            car.position.y = -box.min.y;
            car.position.z = -center.z;

            carBaseY = -box.min.y;

            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 5 / maxDim; // Balanced size
            car.scale.setScalar(scale);

            scene.add(car);

            // Hide loading overlay
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 300);

            console.log('Modèle 3D chargé avec succès !');
        },
        (xhr) => {
            const percent = Math.round((xhr.loaded / xhr.total) * 100);
            loadingOverlay.querySelector('p').textContent = `Chargement ${percent}%`;
        },
        (error) => {
            console.error('Erreur de chargement:', error);
            loadingOverlay.querySelector('p').textContent = 'Erreur de chargement';
        }
    );

    // Resize handler
    window.addEventListener('resize', () => {
        if (!canvasContainer) return;

        camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio); // Keep full quality on resize
    });

    // Scroll-based rotation
    let scrollRotation = 0;
    window.addEventListener('scroll', () => {
        // Calculate rotation based on scroll position
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        // Rotate the car: 0.001 radians per pixel scrolled
        scrollRotation = scrollTop * 0.001;
    });

    // Animation loop
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);

        time += 0.001;

        // Add subtle floating animation to car
        if (car) {
            car.position.y = Math.sin(time * 2) * 0.05 + carBaseY;
            // Apply scroll-based rotation on Y axis
            car.rotation.y = scrollRotation;
        }

        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}

// ===== FORM HANDLING =====
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Merci pour votre message ! Nous vous répondrons rapidement.');
        contactForm.reset();
    });
}

// ===== SCROLL INDICATOR =====
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 200) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    });
}
