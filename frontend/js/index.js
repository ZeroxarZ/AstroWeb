// Variables globales
        let scene, camera, renderer, controls;
        let planets = {};
        let planetMeshes = {};
        let planetOrbits = {};
        let planetLabels = {};
        let distanceLines = {};
        let clock = new THREE.Clock();
        let simulationSpeed = 1;
        let selectedPlanet = 'earth';
        let showOrbits = false;
        let showLabels = false;
        let showDistances = false;
        let helpVisible = false;
        let planetScale = 5;
        let realTimeMode = false;
        let sun;
        let raycaster = new THREE.Raycaster();
        let mouse = new THREE.Vector2();
        let controlsVisible = true;
        
        // Données des planètes
        const planetData = {
            sun: {
                name: 'Soleil',
                radius: 696340, // km
                displayRadius: 5,
                orbitRadius: 0,
                orbitSpeed: 0,
                rotationSpeed: 0.002,
                tilt: 7.25 * Math.PI / 180,
                color: 0xffdd00,
                emissive: 0xff8800,
                info: 'Le Soleil est l\'étoile au centre de notre système solaire. Il contient 99,86% de la masse du système solaire et fournit l\'énergie nécessaire à la vie sur Terre.',
                data: {
                    'Diamètre': '1 392 680 km',
                    'Type': 'Étoile naine jaune',
                    'Âge': '~4,6 milliards d\'années',
                    'Température de surface': '5 500°C',
                    'Température du noyau': '15 millions °C',
                    'Masse': '1,989 × 10^30 kg'
                }
            },
            mercury: {
                name: 'Mercure',
                radius: 2439.7, // km
                displayRadius: 0.38,
                orbitRadius: 0.39, // UA
                orbitSpeed: 0.04,
                rotationSpeed: 0.0029,
                tilt: 0.034 * Math.PI / 180,
                color: 0xaaaaaa,
                info: 'Mercure est la planète la plus proche du Soleil et la plus petite du système solaire. Sa surface est couverte de cratères similaires à ceux de la Lune.',
                data: {
                    'Diamètre': '4 879 km',
                    'Distance du Soleil': '57,9 millions km',
                    'Période orbitale': '88 jours',
                    'Période de rotation': '58,6 jours',
                    'Gravité de surface': '3,7 m/s²',
                    'Température': '-173°C à 427°C'
                }
            },
            venus: {
                name: 'Vénus',
                radius: 6051.8, // km
                displayRadius: 0.95,
                orbitRadius: 0.72, // UA
                orbitSpeed: 0.015,
                rotationSpeed: -0.0006,
                tilt: 177.4 * Math.PI / 180,
                color: 0xe6c8a0,
                info: 'Vénus est la deuxième planète du système solaire et la plus chaude en raison de son effet de serre extrême. Elle tourne dans le sens inverse des autres planètes.',
                data: {
                    'Diamètre': '12 104 km',
                    'Distance du Soleil': '108,2 millions km',
                    'Période orbitale': '225 jours',
                    'Période de rotation': '243 jours (rétrograde)',
                    'Gravité de surface': '8,9 m/s²',
                    'Température': '462°C'
                }
            },
            earth: {
                name: 'Terre',
                radius: 6371, // km
                displayRadius: 1,
                orbitRadius: 1, // UA
                orbitSpeed: 0.01,
                rotationSpeed: 0.01,
                tilt: 23.5 * Math.PI / 180,
                color: 0x2277ff,
                info: 'Notre planète, la seule connue à abriter la vie. La Terre est la troisième planète du système solaire et possède une atmosphère riche en oxygène et un champ magnétique qui nous protège des radiations solaires.',
                data: {
                    'Diamètre': '12 742 km',
                    'Distance du Soleil': '149,6 millions km',
                    'Période orbitale': '365,25 jours',
                    'Période de rotation': '24 heures',
                    'Gravité de surface': '9,8 m/s²',
                    'Satellites': '1 (Lune)'
                }
            },
            moon: {
                name: 'Lune',
                radius: 1737.4, // km
                displayRadius: 0.27,
                orbitRadius: 0.00257, // UA (384 400 km)
                parentPlanet: 'earth',
                orbitSpeed: 0.03,
                rotationSpeed: 0.003,
                tilt: 1.5 * Math.PI / 180,
                color: 0xaaaaaa,
                info: 'Le seul satellite naturel de la Terre. La Lune est en rotation synchrone avec la Terre, montrant toujours la même face. Elle influence les marées et stabilise l\'axe de rotation de la Terre.',
                data: {
                    'Diamètre': '3 474 km',
                    'Distance de la Terre': '384 400 km',
                    'Période orbitale': '27,3 jours',
                    'Période de rotation': '27,3 jours',
                    'Gravité de surface': '1,62 m/s²',
                    'Atmosphère': 'Quasi inexistante'
                }
            },
            mars: {
                name: 'Mars',
                radius: 3389.5, // km
                displayRadius: 0.53,
                orbitRadius: 1.52, // UA
                orbitSpeed: 0.008,
                rotationSpeed: 0.009,
                tilt: 25.2 * Math.PI / 180,
                color: 0xdd5500,
                info: 'Surnommée la planète rouge en raison de sa couleur caractéristique due à l\'oxyde de fer. Mars possède des calottes polaires, des vallées, des déserts et présente des signes d\'eau passée à sa surface.',
                data: {
                    'Diamètre': '6 779 km',
                    'Distance du Soleil': '227,9 millions km',
                    'Période orbitale': '687 jours',
                    'Période de rotation': '24,6 heures',
                    'Gravité de surface': '3,7 m/s²',
                    'Satellites': '2 (Phobos, Deimos)'
                }
            },
            jupiter: {
                name: 'Jupiter',
                radius: 69911, // km
                displayRadius: 11.2,
                orbitRadius: 5.2, // UA
                orbitSpeed: 0.004,
                rotationSpeed: 0.04,
                tilt: 3.13 * Math.PI / 180,
                color: 0xd8ca9d,
                info: 'Jupiter est la plus grande planète du système solaire. C\'est une géante gazeuse avec une atmosphère composée principalement d\'hydrogène et d\'hélium, et sa caractéristique la plus connue est sa Grande Tache Rouge.',
                data: {
                    'Diamètre': '139 822 km',
                    'Distance du Soleil': '778,5 millions km',
                    'Période orbitale': '11,86 ans',
                    'Période de rotation': '9,93 heures',
                    'Gravité de surface': '24,8 m/s²',
                    'Satellites': '79 connus'
                }
            },
            saturn: {
                name: 'Saturne',
                radius: 58232, // km
                displayRadius: 9.45,
                orbitRadius: 9.58, // UA
                orbitSpeed: 0.003,
                rotationSpeed: 0.038,
                tilt: 26.73 * Math.PI / 180,
                color: 0xe3dccb,
                hasRings: true,
                info: 'Saturne est célèbre pour son magnifique système d\'anneaux composés de glace et de poussière. C\'est la deuxième plus grande planète du système solaire et possède plus de 80 lunes.',
                data: {
                    'Diamètre': '116 464 km',
                    'Distance du Soleil': '1,43 milliard km',
                    'Période orbitale': '29,46 ans',
                    'Période de rotation': '10,7 heures',
                    'Gravité de surface': '10,4 m/s²',
                    'Satellites': '82 connus'
                }
            },
            uranus: {
                name: 'Uranus',
                radius: 25362, // km
                displayRadius: 4,
                orbitRadius: 19.22, // UA
                orbitSpeed: 0.002,
                rotationSpeed: -0.025,
                tilt: 97.77 * Math.PI / 180,
                color: 0x75c6d1,
                info: 'Uranus est la septième planète du système solaire. Sa particularité est son axe de rotation très incliné, qui la fait tourner presque sur le côté. Elle apparaît comme un disque bleu-vert en raison du méthane dans son atmosphère.',
                data: {
                    'Diamètre': '50 724 km',
                    'Distance du Soleil': '2,88 milliards km',
                    'Période orbitale': '84,02 ans',
                    'Période de rotation': '17,24 heures',
                    'Gravité de surface': '8,7 m/s²',
                    'Satellites': '27 connus'
                }
            },
            neptune: {
                name: 'Neptune',
                radius: 24622, // km
                displayRadius: 3.88,
                orbitRadius: 30.05, // UA
                orbitSpeed: 0.001,
                rotationSpeed: 0.027,
                tilt: 28.32 * Math.PI / 180,
                color: 0x3e66f9,
                info: 'Neptune est la huitième et la plus éloignée des planètes du système solaire. Elle est similaire à Uranus en composition et est connue pour ses vents violents, les plus rapides du système solaire.',
                data: {
                    'Diamètre': '49 244 km',
                    'Distance du Soleil': '4,5 milliards km',
                    'Période orbitale': '164,8 ans',
                    'Période de rotation': '16,11 heures',
                    'Gravité de surface': '11,2 m/s²',
                    'Satellites': '14 connus'
                }
            },
            pluto: {
                name: 'Pluton',
                radius: 1188.3, // km
                displayRadius: 0.18,
                orbitRadius: 39.48, // UA
                orbitSpeed: 0.0007,
                rotationSpeed: -0.004,
                tilt: 122.5 * Math.PI / 180,
                color: 0xbcb7ab,
                info: 'Pluton était considérée comme la neuvième planète du système solaire jusqu\'en 2006, lorsqu\'elle a été reclassée comme planète naine. Elle est composée principalement de roche et de glace.',
                data: {
                    'Diamètre': '2 377 km',
                    'Distance du Soleil': '5,9 milliards km',
                    'Période orbitale': '248 ans',
                    'Période de rotation': '6,39 jours',
                    'Gravité de surface': '0,62 m/s²',
                    'Satellites': '5 connus'
                }
            }
        };

        // === AstronomyAPI credentials ===
const ASTRONOMY_API_KEY = 'b408f9a8-c670-460b-841c-168ef88775ea';
const ASTRONOMY_API_SECRET = 'e609ef38fd1d6bc593fe350d49c19ec5204f3e2b2426cb4fe9f80f8b40dd7be3bbe2a73ef906a66e9d03c69bedafbdafbde936bca2e68fbb59fdeb6025f85bc64a0f735b7ab35dc82898df2d33339231af7f8b9da94d60dcc06cd5dcc2ecbc97060980db3b6025575553bd9f4ac8b9a4';

        // Initialisation
        init();
        animate();

        function init() {
            // Création de la scène
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x000510);
            
            // Création de la caméra
            camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 3, 10);
            
            // Création du renderer
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            document.getElementById('canvas-container').appendChild(renderer.domElement);
            
            // Contrôles de la caméra
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.minDistance = 3;
            controls.maxDistance = 100;
            
            // Éclairage
            const ambientLight = new THREE.AmbientLight(0x333333);
            scene.add(ambientLight);
            
            // Étoiles de fond
            createStars();
            
            // Création des planètes
            createPlanets();
            
            // Création des orbites
            createOrbits();
            
            // Création des étiquettes
            createLabels();
            
            // Événements
            window.addEventListener('resize', onWindowResize);
            renderer.domElement.addEventListener('click', onMouseClick);
            
            document.getElementById('toggle-orbits').addEventListener('click', toggleOrbits);
            document.getElementById('toggle-labels').addEventListener('click', toggleLabels);
            document.getElementById('toggle-distances').addEventListener('click', toggleDistances);
            document.getElementById('toggle-controls').addEventListener('click', toggleControls);
            document.getElementById('speed-slider').addEventListener('input', updateSpeed);
            document.getElementById('planet-scale-slider').addEventListener('input', updatePlanetScale);
            document.getElementById('real-time-toggle').addEventListener('change', toggleRealTime);
            document.querySelector('.help-button').addEventListener('click', toggleHelp);
            
            const planetButtons = document.querySelectorAll('.planet-button');
            planetButtons.forEach(button => {
                button.addEventListener('click', () => {
                    selectPlanet(button.dataset.planet);
                    planetButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                });
            });
            
            // Mettre à jour la date actuelle
            updateCurrentDate();
            
            // Masquer l'écran de chargement après un court délai
            setTimeout(() => {
                document.querySelector('.loading-screen').style.opacity = 0;
                setTimeout(() => {
                    document.querySelector('.loading-screen').style.display = 'none';
                }, 1000);
            }, 1500);
        }

        function createStars() {
            const starsGeometry = new THREE.BufferGeometry();
            const starsMaterial = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 0.1,
                transparent: true
            });
            
            const starsVertices = [];
            for (let i = 0; i < 10000; i++) {
                const x = (Math.random() - 0.5) * 2000;
                const y = (Math.random() - 0.5) * 2000;
                const z = (Math.random() - 0.5) * 2000;
                starsVertices.push(x, y, z);
            }
            
            starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
            const stars = new THREE.Points(starsGeometry, starsMaterial);
            scene.add(stars);
        }

        function createPlanets() {
            // Facteur d'échelle pour les distances (1 UA = 10 unités)
            const distanceScale = 10;
            
            // Créer le soleil
            const sunGeometry = new THREE.SphereGeometry(planetData.sun.displayRadius, 64, 64);
            const sunMaterial = new THREE.MeshPhongMaterial({
                color: planetData.sun.color,
                emissive: planetData.sun.emissive,
                emissiveIntensity: 0.5
            });
            sun = new THREE.Mesh(sunGeometry, sunMaterial);
            scene.add(sun);
            planetMeshes.sun = sun;
            
            // Ajouter une lumière au soleil
            const sunLight = new THREE.PointLight(0xffffff, 1.5, 0, 1);
            sun.add(sunLight);
            
            // Créer les planètes
            for (const key in planetData) {
                if (key === 'sun') continue; // Le soleil est déjà créé
                
                const planet = planetData[key];
                
                // Créer la géométrie de la planète
                const geometry = new THREE.SphereGeometry(planet.displayRadius, 32, 32);
                const material = new THREE.MeshPhongMaterial({
                    color: planet.color,
                    shininess: 25,
                    specular: 0x333333
                });
                
                const mesh = new THREE.Mesh(geometry, material);
                
                // Positionner la planète
                if (planet.parentPlanet) {
                    // C'est un satellite
                    const parent = planetMeshes[planet.parentPlanet];
                    parent.add(mesh);
                    mesh.position.x = planet.orbitRadius * distanceScale;
                } else {
                    // C'est une planète
                    scene.add(mesh);
                    mesh.position.x = planet.orbitRadius * distanceScale;
                }
                
                // Appliquer l'inclinaison
                mesh.rotation.z = planet.tilt;
                
                // Ajouter des anneaux pour Saturne
                if (planet.hasRings) {
                    const ringsGeometry = new THREE.RingGeometry(
                        planet.displayRadius * 1.4,
                        planet.displayRadius * 2.3,
                        64
                    );
                    
                    const ringsMaterial = new THREE.MeshBasicMaterial({
                        color: 0xf8e9c9,
                        side: THREE.DoubleSide,
                        transparent: true,
                        opacity: 0.8
                    });
                    
                    const rings = new THREE.Mesh(ringsGeometry, ringsMaterial);
                    rings.rotation.x = Math.PI / 2;
                    mesh.add(rings);
                }
                
                planetMeshes[key] = mesh;
            }
        }

        function createOrbits() {
            const distanceScale = 10;
            
            for (const key in planetData) {
                if (key === 'sun' || planetData[key].parentPlanet) continue;
                
                const planet = planetData[key];
                const orbitRadius = planet.orbitRadius * distanceScale;
                
                const orbitGeometry = new THREE.RingGeometry(orbitRadius - 0.02, orbitRadius + 0.02, 128);
                const orbitMaterial = new THREE.MeshBasicMaterial({
                    color: 0x4488ff,
                    transparent: true,
                    opacity: 0.3,
                    side: THREE.DoubleSide
                });
                
                const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
                orbit.rotation.x = Math.PI / 2;
                orbit.visible = false;
                scene.add(orbit);
                
                planetOrbits[key] = orbit;
            }
            
            // Orbite de la Lune autour de la Terre
            const moonOrbitRadius = planetData.moon.orbitRadius * distanceScale;
            const moonOrbitGeometry = new THREE.RingGeometry(moonOrbitRadius - 0.01, moonOrbitRadius + 0.01, 64);
            const moonOrbitMaterial = new THREE.MeshBasicMaterial({
                color: 0x4488ff,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            
            const moonOrbit = new THREE.Mesh(moonOrbitGeometry, moonOrbitMaterial);
            moonOrbit.rotation.x = Math.PI / 2;
            moonOrbit.visible = false;
            planetMeshes.earth.add(moonOrbit);
            planetOrbits.moon = moonOrbit;
        }

        function createLabels() {
            // Créer des div pour les étiquettes
            for (const key in planetData) {
                const labelDiv = document.createElement('div');
                labelDiv.className = 'tooltip';
                labelDiv.textContent = planetData[key].name;
                labelDiv.style.opacity = '0';
                document.querySelector('.ui-container').appendChild(labelDiv);
                planetLabels[key] = labelDiv;
            }
        }

        function updateLabels() {
            if (!showLabels) {
                for (const key in planetLabels) {
                    planetLabels[key].style.opacity = '0';
                }
                return;
            }
            
            for (const key in planetMeshes) {
                const planet = planetMeshes[key];
                const screenPosition = getScreenPosition(planet);
                
                if (screenPosition.z > 0) { // Devant la caméra
                    planetLabels[key].style.opacity = '1';
                    planetLabels[key].style.left = screenPosition.x + 'px';
                    planetLabels[key].style.top = screenPosition.y + 'px';
                } else {
                    planetLabels[key].style.opacity = '0';
                }
            }
        }

        function getScreenPosition(object) {
            const vector = new THREE.Vector3();
            
            // Obtenir la position mondiale de l'objet
            object.getWorldPosition(vector);
            
            // Projeter la position 3D sur l'écran 2D
            vector.project(camera);
            
            const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight;
            
            return {
                x: x,
                y: y,
                z: vector.z
            };
        }

        function updateDistanceLines() {
            // Supprimer les anciennes lignes
            for (const key in distanceLines) {
                if (distanceLines[key].line) {
                    document.querySelector('.ui-container').removeChild(distanceLines[key].line);
                }
                if (distanceLines[key].label) {
                    document.querySelector('.ui-container').removeChild(distanceLines[key].label);
                }
            }
            distanceLines = {};
            
            if (!showDistances) return;
            
            // Créer de nouvelles lignes entre la planète sélectionnée et les autres
            for (const key in planetMeshes) {
                if (key !== selectedPlanet) {
                    createDistanceLine(selectedPlanet, key);
                }
            }
        }

        function createDistanceLine(from, to) {
            const fromObj = planetMeshes[from];
            const toObj = planetMeshes[to];
            
            // Obtenir les positions mondiales
            const fromWorldPos = new THREE.Vector3();
            const toWorldPos = new THREE.Vector3();
            fromObj.getWorldPosition(fromWorldPos);
            toObj.getWorldPosition(toWorldPos);
            
            // Calculer la distance réelle
            const distance = fromWorldPos.distanceTo(toWorldPos);
            
            // Convertir en unités astronomiques (1 UA = 10 unités dans notre échelle)
            const distanceInAU = distance / 10;
            
            // Formater la distance pour l'affichage
            let distanceText;
            if (distanceInAU < 0.01) {
                // Convertir en km pour les petites distances
                const distanceInKm = distanceInAU * 149597870.7; // 1 UA = 149 597 870,7 km
                distanceText = `${Math.round(distanceInKm).toLocaleString()} km`;
            } else {
                distanceText = `${distanceInAU.toFixed(2)} UA`;
            }
            
            const fromPos = getScreenPosition(fromObj);
            const toPos = getScreenPosition(toObj);
            
            if (fromPos.z < 0 || toPos.z < 0) return; // Ne pas afficher si derrière la caméra
            
            // Calculer la distance et l'angle
            const dx = toPos.x - fromPos.x;
            const dy = toPos.y - fromPos.y;
            const screenDistance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);
            
            // Créer la ligne
            const line = document.createElement('div');
            line.className = 'distance-line';
            line.style.left = fromPos.x + 'px';
            line.style.top = fromPos.y + 'px';
            line.style.width = screenDistance + 'px';
            line.style.transform = `rotate(${angle}rad)`;
            document.querySelector('.ui-container').appendChild(line);
            
            // Créer l'étiquette
            const label = document.createElement('div');
            label.className = 'distance-label';
            label.textContent = `${planetData[from].name}-${planetData[to].name}: ${distanceText}`;
            label.style.left = (fromPos.x + toPos.x) / 2 - 50 + 'px';
            label.style.top = (fromPos.y + toPos.y) / 2 - 10 + 'px';
            document.querySelector('.ui-container').appendChild(label);
            
            distanceLines[from + '-' + to] = { line, label };
        }

        function animate() {
            requestAnimationFrame(animate);
            
            const delta = clock.getDelta() * simulationSpeed;
            
            if (!realTimeMode) {
                // Mode simulation
                updatePlanetPositions(delta);
            }
            
            // Mise à jour des contrôles
            controls.update();
            
            // Mise à jour des étiquettes
            updateLabels();
            
            // Mise à jour des lignes de distance
            if (showDistances) {
                updateDistanceLines();
            }
            
            // Mise à jour des informations orbitales
            updateOrbitalInfo();
            
            renderer.render(scene, camera);
        }

        function updatePlanetPositions(delta) {
            const distanceScale = 10;
            
            // Rotation du soleil
            sun.rotation.y += planetData.sun.rotationSpeed * delta;
            
            // Mise à jour des positions des planètes
            for (const key in planetData) {
                if (key === 'sun') continue;
                
                const planet = planetData[key];
                const mesh = planetMeshes[key];
                
                // Rotation de la planète
                mesh.rotation.y += planet.rotationSpeed * delta;
                
                // Orbite de la planète
                if (!planet.parentPlanet) {
                    const angle = Date.now() * 0.0001 * planet.orbitSpeed * simulationSpeed;
                    mesh.position.x = Math.cos(angle) * planet.orbitRadius * distanceScale;
                    mesh.position.z = Math.sin(angle) * planet.orbitRadius * distanceScale;
                }
            }
        }

        function calculateRealPlanetPositions() {
            const distanceScale = 10;
            const now = new Date();
            
            // Calculer les positions des planètes basées sur la date actuelle
            for (const key in planetData) {
                if (key === 'sun' || key === 'moon') continue;
                
                const planet = planetData[key];
                const mesh = planetMeshes[key];
                
                // Calculer la position orbitale basée sur des formules astronomiques simplifiées
                const angle = getRealPlanetAngle(key, now);
                
                mesh.position.x = Math.cos(angle) * planet.orbitRadius * distanceScale;
                mesh.position.z = Math.sin(angle) * planet.orbitRadius * distanceScale;
            }
            
            // Position de la Lune autour de la Terre
            const moonAngle = getRealMoonAngle(now);
            const moon = planetMeshes.moon;
            const moonOrbitRadius = planetData.moon.orbitRadius * distanceScale;
            
            moon.position.x = Math.cos(moonAngle) * moonOrbitRadius;
            moon.position.z = Math.sin(moonAngle) * moonOrbitRadius;
        }

        function getRealPlanetAngle(planetName, date) {
            // Formules simplifiées pour calculer la position angulaire des planètes
            // Ces formules sont des approximations
            
            // Nombre de jours depuis J2000 (1er janvier 2000 à 12h UTC)
            const j2000 = new Date(2000, 0, 1, 12, 0, 0);
            const daysSinceJ2000 = (date - j2000) / (1000 * 60 * 60 * 24);
            
            // Éléments orbitaux simplifiés (valeurs moyennes)
            const orbitalElements = {
                mercury: { period: 87.969, offset: 174.795 * Math.PI / 180 },
                venus: { period: 224.701, offset: 50.115 * Math.PI / 180 },
                earth: { period: 365.256, offset: 357.529 * Math.PI / 180 },
                mars: { period: 686.980, offset: 19.373 * Math.PI / 180 },
                jupiter: { period: 4332.589, offset: 20.020 * Math.PI / 180 },
                saturn: { period: 10759.22, offset: 317.020 * Math.PI / 180 },
                uranus: { period: 30688.5, offset: 141.050 * Math.PI / 180 },
                neptune: { period: 60182, offset: 256.225 * Math.PI / 180 },
                pluto: { period: 90560, offset: 14.882 * Math.PI / 180 }
            };
            
            const elements = orbitalElements[planetName];
            if (!elements) return 0;
            
            // Calculer l'angle moyen (en radians)
            const meanAngle = (daysSinceJ2000 / elements.period) * 2 * Math.PI + elements.offset;
            
            // Retourner l'angle normalisé entre 0 et 2π
            return meanAngle % (2 * Math.PI);
        }

        function getRealMoonAngle(date) {
            // Formule simplifiée pour la position de la Lune
            const j2000 = new Date(2000, 0, 1, 12, 0, 0);
            const daysSinceJ2000 = (date - j2000) / (1000 * 60 * 60 * 24);
            
            // Période orbitale de la Lune: 27.32 jours
            const moonPeriod = 27.32;
            const moonOffset = 125.1228 * Math.PI / 180;
            
            const meanAngle = (daysSinceJ2000 / moonPeriod) * 2 * Math.PI + moonOffset;
            return meanAngle % (2 * Math.PI);
        }

        function updateOrbitalInfo() {
            const orbitalInfo = document.querySelector('.orbital-info');
            
            if (selectedPlanet === 'sun') {
                orbitalInfo.textContent = 'Le Soleil tourne sur lui-même en environ 25 jours à l\'équateur';
                orbitalInfo.classList.add('visible');
            } else if (selectedPlanet === 'earth') {
                orbitalInfo.textContent = 'La vitesse orbitale de la Terre est d\'environ 30 km/s';
                orbitalInfo.classList.add('visible');
            } else if (selectedPlanet === 'moon') {
                orbitalInfo.textContent = 'La Lune s\'éloigne de la Terre d\'environ 3,8 cm par an';
                orbitalInfo.classList.add('visible');
            } else if (selectedPlanet === 'mars') {
                orbitalInfo.textContent = 'Mars a une orbite plus elliptique que la Terre';
                orbitalInfo.classList.add('visible');
            } else if (selectedPlanet === 'jupiter') {
                orbitalInfo.textContent = 'Jupiter effectue une rotation complète en moins de 10 heures';
                orbitalInfo.classList.add('visible');
            } else if (selectedPlanet === 'saturn') {
                orbitalInfo.textContent = 'Les anneaux de Saturne sont composés principalement de glace et de poussière';
                orbitalInfo.classList.add('visible');
            } else if (selectedPlanet === 'uranus') {
                orbitalInfo.textContent = 'Uranus tourne "sur le côté" avec un axe incliné à près de 98°';
                orbitalInfo.classList.add('visible');
            } else if (selectedPlanet === 'neptune') {
                orbitalInfo.textContent = 'Neptune a les vents les plus rapides du système solaire, atteignant 2 100 km/h';
                orbitalInfo.classList.add('visible');
            } else if (selectedPlanet === 'pluto') {
                orbitalInfo.textContent = 'L\'orbite de Pluton est si elliptique qu\'elle croise parfois celle de Neptune';
                orbitalInfo.classList.add('visible');
            } else if (selectedPlanet === 'mercury') {
                orbitalInfo.textContent = 'Mercure n\'a presque pas d\'atmosphère et sa température varie de -173°C à 427°C';
                orbitalInfo.classList.add('visible');
            } else if (selectedPlanet === 'venus') {
                orbitalInfo.textContent = 'Vénus tourne dans le sens inverse des autres planètes (rotation rétrograde)';
                orbitalInfo.classList.add('visible');
            } else {
                orbitalInfo.classList.remove('visible');
            }
        }

        function updateCurrentDate() {
            const now = new Date();
            document.getElementById('current-date').textContent = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
            
            // Mettre à jour toutes les secondes
            setTimeout(updateCurrentDate, 1000);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function onMouseClick(event) {
            // Calculer la position de la souris en coordonnées normalisées (-1 à +1)
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            // Mettre à jour le raycaster
            raycaster.setFromCamera(mouse, camera);
            
            // Créer un tableau de tous les objets à tester
            const objectsToTest = [];
            for (const key in planetMeshes) {
                objectsToTest.push(planetMeshes[key]);
            }
            
            // Calculer les objets en intersection avec le rayon
            const intersects = raycaster.intersectObjects(objectsToTest, true);
            
            if (intersects.length > 0) {
                // Trouver l'objet parent qui est une planète
                let clickedObject = intersects[0].object;
                let planetKey = null;
                
                // Remonter dans la hiérarchie pour trouver la planète
                while (clickedObject && !planetKey) {
                    for (const key in planetMeshes) {
                        if (planetMeshes[key] === clickedObject) {
                            planetKey = key;
                            break;
                        }
                    }
                    
                    if (!planetKey && clickedObject.parent) {
                        clickedObject = clickedObject.parent;
                    } else {
                        break;
                    }
                }
                
                if (planetKey) {
                    selectPlanet(planetKey);
                    
                    // Mettre à jour les boutons
                    document.querySelectorAll('.planet-button').forEach(btn => {
                        btn.classList.remove('active');
                        if (btn.dataset.planet === selectedPlanet) {
                            btn.classList.add('active');
                        }
                    });
                }
            }
        }

        function selectPlanet(planetName) {
            selectedPlanet = planetName;
            
            // Mettre à jour le panneau d'information
            const infoPanel = document.querySelector('.info-panel');
            const planetNameElement = infoPanel.querySelector('.planet-name');
            const planetInfoElement = infoPanel.querySelector('.planet-info');
            const planetDataElement = infoPanel.querySelector('.planet-data');
            
            planetNameElement.textContent = planetData[planetName].name;
            planetInfoElement.textContent = planetData[planetName].info;
            
            // Effacer les anciennes données
            planetDataElement.innerHTML = '';
            
            // Ajouter les nouvelles données
            for (const [key, value] of Object.entries(planetData[planetName].data)) {
                const div = document.createElement('div');
                div.innerHTML = `${key}: <span>${value}</span>`;
                planetDataElement.appendChild(div);
            }
            
            // Animation de la caméra vers la planète sélectionnée
            const planet = planetMeshes[planetName];
            
            // Déterminer la distance de la caméra en fonction de la taille de la planète
            let distance;
            if (planetName === 'sun') {
                distance = 20;
            } else if (['jupiter', 'saturn'].includes(planetName)) {
                distance = 15;
            } else if (['uranus', 'neptune'].includes(planetName)) {
                distance = 10;
            } else {
                distance = 5;
            }
            
            const targetPosition = new THREE.Vector3();
            planet.getWorldPosition(targetPosition);
            
            // Calculer une position décalée pour la caméra
            const offset = new THREE.Vector3(distance, distance * 0.5, distance);
            const targetCameraPosition = targetPosition.clone().add(offset);
            
            // Animation avec une fonction d'easing personnalisée
            const startPosition = camera.position.clone();
            const startTarget = controls.target.clone();
            const animationDuration = 1000; // ms
            const startTime = Date.now();
            
            function animateCamera() {
                const elapsedTime = Date.now() - startTime;
                const progress = Math.min(elapsedTime / animationDuration, 1);
                
                // Fonction d'easing
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                
                camera.position.lerpVectors(startPosition, targetCameraPosition, easeProgress);
                controls.target.lerpVectors(startTarget, targetPosition, easeProgress);
                
                if (progress < 1) {
                    requestAnimationFrame(animateCamera);
                }
            }
            
            animateCamera();
            
            // Mettre à jour les lignes de distance si activées
            if (showDistances) {
                updateDistanceLines();
            }
        }

        function toggleOrbits() {
            showOrbits = !showOrbits;
            
            for (const key in planetOrbits) {
                planetOrbits[key].visible = showOrbits;
            }
            
            const button = document.getElementById('toggle-orbits');
            if (showOrbits) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        }

        function toggleLabels() {
            showLabels = !showLabels;
            
            const button = document.getElementById('toggle-labels');
            if (showLabels) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        }

        function toggleDistances() {
            showDistances = !showDistances;
            
            const button = document.getElementById('toggle-distances');
            if (showDistances) {
                button.classList.add('active');
                updateDistanceLines();
            } else {
                button.classList.remove('active');
                // Supprimer les lignes
                for (const key in distanceLines) {
                    if (distanceLines[key].line) {
                        document.querySelector('.ui-container').removeChild(distanceLines[key].line);
                    }
                    if (distanceLines[key].label) {
                        document.querySelector('.ui-container').removeChild(distanceLines[key].label);
                    }
                }
                distanceLines = {};
            }
        }

        function toggleControls() {
            controlsVisible = !controlsVisible;
            
            const controlsPanel = document.querySelector('.controls-panel');
            if (controlsVisible) {
                controlsPanel.style.display = 'block';
                document.getElementById('toggle-controls').classList.add('active');
            } else {
                controlsPanel.style.display = 'none';
                document.getElementById('toggle-controls').classList.remove('active');
            }
        }

        function updateSpeed(event) {
            simulationSpeed = parseFloat(event.target.value);
        }

        function updatePlanetScale(event) {
            planetScale = parseFloat(event.target.value);
            
            // Mettre à jour l'échelle de toutes les planètes
            for (const key in planetData) {
                const planet = planetData[key];
                const mesh = planetMeshes[key];
                
                if (key === 'sun') {
                    // Le soleil a une échelle fixe
                    mesh.scale.set(1, 1, 1);
                } else {
                    // Calculer la nouvelle échelle
                    const baseScale = 1;
                    const scaleMultiplier = planetScale / 5; // 5 est la valeur par défaut
                    
                    mesh.scale.set(baseScale * scaleMultiplier, baseScale * scaleMultiplier, baseScale * scaleMultiplier);
                }
            }
        }

        function toggleRealTime(event) {
            realTimeMode = event.target.checked;

            if (realTimeMode) {
                calculateRealPlanetPositionsAPI();
            }
        }

        function toggleHelp() {
            helpVisible = !helpVisible;
            const helpPanel = document.querySelector('.help-panel');
            
            if (helpVisible) {
                helpPanel.classList.add('visible');
            } else {
                helpPanel.classList.remove('visible');
            }
        }

async function fetchPlanetPositions(date = new Date()) {
    const baseUrl = 'https://api.astronomyapi.com/api/v2/bodies/positions';
    const planets = [
        'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'
    ];
    const dateStr = date.toISOString().split('T')[0];
    const observer = { latitude: 0, longitude: 0, elevation: 0 };
    const positions = {};

    for (const planet of planets) {
        const url = `${baseUrl}/${planet}?latitude=${observer.latitude}&longitude=${observer.longitude}&elevation=${observer.elevation}&from_date=${dateStr}&to_date=${dateStr}&time=00:00:00`;
        const response = await fetch(url, {
            headers: {
                'Authorization': 'Basic ' + btoa(`${ASTRONOMY_API_KEY}:${ASTRONOMY_API_SECRET}`)
            }
        });
        if (response.ok) {
            const data = await response.json();
            const pos = data.data.table.rows[0].cells[0].position;
            // Correction ici : on prend fromSun si dispo, sinon fromEarth
            let distance = pos.distance.fromSun?.au ?? pos.distance.fromEarth?.au ?? 0;
            positions[planet] = {
                distance: distance,
                angle: pos.ecliptic.lon.decimal
            };
        }
    }
    return positions;
}

async function calculateRealPlanetPositionsAPI() {
    const distanceScale = 10;
    const now = new Date();
    const positions = await fetchPlanetPositions(now);

    for (const key in positions) {
        const mesh = planetMeshes[key];
        if (!mesh) continue;
        const { distance, angle } = positions[key];
        // Convertir l’angle en radians
        const rad = angle * Math.PI / 180;
        mesh.position.x = Math.cos(rad) * distance * distanceScale;
        mesh.position.z = Math.sin(rad) * distance * distanceScale;
    }
}