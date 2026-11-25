import * as THREE from 'three';
import { GLTFLoader } from './GLTFLoader.js';



const scene = new THREE.Scene();
scene.background = null;




// VIDEO FONDO DEL JUEGO
const videoMenu = document.createElement('video');

videoMenu.src = './videos/fondoMenu.mp4';
videoMenu.loop = true;
videoMenu.muted = true;
videoMenu.playsInline = true;
videoMenu.autoplay = true;
videoMenu.style.position = 'fixed';
videoMenu.style.top = '0';
videoMenu.style.left = '0';
videoMenu.style.width = '100%';
videoMenu.style.height = '100%';
videoMenu.style.objectFit = 'cover';

videoMenu.style.zIndex = '-1';
videoMenu.style.pointerEvents = 'none';
document.body.appendChild(videoMenu);
videoMenu.play().catch(() => { console.log('El video del menú espera permiso del navegador'); });



// CAPA OSCURA TRANSPARENTE SOBRE EL VIDEO
const capaOscura = document.createElement('div');

capaOscura.style.position = 'fixed';
capaOscura.style.top = '0';
capaOscura.style.left = '0';
capaOscura.style.width = '100%';
capaOscura.style.height = '100%';
capaOscura.style.background = 'rgba(0, 0, 0, 0.28)';
capaOscura.style.zIndex = '-0.5';
capaOscura.style.pointerEvents = 'none';

document.body.appendChild(capaOscura);





//luces
const luzAmbiental = new THREE.AmbientLight(0xffffff, 0.80);
scene.add(luzAmbiental);

const luzDireccional = new THREE.DirectionalLight(0xffffff, 3);
luzDireccional.position.set(5, 10, 5);
scene.add(luzDireccional);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 3, 6);
camera.lookAt(0, 0, 0);



const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(1);



renderer.domElement.style.position = 'fixed';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.zIndex = '0';
document.body.appendChild(renderer.domElement);


// NAVE - PERSONAJE PRINCIPAL
let cube = null;
const loader = new GLTFLoader();

loader.load('./modelos/navebueno.glb',
    (gltf) => {
        cube = gltf.scene;
        // POSICIÓN INICIAL
        cube.position.set(0, 0, 0);
        // ESCALA
        cube.scale.set(0.42, 0.42, 0.42);
        // ROTACIÓN
        cube.rotation.x = 0;
        // AGREGAR A LA ESCENA
        // AGREGAR A LA ESCENA
        scene.add(cube);


        // ======================================
        // RESPLANDOR MORADO ALREDEDOR DE LA NAVE
        // ======================================

        // Crear una luz suave alrededor de la nave
        const luzAuraNave = new THREE.PointLight(
            0x9b65ff,
            5,
            9,
            2
        );

        // Posición de la luz
        luzAuraNave.position.set(0, 3.5, 0);

        // Agregarla a la nave
        cube.add(luzAuraNave);

        // Crear un halo visual
        const texturaAura = new THREE.TextureLoader().load(
            './imagenes/brillo.png'
        );

        const materialAura = new THREE.SpriteMaterial({
            map: texturaAura,
            color: 0xb58aff,
            transparent: true,
            opacity: 1,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const auraNave = new THREE.Sprite(materialAura);

        // Tamaño del resplandor
        auraNave.scale.set(5, 5, 2);

        // Colocarlo alrededor de la nave
        auraNave.position.set(0, 0, 0);

        cube.add(auraNave);

        console.log('Nave cargada correctamente');

    },

    (xhr) => {

        if (xhr.total > 0) {
            const porcentaje =
                (xhr.loaded / xhr.total) * 100;
            console.log(
                'Nave:',
                porcentaje.toFixed(0) + '% cargada'
            );

        }

    },

    (error) => {
        console.error(
            ' Error al cargar nave.glb:',
            error
        );

    }
);


// PISO
const planeGeometry = new THREE.PlaneGeometry(20, 3900);
const texturaPiso = new THREE.TextureLoader().load('./imagenes/piso.jpg');
texturaPiso.wrapS = THREE.RepeatWrapping;
texturaPiso.wrapT = THREE.RepeatWrapping;
texturaPiso.repeat.set(1, 100);
const planeMaterial = new THREE.MeshBasicMaterial({ map: texturaPiso, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2;
plane.position.y = -1.5;
scene.add(plane);



// CONTROLES

const keys = {};
window.addEventListener(
    'keydown',
    (event) => {
        keys[event.code] = true;
    }
);
window.addEventListener(
    'keyup',
    (event) => {
        keys[event.code] = false;

    }
);




// ======================================
// JOYSTICK VIRTUAL PARA CELULAR Y TABLET
// ======================================

const controlesMoviles = document.createElement('div');
controlesMoviles.id = 'joystickMovil';

controlesMoviles.style.position = 'fixed';

// TAMAÑO DEL JOYSTICK
controlesMoviles.style.width = 'clamp(150px, 24vw, 210px)';
controlesMoviles.style.height = 'clamp(150px, 24vw, 210px)';

controlesMoviles.style.bottom = '35px';

// DETECTAR SI ES TABLET
const esTablet = window.matchMedia('(min-width: 768px) and (pointer: coarse)').matches;

if (esTablet) {

    // TABLET: ABAJO A LA DERECHA
    controlesMoviles.style.left = 'auto';
    controlesMoviles.style.right = '35px';
    controlesMoviles.style.transform = 'none';

} else {

    // CELULAR: CENTRADO
    controlesMoviles.style.left = '50%';
    controlesMoviles.style.right = 'auto';
    controlesMoviles.style.transform = 'translateX(-50%)';

}





controlesMoviles.style.borderRadius = '50%';
controlesMoviles.style.background = 'rgba(35, 20, 75, 0.55)';
controlesMoviles.style.border = '3px solid rgba(190, 150, 255, 0.8)';
controlesMoviles.style.boxShadow = '0 0 18px rgba(130, 70, 255, 0.5)';
controlesMoviles.style.touchAction = 'none';
controlesMoviles.style.userSelect = 'none';
controlesMoviles.style.display = 'none';
controlesMoviles.style.zIndex = '10000';

// BOLITA DEL JOYSTICK
const bolitaJoystick = document.createElement('div');

bolitaJoystick.style.position = 'absolute';
bolitaJoystick.style.width = '42%';
bolitaJoystick.style.height = '42%';
bolitaJoystick.style.left = '50%';
bolitaJoystick.style.top = '50%';
bolitaJoystick.style.transform = 'translate(-50%, -50%)';
bolitaJoystick.style.borderRadius = '50%';
bolitaJoystick.style.background = 'linear-gradient(145deg, #c7a4ff, #7135c9)';
bolitaJoystick.style.border = '2px solid white';
bolitaJoystick.style.boxShadow = '0 0 15px rgba(180, 120, 255, 0.9)';
bolitaJoystick.style.pointerEvents = 'none';

controlesMoviles.appendChild(bolitaJoystick);
document.body.appendChild(controlesMoviles);


// DETECTAR DISPOSITIVOS TÁCTILES
const esDispositivoTactil =
    window.matchMedia('(pointer: coarse)').matches;


// MOVIMIENTO DEL JOYSTICK
let joystickActivo = false;

function moverJoystick(event) {

    const rect = controlesMoviles.getBoundingClientRect();

    const centroX = rect.left + rect.width / 2;
    const centroY = rect.top + rect.height / 2;

    let dx = event.clientX - centroX;
    let dy = event.clientY - centroY;

    const radioMaximo = rect.width * 0.29;

    const distancia = Math.sqrt(dx * dx + dy * dy);

    // LIMITAR EL MOVIMIENTO DE LA BOLITA
    if (distancia > radioMaximo) {

        dx = (dx / distancia) * radioMaximo;
        dy = (dy / distancia) * radioMaximo;

    }

    // MOVER VISUALMENTE LA BOLITA
    bolitaJoystick.style.transform =
        `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;

    // ACTIVAR DIRECCIONES
    keys['ArrowLeft'] = dx < -radioMaximo * 0.22;
    keys['ArrowRight'] = dx > radioMaximo * 0.22;

    keys['ArrowUp'] = dy < -radioMaximo * 0.22;
    keys['ArrowDown'] = dy > radioMaximo * 0.22;

}


// INICIAR EL JOYSTICK
controlesMoviles.addEventListener('pointerdown', (event) => {

    event.preventDefault();

    joystickActivo = true;

    controlesMoviles.setPointerCapture(event.pointerId);

    moverJoystick(event);

});


// MOVER LA BOLITA
controlesMoviles.addEventListener('pointermove', (event) => {

    if (joystickActivo) {

        event.preventDefault();
        moverJoystick(event);

    }

});


// REGRESAR LA BOLITA AL CENTRO
function soltarJoystick() {

    joystickActivo = false;

    keys['ArrowLeft'] = false;
    keys['ArrowRight'] = false;
    keys['ArrowUp'] = false;
    keys['ArrowDown'] = false;

    bolitaJoystick.style.transform =
        'translate(-50%, -50%)';

}

controlesMoviles.addEventListener('pointerup', soltarJoystick);
controlesMoviles.addEventListener('pointercancel', soltarJoystick);
controlesMoviles.addEventListener('lostpointercapture', soltarJoystick);


// EVITAR QUE QUEDE ACTIVADO AL CAMBIAR DE VENTANA
window.addEventListener('blur', soltarJoystick);



// MOVIMIENTO DEL JUGADOR
const alturaMaxima = 6;

// VELOCIDAD DE LA NAVE

const velocidadNormal = 0.40;
const velocidadRapida = 0.70;
let velocidadActual = velocidadNormal;
let tiempoVelocidad = 0;


function mover() {
    // EVITAR ERROR SI LA NAVE TODAVÍA NO HA CARGADO
    if (!cube) return;
    const speed = velocidadActual;
    cube.position.z -= speed;


    if (keys['ArrowLeft']) {
        cube.position.x -= speed;
    }

    if (keys['ArrowRight']) {
        cube.position.x += speed;
    }
    if (keys['ArrowUp']) {
        cube.position.y += speed;
    }
    if (keys['ArrowDown']) {
        cube.position.y -= speed;
    }
    // LÍMITES
    cube.position.x =
        THREE.MathUtils.clamp(cube.position.x, -9.5, 9.5);
    // LÍMITE SUPERIOR
    cube.position.y =
        Math.min(cube.position.y, alturaMaxima);
    // LÍMITE DEL SUELO
    cube.position.y =
        Math.max(cube.position.y, -1);
}


// ESTRELLAS - MODELO 3D
const spheresInScene = [];
let estrellasParaGanar = 25;



// NIVELES


let nivelActual = 1;
const metasPorNivel = {
    1: 25,
    2: 30,
    3: 35
};

estrellasParaGanar = metasPorNivel[nivelActual];



// Aquí guardaremos el modelo que se usará como estrella
let modeloEstrella = null;

// Cargar modelo 3D de la estrella
const loaderEstrella = new GLTFLoader();

loaderEstrella.load('./modelos/estrella.glb',

    (gltf) => {

        modeloEstrella = gltf.scene;

        console.log(" Modelo de estrella cargado");

    },

    (xhr) => {
        if (xhr.total > 0) {
            const porcentaje =
                (xhr.loaded / xhr.total) * 100;

            console.log(
                "Estrella:",
                porcentaje.toFixed(0) + "% cargada"
            );
        }
    },

    (error) => {
        console.error(
            " Error al cargar estrella.glb:",
            error
        );
    }
);

let totalCollectedSpheres = 0;




// MODELOS ESPECIALES DE LOS TRES NIVELES

let modeloEspecial = null;
let modeloEspecial2 = null;
let modeloEspecial3 = null;

let centroEspecial = new THREE.Vector3();
let centroEspecial2 = new THREE.Vector3();
let centroEspecial3 = new THREE.Vector3();

const objetosEspeciales = [];

let especialesGenerados = 0;

// CARGAR MODELO DEL NIVEL 1
const loaderEspecial = new GLTFLoader();

loaderEspecial.load('./modelos/objeto_especial.glb', (gltf) => {

    modeloEspecial = gltf.scene;

    const caja = new THREE.Box3().setFromObject(modeloEspecial);
    centroEspecial = caja.getCenter(new THREE.Vector3());

    console.log("Objeto especial del nivel 1 cargado");

});

// CARGAR MODELO DEL NIVEL 2
const loaderEspecial2 = new GLTFLoader();

loaderEspecial2.load('./modelos/perso_2.glb', (gltf) => {

    modeloEspecial2 = gltf.scene;


    let cantidadMallas = 0;
    let totalVertices = 0;
    let totalTriangulos = 0;

    modeloEspecial2.traverse((parte) => {
        if (parte.isMesh && parte.geometry) {
            cantidadMallas++;

            const geometria = parte.geometry;

            if (geometria.attributes.position) {
                totalVertices += geometria.attributes.position.count;
            }

            if (geometria.index) {
                totalTriangulos += geometria.index.count / 3;
            } else if (geometria.attributes.position) {
                totalTriangulos += geometria.attributes.position.count / 3;
            }
        }
    });





    const caja = new THREE.Box3().setFromObject(modeloEspecial2);
    centroEspecial2 = caja.getCenter(new THREE.Vector3());

    console.log("Objeto especial del nivel 2 cargado");

});

// CARGAR MODELO DEL NIVEL 3
const loaderEspecial3 = new GLTFLoader();

loaderEspecial3.load('./modelos/adamena.glb', (gltf) => {

    modeloEspecial3 = gltf.scene;

    const caja = new THREE.Box3().setFromObject(modeloEspecial3);
    centroEspecial3 = caja.getCenter(new THREE.Vector3());

    console.log("Objeto especial del nivel 3 cargado");

});


// CREAR OBJETO ESPECIAL CON ILUMINACIÓN DORADA

function crearObjetoEspecial(modeloBase, centro, escala) {

    const objetoEspecial = new THREE.Group();

    const modelo = modeloBase.clone(true);

    // CENTRAR EL MODELO
    modelo.position.set(
        -centro.x * escala,
        -centro.y * escala,
        -centro.z * escala
    );

    // TAMAÑO DEL MODELO
    modelo.scale.set(escala, escala, escala);

    // MEJORAR EL MATERIAL
    modelo.traverse((parte) => {

        if (parte.isMesh && parte.material) {

            const materiales = Array.isArray(parte.material)
                ? parte.material
                : [parte.material];

            materiales.forEach((material) => {

                if (material.roughness !== undefined) {
                    material.roughness = 0.30;
                }

                if (material.metalness !== undefined) {
                    material.metalness = 0.25;
                }

                if (material.emissive !== undefined) {
                    material.emissive.set(0x5c3500);
                    material.emissiveIntensity = 0.35;
                }

                material.needsUpdate = true;

            });
        }
    });

    objetoEspecial.add(modelo);


    // ==================================
    // RESPLANDOR DORADO DEL PREMIO
    // ==================================

    // LUZ PRINCIPAL DESDE ARRIBA
    const luzSuperior = new THREE.SpotLight(
        0xffd66b,
        35,
        22,
        Math.PI / 5,
        0.65,
        1
    );

    luzSuperior.position.set(0, 6, 0);
    luzSuperior.target.position.set(0, 0, 0);

    objetoEspecial.add(luzSuperior);
    objetoEspecial.add(luzSuperior.target);


    // LUZ DORADA ALREDEDOR DEL MODELO
    const luzEspecial = new THREE.PointLight(
        0xffc247,
        8,
        10
    );

    luzEspecial.position.set(0, 1, 0);
    objetoEspecial.add(luzEspecial);


    // RESPLANDOR SUAVE
    const canvasBrillo = document.createElement('canvas');
    canvasBrillo.width = 256;
    canvasBrillo.height = 256;

    const contexto = canvasBrillo.getContext('2d');

    const gradiente = contexto.createRadialGradient(
        128, 128, 5,
        128, 128, 128
    );

    gradiente.addColorStop(0, 'rgba(255,255,220,0.95)');
    gradiente.addColorStop(0.2, 'rgba(255,220,100,0.65)');
    gradiente.addColorStop(0.5, 'rgba(255,170,30,0.25)');
    gradiente.addColorStop(1, 'rgba(255,170,30,0)');

    contexto.fillStyle = gradiente;
    contexto.fillRect(0, 0, 256, 256);

    const texturaBrillo = new THREE.CanvasTexture(canvasBrillo);

    const materialBrillo = new THREE.SpriteMaterial({
        map: texturaBrillo,
        color: 0xffd66b,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const resplandor = new THREE.Sprite(materialBrillo);

    resplandor.position.set(0, 1, 0);
    resplandor.scale.set(5, 5, 1);

    objetoEspecial.add(resplandor);


    // GUARDAR REFERENCIAS
    objetoEspecial.userData.luz = luzEspecial;
    objetoEspecial.userData.resplandor = resplandor;
    return objetoEspecial;

};



// SONIDO AL RECOLECTAR UNA ESTRELLA
const sonidoEstrella = new Audio('./sonidos/estrella.ogg');
sonidoEstrella.volume = 0.4;


// SONIDO AL RECOLECTAR UN CORAZÓN
const sonidoCorazon = new Audio('./sonidos/corazon.ogg');
sonidoCorazon.volume = 0.4;


// SONIDO AL RECOLECTAR UNA POCIÓN
const sonidoPocion = new Audio('./sonidos/posion.mp3');
sonidoPocion.volume = 0.4;

// MÚSICA DURANTE EL JUEGO
const musicaJuego = new Audio('./sonidos/musicaJuego.ogg');
musicaJuego.loop = true;
musicaJuego.volume = 0.10;


// SONIDO DE NITRO MIENTRAS DURA EL AUMENTO DE VELOCIDAD
const sonidoNitro = new Audio('./sonidos/nitro.mp3');
sonidoNitro.loop = true;
sonidoNitro.volume = 0.4;


// SONIDO AL CHOCAR CON UN OBSTÁCULO
const sonidoPiedra = new Audio('./sonidos/piedra.mp3');
sonidoPiedra.volume = 0.4;



// SONIDO AL PERDER EL JUEGO
const sonidoPerder = new Audio('./sonidos/perder.mp3');
sonidoPerder.volume = 0.5;




// SONIDO AL COMPLETAR NIVEL 1 Y 2
const sonidoGanarNivel = new Audio('./sonidos/ganarNivel.mp3');
sonidoGanarNivel.volume = 0.5;

// SONIDO AL COMPLETAR TODO EL JUEGO
const sonidoGanarJuego = new Audio('./sonidos/ganarJuego.mp3');
sonidoGanarJuego.volume = 0.5;

// VOZ AL INICIAR NIVEL 2
const sonidoNivel2 = new Audio('./sonidos/nivel2.mp3');
sonidoNivel2.volume = 0.8;

// VOZ AL INICIAR NIVEL 3
const sonidoNivel3 = new Audio('./sonidos/nivel3.mp3');
sonidoNivel3.volume = 0.8;

// MÚSICA DEL LOBBY
const musicaLobby = new Audio('./sonidos/musicaLobby.mp3');

musicaLobby.loop = true;
musicaLobby.volume = 0.25;

// SONIDO AL PRESIONAR CUALQUIER BOTÓN

const sonidoBoton = new Audio('./sonidos/boton.mp3');
sonidoBoton.volume = 0.5;

// DETECTAR CLICS EN TODOS LOS BOTONES
document.addEventListener('click', (event) => {

    if (event.target.closest('button')) {

        sonidoBoton.currentTime = 0;

        sonidoBoton.play().catch(error => {
            console.log("No se pudo reproducir el sonido del botón:", error);
        });

    }

});

// SONIDO DE RECOMPENSA PARA LOS TRES OBJETOS ESPECIALES
const sonidoRecompensa = new Audio('./sonidos/recompensa.mp3');
sonidoRecompensa.volume = 0.7;


// INICIAR MÚSICA DEL LOBBY
function iniciarMusicaLobby() {

    musicaLobby.play().catch(error => {
        console.log("Esperando interacción para reproducir música del lobby");
    });

}

// DETENER MÚSICA DEL LOBBY
function detenerMusicaLobby() {

    musicaLobby.pause();
    musicaLobby.currentTime = 0;

}




// OBSTÁCULOS

const vidaInScene = [];
const cantidadObstaculos = 25;
const obstaculosMoviles = [];

// CONTROL DE OBSTÁCULOS INICIALES
let obstaculosInicialesCreados = false;

// ENEMIGO 3D

let modeloEnemigo = null;

const loaderEnemigo = new GLTFLoader();

loaderEnemigo.load('./modelos/roca.glb',

    (gltf) => {

        modeloEnemigo = gltf.scene;

        console.log(" Modelo de enemigo cargado");
        crearObstaculosIniciales();

    },

    (xhr) => {

        if (xhr.total > 0) {

            const porcentaje =
                (xhr.loaded / xhr.total) * 100;

            console.log(
                "Enemigo:",
                porcentaje.toFixed(0) + "% cargado"
            );
        }

    },

    (error) => {

        console.error(
            " Error al cargar enemigo.glb:",
            error
        );

    }
);




// SEGUNDO ENEMIGO 3D: ENENAVE

let modeloEnemigo2 = null;

const loaderEnemigo2 = new GLTFLoader();

loaderEnemigo2.load(
    './modelos/enenave.glb',

    (gltf) => {
        modeloEnemigo2 = gltf.scene;

        console.log("Modelo enenave cargado correctamente");
        crearObstaculosIniciales();
    },

    undefined,

    (error) => {
        console.error("Error al cargar enenave.glb:", error);
    }
);

// TERCER ENEMIGO 3D

let modeloEnemigo3 = null;

const loaderEnemigo3 = new GLTFLoader();

loaderEnemigo3.load(
    './modelos/crater3.glb',

    (gltf) => {
        modeloEnemigo3 = gltf.scene;

        console.log("Modelo enemigo 3 cargado correctamente");
        crearObstaculosIniciales();
    },

    undefined,

    (error) => {
        console.error("Error al cargar enemigo3.glb:", error);
    }
);




// CREAR OBSTÁCULOS INICIALES

function crearObstaculosIniciales(reiniciar = false) {

    // ESPERAR A QUE CARGUEN LOS TRES MODELOS
    if (!modeloEnemigo || !modeloEnemigo2 || !modeloEnemigo3) {
        return;
    }

    // EVITAR DUPLICAR LOS OBSTÁCULOS
    if (obstaculosInicialesCreados && !reiniciar) {
        return;
    }

    // LIMPIAR OBSTÁCULOS DEL NIVEL ANTERIOR
    if (reiniciar) {

        for (const obstaculo of vidaInScene) {
            scene.remove(obstaculo);
        }

        vidaInScene.length = 0;
        obstaculosMoviles.length = 0;
    }

    // CREAR 25 OBSTÁCULOS INICIALES
    for (let i = 0; i < cantidadObstaculos; i++) {

        let obstaculo;

        const tipoObstaculo = Math.random();

        if (tipoObstaculo < 0.33) {

            obstaculo = modeloEnemigo.clone(true);
            obstaculo.scale.set(0.8, 0.8, 0.8);

        }
        else if (tipoObstaculo < 0.66) {

            obstaculo = modeloEnemigo2.clone(true);
            obstaculo.scale.set(0.14, 0.14, 0.14);

        }
        else {

            obstaculo = modeloEnemigo3.clone(true);
            obstaculo.scale.set(0.42, 0.42, 0.42);

        }

        // POSICIÓN ALEATORIA
        const x = THREE.MathUtils.randFloat(-8, 8);
        const y = THREE.MathUtils.randFloat(-1, 5);
        const z = THREE.MathUtils.randFloat(-650, -35);

        obstaculo.position.set(x, y, z);

        // AGREGAR A LA ESCENA
        scene.add(obstaculo);
        vidaInScene.push(obstaculo);

        // OBSTÁCULOS MÓVILES
        if (Math.random() < 0.3) {

            obstaculosMoviles.push({

                objeto: obstaculo,

                velocidad: THREE.MathUtils.randFloat(0.02, 0.06),

                direccion: Math.random() < 0.5 ? 1 : -1,

                limiteIzquierdo: -8,
                limiteDerecho: 8

            });

        }

    }

    obstaculosInicialesCreados = true;

    console.log("Obstáculos iniciales creados:", nivelActual);

}





// CORAZONES


const corazonesInScene = [];
const cantidadCorazones = 2;

let modeloCorazon = null;

const loaderCorazon = new GLTFLoader();

loaderCorazon.load('./modelos/corazon.glb',

    (gltf) => {

        modeloCorazon = gltf.scene;

        // CALCULAR EL CENTRO DEL MODELO ORIGINAL
        const caja = new THREE.Box3().setFromObject(modeloCorazon);
        const centro = caja.getCenter(new THREE.Vector3());

        console.log(" Modelo de corazón cargado");

        for (let i = 0; i < cantidadCorazones; i++) {
            // CREAR UN PIVOTE INDEPENDIENTE
            const pivoteCorazon = new THREE.Group();

            // CLONAR EL MODELO ORIGINAL
            const corazon = modeloCorazon.clone(true);

            // CENTRAR CADA COPIA SIN MODIFICAR EL ORIGINAL
            corazon.position.set(
                -centro.x,
                -centro.y,
                -centro.z
            );

            pivoteCorazon.add(corazon);

            const x = THREE.MathUtils.randFloat(-8, 8);
            const y = THREE.MathUtils.randFloat(-1, 5);
            const z = THREE.MathUtils.randFloat(-80, -650);

            pivoteCorazon.position.set(x, y, z);
            pivoteCorazon.scale.set(0.35, 0.35, 0.35);

            scene.add(pivoteCorazon);
            corazonesInScene.push(pivoteCorazon);
        }

    },

    undefined,

    (error) => {
        console.error(" Error al cargar corazon.glb:", error);
    }

);


// OBJETOS DE VELOCIDAD

const velocidadesInScene = [];
const cantidadVelocidades = 1;

// MODELO 3D DE LA POCIÓN DE VELOCIDAD

let modeloVelocidad = null;
const loaderVelocidad = new GLTFLoader();



// ======================================
// EFECTO MORADO Y AZUL DE LA POCIÓN
// ======================================

function agregarLuzPocion(pocion) {

    // LUZ MORADA DESDE ARRIBA
    const luzSuperiorPocion = new THREE.SpotLight(
        0xb56aff,
        18,
        15,
        Math.PI / 5,
        0.7,
        1
    );

    luzSuperiorPocion.position.set(0, 5, 0);
    luzSuperiorPocion.target.position.set(0, 0, 0);

    pocion.add(luzSuperiorPocion);
    pocion.add(luzSuperiorPocion.target);


    // LUZ AZUL ALREDEDOR
    const luzAzulPocion = new THREE.PointLight(
        0x398dff,
        5,
        10,
        2
    );

    luzAzulPocion.position.set(0, 1, 0);
    pocion.add(luzAzulPocion);


    // ESFERA DE ENERGÍA MORADA
    const geometriaAura = new THREE.SphereGeometry(1.5, 32, 32);

    const materialAura = new THREE.MeshBasicMaterial({
        color: 0x9b55ff,
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.BackSide
    });

    const aura = new THREE.Mesh(
        geometriaAura,
        materialAura
    );

    aura.scale.set(1, 1.2, 1);
    aura.position.set(0, 1.5, 0);
    pocion.add(aura);


    // SEGUNDA CAPA DE ENERGÍA AZUL
    const geometriaAzul = new THREE.SphereGeometry(1.2, 32, 32);

    const materialAzul = new THREE.MeshBasicMaterial({
        color: 0x438cff,
        transparent: true,
        opacity: 0.10,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.BackSide
    });

    const auraAzul = new THREE.Mesh(
        geometriaAzul,
        materialAzul
    );
    auraAzul.position.set(0, 1.5, 0);
    pocion.add(auraAzul);
}






loaderVelocidad.load('./modelos/pocion.glb',

    (gltf) => {

        modeloVelocidad = gltf.scene;

        console.log(" Modelo de poción cargado");

        // CREAR LA POCIÓN INICIAL

        for (let i = 0; i < cantidadVelocidades; i++
        ) {
            const velocidad = modeloVelocidad.clone(true);
            agregarLuzPocion(velocidad);
            const x = THREE.MathUtils.randFloat(-8, 8);
            const y = THREE.MathUtils.randFloat(-1, 5);
            const z = THREE.MathUtils.randFloat(-100, -650);

            velocidad.position.set(x, y, z);
            velocidad.scale.set(0.30, 0.30, 0.30);
            scene.add(velocidad);
            velocidadesInScene.push(velocidad);

        }

    },

    (xhr) => {

        if (xhr.total > 0) {

            const porcentaje =
                (xhr.loaded / xhr.total) * 100;

            console.log("Poción:",
                porcentaje.toFixed(0) + "% cargada"
            );

        }

    },

    (error) => {

        console.error(
            " Error al cargar pocion.glb:",
            error
        );

    }
);



// VIDAS
let totalCollectedvidas = 1;
// TEMPORIZADOR
let timer = 60;
const timerLabel = document.createElement('div');
timerLabel.id = 'hudTiempo';
let tiempoAnterior = Date.now();
timerLabel.style.position = 'absolute';
timerLabel.style.top = '66px';
timerLabel.style.right = '25px';
timerLabel.style.width = '180px';
timerLabel.style.height = '120px';
timerLabel.style.display = 'flex';
timerLabel.style.alignItems = 'center';
timerLabel.style.justifyContent = 'center';
timerLabel.style.backgroundImage = "url('./imagenes/tiempo.png')";
timerLabel.style.backgroundSize = '100% 100%';
timerLabel.style.backgroundPosition = 'center';
timerLabel.style.backgroundRepeat = 'no-repeat';
timerLabel.style.color = 'white';
timerLabel.style.fontSize = '30px';
timerLabel.style.fontFamily = "'texto', Arial, sans-serif";
timerLabel.style.fontWeight = 'none';
timerLabel.style.whiteSpace = 'nowrap';
timerLabel.style.boxSizing = 'border-box';

document.body.appendChild(timerLabel);
timerLabel.textContent = ` ${timer}`;

//LETRERO NIVEL 2 EN PANTALLA
const nivelLabel = document.createElement('div');
nivelLabel.id = 'hudNivel';

nivelLabel.textContent = 'NIVEL 1';

nivelLabel.style.position = 'fixed';
nivelLabel.style.top = '20px';
nivelLabel.style.left = '50%';
nivelLabel.style.transform = 'translateX(-50%)';
nivelLabel.style.fontSize = '35px';
nivelLabel.style.fontWeight = 'bold';
nivelLabel.style.color = 'white';
nivelLabel.style.fontFamily = 'Arial';
nivelLabel.style.zIndex = '9998';
nivelLabel.style.textShadow = '3px 3px 5px black';

document.body.appendChild(nivelLabel);


//  SPAWN
const distanciaMinimaSpawn = 80;
const distanciaMaximaSpawn = 140;
// Último momento en que apareció

let ultimoSpawnEstrella = Date.now();
let ultimoSpawnObstaculo = Date.now();
let ultimoSpawnCorazon = Date.now();
// APARICIÓN DEL OBJETO ESPECIAL
let ultimoSpawnEspecial = Date.now();


//  Una estrella cada 1.5 segundos
let intervaloEstrella = 800;
//  Un obstáculo cada 0.8 segundos
let intervaloObstaculo = 1200;
//  Un corazón cada 8 segundos
const intervaloCorazon = 8000;


//  Poder de velocidad cada cierto tiempo

const intervaloVelocidad = 15000;

let ultimoSpawnVelocidad = Date.now();



// CONTADOR DE ESTRELLAS
const totalCoinsLabel = document.createElement('div');
totalCoinsLabel.id = 'hudEstrellas';

totalCoinsLabel.style.position = 'absolute';
totalCoinsLabel.style.top = '5px';
totalCoinsLabel.style.left = '16px';
totalCoinsLabel.style.width = '180px';
totalCoinsLabel.style.height = '130px';
totalCoinsLabel.style.display = 'flex';
totalCoinsLabel.style.alignItems = 'center';

// MOVER LOS NÚMEROS HACIA LA DERECHA
totalCoinsLabel.style.justifyContent = 'center';
totalCoinsLabel.style.paddingLeft = '35px';

totalCoinsLabel.style.backgroundImage = "url('./imagenes/estrellas.png')";
totalCoinsLabel.style.backgroundSize = '100% 100%';
totalCoinsLabel.style.backgroundPosition = 'center';
totalCoinsLabel.style.backgroundRepeat = 'no-repeat';
totalCoinsLabel.style.color = 'white';
totalCoinsLabel.style.fontSize = '28px';
totalCoinsLabel.style.fontFamily = "'texto', Arial, sans-serif";
totalCoinsLabel.style.fontWeight = 'none';
totalCoinsLabel.style.whiteSpace = 'nowrap';
totalCoinsLabel.style.boxSizing = 'border-box';

document.body.appendChild(totalCoinsLabel);

totalCoinsLabel.textContent = `0 / ${estrellasParaGanar}`;




// VIDAS EN PANTALLA
const totalVidasLabel = document.createElement('div');
totalVidasLabel.id = 'hudVidas';

totalVidasLabel.style.position = 'absolute';
totalVidasLabel.style.top = '1px';
totalVidasLabel.style.right = '25px';
totalVidasLabel.style.width = '180px';
totalVidasLabel.style.height = '120px';
totalVidasLabel.style.display = 'flex';
totalVidasLabel.style.alignItems = 'center';
totalVidasLabel.style.justifyContent = 'center';
totalVidasLabel.style.backgroundImage = "url('./imagenes/corazones.png')";
totalVidasLabel.style.backgroundSize = '100% 100%';
totalVidasLabel.style.backgroundPosition = 'center';
totalVidasLabel.style.backgroundRepeat = 'no-repeat';
totalVidasLabel.style.boxSizing = 'border-box';

document.body.appendChild(totalVidasLabel);
const corazonImagen = './imagenes/corazon.png';


// CORAZÓN QUE VUELA HACIA EL CONTADOR
function animarCorazonRecolectado(corazon) {

    // CONVERTIR LA POSICIÓN 3D A POSICIÓN DE PANTALLA
    const posicion = corazon.position.clone();
    posicion.project(camera);

    const rect = renderer.domElement.getBoundingClientRect();

    const inicioX = rect.left + (posicion.x * 0.5 + 0.5) * rect.width;
    const inicioY = rect.top + (-posicion.y * 0.5 + 0.5) * rect.height;

    // LOCALIZAR EL CONTADOR DE VIDAS
    const destino = totalVidasLabel.getBoundingClientRect();

    const destinoX = destino.left + destino.width / 2;
    const destinoY = destino.top + destino.height / 2;

    // CREAR CORAZÓN VISUAL
    const corazonVolador = document.createElement('img');

    corazonVolador.src = corazonImagen;

    corazonVolador.style.position = 'fixed';
    corazonVolador.style.left = inicioX + 'px';
    corazonVolador.style.top = inicioY + 'px';
    corazonVolador.style.width = '45px';
    corazonVolador.style.height = '45px';
    corazonVolador.style.objectFit = 'contain';
    corazonVolador.style.zIndex = '999999';
    corazonVolador.style.pointerEvents = 'none';
    corazonVolador.style.filter = 'drop-shadow(0 0 10px #ff4b91)';
    corazonVolador.style.transition = 'all 0.65s cubic-bezier(.2,.8,.3,1)';

    document.body.appendChild(corazonVolador);

    // INICIAR VUELO HACIA EL CONTADOR
    requestAnimationFrame(() => {

        corazonVolador.style.left = destinoX + 'px';
        corazonVolador.style.top = destinoY + 'px';
        corazonVolador.style.transform = 'translate(-50%, -50%) scale(0.25)';
        corazonVolador.style.opacity = '0.2';

    });

    // ELIMINAR AL TERMINAR
    setTimeout(() => {
        corazonVolador.remove();
    }, 700);
}


totalVidasLabel.innerHTML = ` <img  src="${corazonImagen}" width="40" >`;




// PRECARGAR VIDEOS DE GANAR Y PERDER
const videosFinales = {};
function precargarVideoFinal(nombre, ruta) {

    const video = document.createElement('video');
    video.src = ruta;
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    video.loop = false;

    // Mantenerlo fuera de la pantalla sin display:none
    video.style.position = 'fixed';
    video.style.width = '1px';
    video.style.height = '1px';
    video.style.opacity = '0';
    video.style.pointerEvents = 'none';
    video.style.zIndex = '-10';

    document.body.appendChild(video);
    video.load();
    videosFinales[nombre] = video;
}

// VIDEOS HORIZONTALES PARA COMPUTADORA
precargarVideoFinal('ganar', './videos/ganaste.mp4');
precargarVideoFinal('perderTiempo', './videos/perdiste.mp4');
precargarVideoFinal('perderVidas', './videos/perdistevidas.mp4');

// VIDEOS VERTICALES PARA CELULAR Y TABLET
precargarVideoFinal('ganarVertical', './videos/ganaste-vertical.mp4');
precargarVideoFinal('perderTiempoVertical', './videos/perdiste-vertical.mp4');
precargarVideoFinal('perderVidasVertical', './videos/perdistevidas-vertical.mp4');




// PANTALLA FINAL
let juegoTerminado = false;
let juegoIniciado = false;

// CONTROL DE PAUSA
let juegoPausado = false;

// IDENTIFICAR SI EL JUGADOR PERDIÓ
let fueDerrota = false;


const pantallaFinal = document.createElement('div');
pantallaFinal.id = 'pantallaFinal';

pantallaFinal.style.position = 'fixed';
pantallaFinal.style.top = '0';
pantallaFinal.style.left = '0';
pantallaFinal.style.width = '100%';
pantallaFinal.style.height = '100%';
pantallaFinal.style.display = 'none';
pantallaFinal.style.justifyContent = 'center';
pantallaFinal.style.alignItems = 'center';
pantallaFinal.style.flexDirection = 'column';
pantallaFinal.style.backgroundSize = '100% 100%';
pantallaFinal.style.backgroundPosition = 'center 20%';
pantallaFinal.style.backgroundRepeat = 'no-repeat';
pantallaFinal.style.color = 'white';
pantallaFinal.style.fontFamily = 'Arial';
pantallaFinal.style.zIndex = '10000';
pantallaFinal.style.boxSizing = 'border-box';

document.body.appendChild(pantallaFinal);



// ======================================
// BOTÓN DE PAUSA
// ======================================

const botonPausa = document.createElement('button');

botonPausa.id = 'botonPausa';
botonPausa.textContent = 'Ⅱ';

botonPausa.style.position = 'fixed';
botonPausa.style.bottom = '25px';
botonPausa.style.left = '25px';
botonPausa.style.width = '60px';
botonPausa.style.height = '60px';
botonPausa.style.borderRadius = '50%';
botonPausa.style.border = '2px solid white';
botonPausa.style.background = 'rgba(100, 35, 190, 0.85)';
botonPausa.style.color = 'white';
botonPausa.style.fontSize = '30px';
botonPausa.style.fontWeight = 'bold';
botonPausa.style.cursor = 'pointer';
botonPausa.style.zIndex = '10001';
botonPausa.style.display = 'none';

document.body.appendChild(botonPausa);


// ======================================
// PANTALLA DE PAUSA
// ======================================

const pantallaPausa = document.createElement('div');

pantallaPausa.id = 'pantallaPausa';

pantallaPausa.style.position = 'fixed';
pantallaPausa.style.inset = '0';
pantallaPausa.style.width = '100vw';
pantallaPausa.style.height = '100dvh';
pantallaPausa.style.background = 'rgba(5, 5, 25, 0.78)';
pantallaPausa.style.backdropFilter = 'blur(7px)';
pantallaPausa.style.display = 'none';
pantallaPausa.style.flexDirection = 'column';
pantallaPausa.style.justifyContent = 'center';
pantallaPausa.style.alignItems = 'center';
pantallaPausa.style.gap = '25px';
pantallaPausa.style.zIndex = '10002';
pantallaPausa.style.fontFamily = 'Arial';

pantallaPausa.innerHTML = `
    <h1 style="
        color: white;
        font-size: clamp(35px, 6vw, 65px);
        
        margin: 0;
        font-family:texto;
    ">
        JUEGO EN PAUSA
    </h1>

    <button id="botonContinuarPausa" style="
        padding: 15px 45px;
        border: 2px solid white;
        border-radius: 15px;
        background: linear-gradient(#b77aff, #7025d6);
        color: white;
        font-size: clamp(18px, 3vw, 25px);
        font-weight: bold;
        cursor: pointer;
         font-family:texto;
    ">
        CONTINUAR
    </button>
`;

document.body.appendChild(pantallaPausa);






// ======================================
// FUNCIONES DE PAUSA
// ======================================

function pausarJuego() {

    if (!juegoIniciado || juegoTerminado || juegoPausado) {
        return;
    }

    juegoPausado = true;

    // PAUSAR MÚSICA
    musicaJuego.pause();
    sonidoNitro.pause();

    // MOSTRAR PANTALLA DE PAUSA
    pantallaPausa.style.display = 'flex';

    // CAMBIAR BOTÓN
    botonPausa.textContent = '▶';

}


function continuarJuego() {

    if (!juegoPausado) return;

    juegoPausado = false;

    // REANUDAR MÚSICA
    musicaJuego.play().catch(error => {
        console.log('No se pudo reanudar la música:', error);
    });

    // OCULTAR PANTALLA
    pantallaPausa.style.display = 'none';

    // CAMBIAR BOTÓN
    botonPausa.textContent = 'Ⅱ';

}


// EVENTOS DE LOS BOTONES

botonPausa.addEventListener('click', () => {

    if (juegoPausado) {
        continuarJuego();
    } else {
        pausarJuego();
    }

});

document.getElementById('botonContinuarPausa')
    .addEventListener('click', continuarJuego);


// TECLA ESC PARA PAUSAR O CONTINUAR EN PC

window.addEventListener('keydown', (event) => {

    if (event.code === 'Escape' && juegoIniciado && !juegoTerminado) {

        if (juegoPausado) {
            continuarJuego();
        } else {
            pausarJuego();
        }

    }

});

// MENSAJE FINAL
const mensajeFinal = document.createElement('div');
mensajeFinal.style.display = 'none';
pantallaFinal.appendChild(mensajeFinal);

// DETALLE FINAL: CONTADOR DINÁMICO
const detalleFinal = document.createElement('div');
detalleFinal.id = 'detalleFinal';
detalleFinal.style.fontSize = '30px';
detalleFinal.style.fontWeight = 'bold';
detalleFinal.style.color = 'white';
detalleFinal.style.textAlign = 'center';
detalleFinal.style.textShadow = '2px 2px 5px black';
detalleFinal.style.marginTop = '0px';
detalleFinal.style.marginBottom = '20px';
detalleFinal.style.padding = '10px';
pantallaFinal.appendChild(detalleFinal);

// BOTÓN REINICIAR
const botonReiniciar = document.createElement('button');
botonReiniciar.id = 'botonReiniciar';
botonReiniciar.textContent = 'Jugar otra vez';
botonReiniciar.style.fontSize = '25px';
botonReiniciar.style.padding = '15px 30px';
botonReiniciar.style.cursor = 'pointer';
botonReiniciar.style.borderRadius = '10px';
botonReiniciar.style.border = 'none';
botonReiniciar.style.marginTop = '30px';

pantallaFinal.appendChild(botonReiniciar);

// BOTÓN PARA REPETIR EL NIVEL 3
const botonReintentarNivel3 = document.createElement('button');
botonReintentarNivel3.id = 'botonReintentarNivel3';
botonReintentarNivel3.textContent = 'Intentar otra vez';
botonReintentarNivel3.style.fontSize = '25px';
botonReintentarNivel3.style.padding = '15px 30px';
botonReintentarNivel3.style.cursor = 'pointer';
botonReintentarNivel3.style.borderRadius = '10px';
botonReintentarNivel3.style.border = 'none';
botonReintentarNivel3.style.marginTop = '15px';

botonReintentarNivel3.addEventListener('click', () => {
    intentarOtraVez();
});



// BOTÓN CONTINUAR
const botonContinuar = document.createElement('button');
botonContinuar.id = 'botonContinuar';
botonContinuar.textContent = 'Continuar al nivel 2';
botonContinuar.style.fontSize = '25px';
botonContinuar.style.padding = '15px 30px';
botonContinuar.style.cursor = 'pointer';
botonContinuar.style.borderRadius = '10px';
botonContinuar.style.border = 'none';
botonContinuar.style.marginTop = '20px';

pantallaFinal.appendChild(botonContinuar);


// INICIAR EL JUEGO DESDE EL PRINCIPIO
botonReiniciar.addEventListener('click', () => {
    location.reload();
});



// PASAR AL SIGUIENTE NIVEL
botonContinuar.addEventListener('click', () => {

    if (nivelActual === 1) {
        iniciarNivel2();
    }
    else if (nivelActual === 2) {
        iniciarNivel3();
    }

});


// INICIAR NIVEL 2

function iniciarNivel2() {
    nivelActual = 2;

    // ELIMINAR OBJETOS ESPECIALES DEL NIVEL ANTERIOR
    for (const objeto of objetosEspeciales) {
        scene.remove(objeto);
    }

    objetosEspeciales.length = 0;

    especialesGenerados = 0;
    ultimoSpawnEspecial = Date.now();


    // VOZ DE INICIO DEL NIVEL 2
    sonidoNivel2.currentTime = 0;
    sonidoNivel2.play();

    estrellasParaGanar = metasPorNivel[nivelActual];

    // REANUDAR MÚSICA DEL JUEGO
    musicaJuego.currentTime = 0;

    sonidoGanarNivel.pause();
    sonidoGanarJuego.pause();

    musicaJuego.play().catch(error => {
        console.log("No se pudo reproducir la música:", error);
    });

    // CAMBIAR FRECUENCIA DE ESTRELLAS
    intervaloEstrella = 900;
    intervaloObstaculo = 1000;

    totalCollectedSpheres = 0;

    timer = 60;
    tiempoAnterior = Date.now();

    juegoTerminado = false;

    // CAMBIAR LETRERO
    nivelLabel.textContent = 'NIVEL 2';

    // OCULTAR PANTALLA FINAL
    pantallaFinal.style.display = 'none';

    // OCULTAR BOTÓN DE CONTINUAR
    botonContinuar.style.display = 'none';

    // REINICIAR HUD
    timerLabel.textContent = `${timer}`;

    totalCoinsLabel.textContent =
        `   ${totalCollectedSpheres} / ${estrellasParaGanar}`;

    // LIMPIAR ESTRELLAS ANTERIORES
    for (const estrella of spheresInScene) {
        scene.remove(estrella);
    }

    spheresInScene.length = 0;

    // REINICIAR POSICIÓN DE LA NAVE
    if (cube) {
        cube.position.set(0, 0, 0);
    }

    // CREAR OBSTÁCULOS INICIALES DEL NIVEL 2
    crearObstaculosIniciales(true);

    // REINICIAR TIEMPOS DE APARICIÓN
    ultimoSpawnEstrella = Date.now();
    ultimoSpawnObstaculo = Date.now();
    ultimoSpawnCorazon = Date.now();
    ultimoSpawnVelocidad = Date.now();

    console.log(" NIVEL 2 INICIADO");
}


// INICIAR NIVEL 3

function iniciarNivel3() {

    nivelActual = 3;

    // ELIMINAR OBJETOS ESPECIALES DEL NIVEL ANTERIOR
    for (const objeto of objetosEspeciales) {
        scene.remove(objeto);
    }

    objetosEspeciales.length = 0;
    especialesGenerados = 0;
    ultimoSpawnEspecial = Date.now();



    // VOZ DE INICIO DEL NIVEL 3
    sonidoNivel3.currentTime = 0;
    sonidoNivel3.play();

    estrellasParaGanar = metasPorNivel[nivelActual];

    // REANUDAR MÚSICA DEL JUEGO
    musicaJuego.currentTime = 0;

    sonidoGanarNivel.pause();
    sonidoGanarJuego.pause();

    musicaJuego.play().catch(error => {
        console.log("No se pudo reproducir la música:", error);
    });

    // AUMENTAR DIFICULTAD
    intervaloEstrella = 1100;
    intervaloObstaculo = 750;

    totalCollectedSpheres = 0;

    timer = 60;
    tiempoAnterior = Date.now();

    juegoTerminado = false;

    // CAMBIAR LETRERO
    nivelLabel.textContent = 'NIVEL 3';

    // OCULTAR PANTALLA FINAL
    pantallaFinal.style.display = 'none';

    botonContinuar.style.display = 'none';

    // ACTUALIZAR CONTADOR
    timerLabel.textContent = `${timer}`;

    totalCoinsLabel.textContent =
        `0 / ${estrellasParaGanar}`;

    // LIMPIAR ESTRELLAS ANTERIORES
    for (const estrella of spheresInScene) {
        scene.remove(estrella);
    }

    spheresInScene.length = 0;

    // REINICIAR POSICIÓN DE LA NAVE
    if (cube) {
        cube.position.set(0, 0, 0);
    }

    // CREAR OBSTÁCULOS INICIALES DEL NIVEL 3
    crearObstaculosIniciales(true);



    // REINICIAR TIEMPOS DE APARICIÓN
    ultimoSpawnEstrella = Date.now();
    ultimoSpawnObstaculo = Date.now();
    ultimoSpawnCorazon = Date.now();
    ultimoSpawnVelocidad = Date.now();



}

// INTENTAR OTRA VEZ EL NIVEL ACTUAL
function intentarOtraVez() {

    console.log("REINICIANDO NIVEL:", nivelActual);

    // DETENER VIDEOS FINALES
    for (const video of Object.values(videosFinales)) {
        video.pause();
        video.currentTime = 0;
    }

    juegoTerminado = false;
    fueDerrota = false;

    // RESTABLECER VIDAS
    totalCollectedvidas = 1;

    totalVidasLabel.innerHTML = `
        <img src="${corazonImagen}" width="40">
    `;

    // RESTABLECER VELOCIDAD
    velocidadActual = velocidadNormal;

    sonidoNitro.pause();
    sonidoNitro.currentTime = 0;

    sonidoPerder.pause();
    sonidoPerder.currentTime = 0;

    sonidoGanarNivel.pause();
    sonidoGanarJuego.pause();

    // CERRAR PANTALLA FINAL
    pantallaFinal.style.display = 'none';

    // REINICIAR EL NIVEL 2 O 3
    if (nivelActual === 2) {
        iniciarNivel2();
    }
    else if (nivelActual === 3) {
        iniciarNivel3();
    }

    console.log("NIVEL REINICIADO CORRECTAMENTE");
}


// GANAR
function ganar() {

    if (juegoTerminado) return;

    juegoTerminado = true;
    fueDerrota = false;

    // DETENER MÚSICA DEL JUEGO
    musicaJuego.pause();

    // NIVEL 1 Y 2: SONIDO DE VICTORIA DE NIVEL
    if (nivelActual === 1 || nivelActual === 2) {

        sonidoGanarNivel.currentTime = 0;
        sonidoGanarNivel.play();

    }

    // NIVEL 3: SONIDO DE VICTORIA FINAL
    else if (nivelActual === 3) {

        sonidoGanarJuego.currentTime = 0;
        sonidoGanarJuego.play();

    }

    mostrarPantallaFinal('ganar');

    detalleFinal.textContent =
        `Nivel ${nivelActual} completado. Recolectaste ${totalCollectedSpheres} de ${estrellasParaGanar} estrellas.`;
}



// PERDER POR CHOQUE
function perderPorChoque() {
    if (juegoTerminado) return;

    juegoTerminado = true;
    fueDerrota = true;

    sonidoPerder.currentTime = 0;
    sonidoPerder.play();

    mostrarPantallaFinal('perderVidas');

    detalleFinal.textContent =
        `Recolectaste ${totalCollectedSpheres} de ${estrellasParaGanar} estrellas.`;
}



// PERDER POR TIEMPO
function perderPorTiempo() {
    if (juegoTerminado) return;

    juegoTerminado = true;
    fueDerrota = true;

    sonidoPerder.currentTime = 0;
    sonidoPerder.play();

    mostrarPantallaFinal('perderTiempo');

    detalleFinal.textContent =
        `Recolectaste ${totalCollectedSpheres} de ${estrellasParaGanar} estrellas.`;
}




//VIDEOS FONDOS DE GANAR Y PERDER





function mostrarPantallaFinal(nombreVideo) {

    // COMPROBAR SI EL DISPOSITIVO ESTÁ EN VERTICAL
    const esPantallaVertical =
        esDispositivoTactil &&
        window.matchMedia('(orientation: portrait)').matches;

    // SELECCIONAR VIDEO SEGÚN LA ORIENTACIÓN
    let claveVideo = nombreVideo;

    if (esPantallaVertical) {

        if (nombreVideo === 'ganar') {
            claveVideo = 'ganarVertical';
        }

        if (nombreVideo === 'perderTiempo') {
            claveVideo = 'perderTiempoVertical';
        }

        if (nombreVideo === 'perderVidas') {
            claveVideo = 'perderVidasVertical';
        }

    }

    // OBTENER EL VIDEO CORRECTO
    const videoFinal = videosFinales[claveVideo];

    if (!videoFinal) {
        console.error('No se encontró el video:', claveVideo);
        return;
    }

    pantallaFinal.replaceChildren();

    // CONFIGURAR PANTALLA FINAL
    pantallaFinal.style.display = 'flex';
    pantallaFinal.style.position = 'fixed';
    pantallaFinal.style.top = '0';
    pantallaFinal.style.left = '0';
    pantallaFinal.style.width = '100vw';
    pantallaFinal.style.height = '100dvh';
    pantallaFinal.style.zIndex = '10000';
    pantallaFinal.style.backgroundColor = 'black';
    pantallaFinal.style.justifyContent = 'center';
    pantallaFinal.style.alignItems = 'center';
    pantallaFinal.style.flexDirection = 'column';
    pantallaFinal.style.overflow = 'hidden';

    // CONFIGURAR VIDEO DE FONDO
    videoFinal.pause();
    videoFinal.currentTime = 0;

    videoFinal.style.position = 'absolute';
    videoFinal.style.top = '0';
    videoFinal.style.left = '0';
    videoFinal.style.width = '100%';
    videoFinal.style.height = '100%';
    videoFinal.style.opacity = '1';
    videoFinal.style.objectFit = esPantallaVertical ? 'contain' : 'cover';
    videoFinal.style.zIndex = '0';

    pantallaFinal.appendChild(videoFinal);


    // TEXTO CON LOS RESULTADOS
    detalleFinal.style.position = 'absolute';
    detalleFinal.style.bottom = '20px';
    detalleFinal.style.left = '50%';
    detalleFinal.style.transform = 'translateX(-50%)';
    detalleFinal.style.width = '90%';
    detalleFinal.style.padding = '10px';
    detalleFinal.style.margin = '0';
    detalleFinal.style.textAlign = 'center';
    detalleFinal.style.fontSize = 'clamp(14px, 2vw, 22px)';
    detalleFinal.style.color = 'white';
    detalleFinal.style.background = 'rgba(0, 0, 0, 0.55)';
    detalleFinal.style.borderRadius = '12px';
    detalleFinal.style.zIndex = '3';

    pantallaFinal.appendChild(detalleFinal);


    // BOTÓN PRINCIPAL
    botonReiniciar.style.position = 'relative';
    botonReiniciar.style.zIndex = '1';
    botonReiniciar.style.marginTop = '30px';

    if (fueDerrota && nivelActual === 3) {

        botonReiniciar.textContent = 'Iniciar juego desde el comienzo';

    } else if (fueDerrota && nivelActual === 2) {

        botonReiniciar.textContent = 'Intentar otra vez';

        botonReiniciar.onclick = () => {
            intentarOtraVez();
        };

    } else {

        botonReiniciar.textContent = 'Jugar otra vez';
        botonReiniciar.onclick = null;

    }

    pantallaFinal.appendChild(botonReiniciar);

    // BOTÓN PARA REPETIR NIVEL 3
    if (
        (nombreVideo === 'perderVidas' || nombreVideo === 'perderTiempo') &&
        nivelActual === 3
    ) {
        botonReintentarNivel3.style.display = 'block';
        botonReintentarNivel3.style.position = 'relative';
        botonReintentarNivel3.style.zIndex = '2';
        pantallaFinal.appendChild(botonReintentarNivel3);
    }



    // BOTÓN PARA CONTINUAR
    if (nombreVideo === 'ganar' && nivelActual < 3) {

        botonContinuar.style.display = 'block';
        botonContinuar.style.position = 'relative';
        botonContinuar.style.zIndex = '1';
        botonContinuar.style.marginTop = '20px';

        botonContinuar.textContent =
            nivelActual === 1
                ? 'Continuar al nivel 2'
                : 'Continuar al nivel 3';

        pantallaFinal.appendChild(botonContinuar);

    } else {

        botonContinuar.style.display = 'none';

    }

    // REPRODUCIR VIDEO
    videoFinal.play().catch(error => {
        console.error('Error al reproducir el video final:', error);
    });

}




// GENERAR NUEVOS ELEMENTOS

function generarNuevosElementos() {

    // NO GENERAR SI EL JUEGO TERMINÓ
    if (juegoTerminado || timer <= 0) { return; }
    // EVITAR ERROR SI LA NAVE TODAVÍA NO CARGÓ
    if (!cube) return;

    const ahora = Date.now();


    //  ESTRELLAS

    if (ahora - ultimoSpawnEstrella >= intervaloEstrella) {

        // Comprobar que el modelo ya haya cargado
        if (modeloEstrella) {
            const distancia = THREE.MathUtils.randFloat(
                distanciaMinimaSpawn,
                distanciaMaximaSpawn
            );

            // Crear una copia del modelo 3D
            const estrella = modeloEstrella.clone(true);

            const x = THREE.MathUtils.randFloat(-8, 8);
            const y = THREE.MathUtils.randFloat(-1, 5);
            const z = cube.position.z - distancia;

            estrella.position.set(x, y, z);

            // Tamaño de la estrella
            estrella.scale.set(0.15, 0.15, 0.15);
            scene.add(estrella);
            spheresInScene.push(estrella);
        }
        ultimoSpawnEstrella = ahora;
    }



    // SELECCIÓN DEL OBJETO ESPECIAL Y SU ESCALA

    let modeloActual = null;
    let centroActual = new THREE.Vector3();
    let escalaActual = 0.04;

    if (nivelActual === 1) {
        modeloActual = modeloEspecial;
        centroActual = centroEspecial;
        escalaActual = 0.03;
    }
    else if (nivelActual === 2) {
        modeloActual = modeloEspecial2;
        centroActual = centroEspecial2;
        escalaActual = 0.32;
    }
    else if (nivelActual === 3) {
        modeloActual = modeloEspecial3;
        centroActual = centroEspecial3;
        escalaActual = 1.2;
    }


    // GENERAR OBJETO ESPECIAL

    if (
        modeloActual &&
        especialesGenerados < 2 &&
        ahora - ultimoSpawnEspecial >= 20000
    ) {

        const distancia = THREE.MathUtils.randFloat(
            distanciaMinimaSpawn,
            distanciaMaximaSpawn
        );

        // CREAR OBJETO CON SU ILUMINACIÓN
        const objetoEspecial = crearObjetoEspecial(
            modeloActual,
            centroActual,
            escalaActual
        );

        // POSICIÓN ALEATORIA
        const x = THREE.MathUtils.randFloat(-8, 8);
        const y = THREE.MathUtils.randFloat(0, 4);
        const z = cube.position.z - distancia;

        objetoEspecial.position.set(x, y, z);

        // AGREGAR A LA ESCENA
        scene.add(objetoEspecial);

        objetosEspeciales.push(objetoEspecial);

        especialesGenerados++;

        ultimoSpawnEspecial = ahora;

        console.log(
            "OBJETO ESPECIAL DEL NIVEL",
            nivelActual,
            "GENERADO:",
            especialesGenerados
        );

    }



    //  OBSTÁCULOS

    if (ahora - ultimoSpawnObstaculo >= intervaloObstaculo) {
        const distancia = THREE.MathUtils.randFloat(distanciaMinimaSpawn, distanciaMaximaSpawn);


        //


        let obstaculo;

        const tipoObstaculo = Math.random();

        if (tipoObstaculo < 0.33 && modeloEnemigo) {

            // ENEMIGO 1: ROCA
            obstaculo = modeloEnemigo.clone(true);
            obstaculo.scale.set(0.8, 0.8, 0.8);

        }
        else if (tipoObstaculo < 0.66 && modeloEnemigo2) {

            // ENEMIGO 2: ENENAVE
            obstaculo = modeloEnemigo2.clone(true);
            obstaculo.scale.set(0.14, 0.14, 0.14);

        }
        else if (modeloEnemigo3) {

            // ENEMIGO 3
            obstaculo = modeloEnemigo3.clone(true);
            obstaculo.scale.set(0.42, 0.42, 0.42);

        }
        else {

            // RESPALDO
            obstaculo = modeloEnemigo?.clone(true) ||
                modeloEnemigo2?.clone(true) ||
                modeloEnemigo3?.clone(true);

        }




        const x = THREE.MathUtils.randFloat(-8, 8);
        const y = THREE.MathUtils.randFloat(-1, 5);
        const z = cube.position.z - distancia;
        obstaculo.position.set(x, y, z);
        scene.add(obstaculo);
        vidaInScene.push(obstaculo);

        // ALGUNOS OBSTÁCULOS SE MUEVEN
        // DIFICULTAD DE OBSTÁCULOS SEGÚN EL NIVEL

        let probabilidadMovil = 0.3;
        let velocidadMinima = 0.02;
        let velocidadMaxima = 0.06;

        if (nivelActual === 2) {
            probabilidadMovil = 0.4;
            velocidadMinima = 0.03;
            velocidadMaxima = 0.07;
        }

        if (nivelActual === 3) {
            probabilidadMovil = 0.4;
            velocidadMinima = 0.03;
            velocidadMaxima = 0.07;
        }

        if (Math.random() < probabilidadMovil) {

            obstaculosMoviles.push({

                objeto: obstaculo,

                velocidad: THREE.MathUtils.randFloat(
                    velocidadMinima,
                    velocidadMaxima
                ),

                direccion: Math.random() < 0.5 ? 1 : -1,

                limiteIzquierdo: -8,
                limiteDerecho: 8

            });

        }
        ultimoSpawnObstaculo =
            ahora;
    }


    //  CORAZONES


    if (ahora - ultimoSpawnCorazon >= intervaloCorazon) {
        if (totalCollectedvidas < 3) {
            const distancia = THREE.MathUtils.randFloat(distanciaMinimaSpawn, distanciaMaximaSpawn);

            if (modeloCorazon) {

                const pivoteCorazon = new THREE.Group();
                const corazon = modeloCorazon.clone(true);

                const caja = new THREE.Box3().setFromObject(modeloCorazon);
                const centro = caja.getCenter(new THREE.Vector3());

                corazon.position.set(
                    -centro.x,
                    -centro.y,
                    -centro.z
                );

                pivoteCorazon.add(corazon);

                const x = THREE.MathUtils.randFloat(-8, 8);
                const y = THREE.MathUtils.randFloat(-1, 5);
                const z = cube.position.z - distancia;

                pivoteCorazon.position.set(x, y, z);
                pivoteCorazon.scale.set(0.35, 0.35, 0.35);

                scene.add(pivoteCorazon);
                corazonesInScene.push(pivoteCorazon);
            }
        }
        ultimoSpawnCorazon = ahora;
    }



    // VELOCIDAD

    if (ahora - ultimoSpawnVelocidad >= intervaloVelocidad) {
        if (modeloVelocidad) {

            const distancia = THREE.MathUtils.randFloat(distanciaMinimaSpawn, distanciaMaximaSpawn);
            const velocidad = modeloVelocidad.clone(true);
            agregarLuzPocion(velocidad);
            velocidad.scale.set(0.30, 0.30, 0.30
            );

            const x = THREE.MathUtils.randFloat(-8, 8);
            const y = THREE.MathUtils.randFloat(-1, 5);
            const z = cube.position.z - distancia; velocidad.position.set(x, y, z);
            scene.add(velocidad);
            velocidadesInScene.push(velocidad);
        }
        ultimoSpawnVelocidad = ahora;
    }

}


// RECOLECTAR OBJETOS
function collect() {

    // EVITAR ERROR SI LA NAVE TODAVÍA NO CARGÓ
    if (!cube) return;
    if (juegoTerminado) return;

    // VELOCIDAD

    for (
        let i = 0;
        i < velocidadesInScene.length;
        i++
    ) {

        const currentSpeed =
            velocidadesInScene[i];

        if (
            currentSpeed.visible
        ) {

            const distance =
                cube.position.distanceTo(
                    currentSpeed.position
                );


            if (distance < 2) {

                currentSpeed.visible = false;

                // REPRODUCIR SONIDO DE LA POCIÓN
                sonidoPocion.currentTime = 0;
                sonidoPocion.play().catch(error => {
                    console.log('No se pudo reproducir el sonido de la poción:', error);
                });

                velocidadActual = velocidadRapida;

                tiempoVelocidad = Date.now();

                console.log(" VELOCIDAD ACTIVADA");

                // ACTIVAR SONIDO DE NITRO
                sonidoNitro.currentTime = 0;
                sonidoNitro.play().catch(error => {
                    console.log('No se pudo reproducir el sonido de nitro:', error);
                });


            }
        }
    }

    // RECOGER OBJETO ESPECIAL

    for (let i = 0; i < objetosEspeciales.length; i++) {

        const objeto = objetosEspeciales[i];

        if (objeto.visible) {

            const distancia = cube.position.distanceTo(
                objeto.position
            );

            if (distancia < 3.5) {

                objeto.visible = false;

                // SUMAR 5 ESTRELLAS
                totalCollectedSpheres += 5;

                // ACTUALIZAR CONTADOR
                totalCoinsLabel.textContent =
                    ` ${totalCollectedSpheres} / ${estrellasParaGanar}`;

                /// REPRODUCIR SONIDO DE RECOMPENSA AL RECOGER EL OBJETO
                sonidoRecompensa.currentTime = 0;

                sonidoRecompensa.play().catch(error => {
                    console.log("Error al reproducir recompensa:", error);
                });

                console.log("¡OBJETO ESPECIAL RECOGIDO! +5 ESTRELLAS");

                // COMPROBAR SI COMPLETÓ EL NIVEL
                if (totalCollectedSpheres >= estrellasParaGanar) {

                    ganar();
                    return;

                }
            }
        }
    }



    //  ESTRELLAS


    for (let i = 0; i < spheresInScene.length; i++) {
        const currentSphere = spheresInScene[i];

        if (currentSphere.visible) {
            const distance = cube.position.distanceTo(currentSphere.position);

            if (distance < 2) {
                currentSphere.visible = false;
                totalCollectedSpheres++;

                // REPRODUCIR SONIDO DE ESTRELLA
                sonidoEstrella.currentTime = 0;
                sonidoEstrella.play().catch(error => {
                    console.log('No se pudo reproducir el sonido:', error);
                });

                console.log("TOTAL DE ESFERAS:", totalCollectedSpheres);
                // GANAR

                if (totalCollectedSpheres >= estrellasParaGanar) {
                    ganar();
                    return;
                }
            }
        }
    }


    //  OBSTÁCULOS

    for (let i = 0; i < vidaInScene.length; i++) {
        const currentObstacle = vidaInScene[i];

        if (currentObstacle.visible) {
            const distance = cube.position.distanceTo(currentObstacle.position);


            if (distance < 2) {
                currentObstacle.visible = false;

                // REPRODUCIR SONIDO DE IMPACTO
                sonidoPiedra.currentTime = 0;
                sonidoPiedra.play().catch(error => {
                    console.log('No se pudo reproducir el sonido de impacto:', error);
                });

                totalCollectedvidas--;

                // HACER TEMBLAR EL CONTADOR
                temblarContadorVidas();

                console.log("VIDAS:", totalCollectedvidas);




                // SIN VIDAS
                if (
                    totalCollectedvidas <= 0
                ) {
                    perderPorChoque();
                    return;
                }
            }
        }
    }

    //  CORAZONES

    for (let i = 0; i < corazonesInScene.length; i++) {
        const currentHeart = corazonesInScene[i];

        if (currentHeart.visible) {
            const distance = cube.position.distanceTo(currentHeart.position);

            if (distance < 2) {
                // ANIMAR CORAZÓN HACIA EL CONTADOR
                animarCorazonRecolectado(currentHeart);

                currentHeart.visible = false;

                // REPRODUCIR SONIDO DEL CORAZÓN
                sonidoCorazon.currentTime = 0;
                sonidoCorazon.play().catch(error => {
                    console.log('No se pudo reproducir el sonido del corazón:', error);
                });

                totalCollectedvidas++;

                // MÁXIMO 3 VIDAS
                if (totalCollectedvidas > 3) {
                    totalCollectedvidas = 3;
                }

                console.log("VIDAS:", totalCollectedvidas);
            }
        }
    }




    // ANIMACIÓN DE TEMBLOR DEL CONTADOR
    function temblarContadorVidas() {

        totalVidasLabel.style.animation = 'none';

        // REINICIAR ANIMACIÓN
        void totalVidasLabel.offsetWidth;

        totalVidasLabel.style.animation = 'temblorVidas 0.4s ease';

        setTimeout(() => {
            totalVidasLabel.style.animation = '';
        }, 450);
    }

    const estiloTemblor = document.createElement('style');

    estiloTemblor.textContent = `
    @keyframes temblorVidas {

        0% {
            transform: translateX(0);
        }

        20% {
            transform: translateX(-9px);
        }

        40% {
            transform: translateX(9px);
        }

        60% {
            transform: translateX(-6px);
        }

        80% {
            transform: translateX(6px);
        }

        

        100% {
            transform: translateX(0);
        }

    }
`;

    document.head.appendChild(estiloTemblor);



    // ACTUALIZAR ESTRELLAS
    totalCoinsLabel.textContent = `   ${totalCollectedSpheres} / ${estrellasParaGanar}`;

    // ACTUALIZAR CORAZONES

    if (totalCollectedvidas === 3) {
        totalVidasLabel.innerHTML = ` <img src="${corazonImagen}" width="40">
            <img src="${corazonImagen}" width="40">
            <img src="${corazonImagen}"width="40" >
        `;

    }
    else if (totalCollectedvidas === 2) {
        totalVidasLabel.innerHTML = `
            <img src="${corazonImagen}" width="40" >
            <img src="${corazonImagen}" width="40">

        `;

    }

    else if (totalCollectedvidas === 1) {
        totalVidasLabel.innerHTML = `
            <img src="${corazonImagen}" width="40">
        `;

    }
    else { totalVidasLabel.innerHTML = ''; }
}

// ACTUALIZAR VELOCIDAD

function actualizarVelocidad() {

    if (
        velocidadActual ===
        velocidadNormal
    ) {
        return;
    }

    const ahora =
        Date.now();




    if (ahora - tiempoVelocidad >= 5000) {
        velocidadActual = velocidadNormal;

        // DETENER SONIDO DE NITRO
        sonidoNitro.pause();
        sonidoNitro.currentTime = 0;

        console.log("⚡ VELOCIDAD NORMAL");
    }
}





// ACTUALIZAR TIMER

function actualizarTimer() {

    if (juegoTerminado) { return; }
    const ahora = Date.now();
    if (ahora - tiempoAnterior >= 1000) {
        timer--; tiempoAnterior = ahora;

        if (timer <= 0) {
            timer = 0; timerLabel.textContent = 'Tiempo: 0';
            if (totalCollectedSpheres < estrellasParaGanar) { perderPorTiempo(); }
        }

        else { timerLabel.textContent = ` ${timer}`; }
    }
}


// CÁMARA
const cameraseguimiento = new THREE.Vector3(0, 3, 6);
function perseguirCamera() {
    if (!cube) return;
    camera.position.copy(cube.position);
    camera.position.add(cameraseguimiento);
    camera.lookAt(cube.position.x, cube.position.y + 0.5, cube.position.z - 10
    );
}


// MOVER OBSTÁCULOS
function moverObstaculos() {
    for (const obstaculo of obstaculosMoviles) {
        obstaculo.objeto.position.x +=
            obstaculo.velocidad * obstaculo.direccion;
        // LÍMITE DERECHO
        if (obstaculo.objeto.position.x >= obstaculo.limiteDerecho) { obstaculo.direccion = -1; }
        // LÍMITE IZQUIERDO
        if (obstaculo.objeto.position.x <= obstaculo.limiteIzquierdo) { obstaculo.direccion = 1; }
    }
}


// MENÚ PRINCIPAL
const menuPrincipal =
    document.createElement(
        "div"
    );
menuPrincipal.id =
    "menuPrincipal";
menuPrincipal.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-image:
        url('./imagenes/fondo.menu.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    font-family: 'texto';
    text-align: center;
    overflow: hidden;

`;


// CARGAR TIPOGRAFÍA DE TÍTULOS
const fuentetitulos =
    new FontFace(
        "titulos",
        "url('./tipografia/titulos.otf')"
    );
fuentetitulos.load()

    .then(
        (font) => {

            document.fonts.add(
                font
            );

            console.log(
                "Tipografía de títulos cargada correctamente"
            );

        }
    )

    .catch(
        (error) => {

            console.error(
                "Error al cargar la tipografía de títulos:",
                error
            );
        }
    );




// CARGAR TIPOGRAFÍA DE TEXTO

const fuentetexto =
    new FontFace(
        "texto",
        "url('./tipografia/texto.ttf')"
    );
fuentetexto.load().then((font) => {
    document.fonts.add(font);
    console.log("Tipografía de texto cargada correctamente");
}
)

    .catch((error) => { console.error("Error al cargar la tipografía de texto:", error); }
    );

// CONTENIDO DEL MENÚ
menuPrincipal.innerHTML = `

    <img

        src="./imagenes/LOGO_GALAXY.RUSH.png"
        alt="Logo Galaxy Rush"

        style="
            width: 50%;
            max-width: 350px;
            height: auto;
            object-fit: contain;
            margin-bottom: 30px;
        "
    >


    <div
        id="opcionesMenu"
        style="

            display: flex;

            flex-wrap: wrap;

            justify-content: center;

            gap: 15px;

        "

    >
        <button

            id="btnPlay"

            class="botonMenu"

            style="

                background:
                linear-gradient(
                    #ffe84b,
                    #ffb800
                );

            "

        >
            PLAY

        </button>


        <button

            id="btnCreditos"
            class="botonMenu"
            style="
                background:
                linear-gradient(
                    #9cff3c,
                    #45d500
                );

            "

        >
            CRÉDITOS

        </button>

        <button
            id="btnTutorial"
            class="botonMenu"
            style=" background:linear-gradient( #ff4848,   #dc0000 );"

        >
            TUTORIAL

        </button>

    </div>

<div
    id="contenidoMenu"
    style="
        display: none;
        max-width: 900px;
        width: 90%;
        max-height: 80vh;
        margin-top: 20px;
        padding: 20px;
        background: rgba(175, 114, 255, 0.76);
        border-radius: 15px;
        box-sizing: border-box;
        overflow-y: auto;
        overflow-x: hidden;
    "
></div>



    <style>

        .botonMenu {
            width: 140px;
            height: 48px;
            border:  2px solid  rgba( 255, 255, 255,  0.3);
            border-radius: 20px;
            font-family: texto;
            font-size: 20px;
            font-weight: 900;
            cursor: pointer;
            color: #000000;
            transition: 0.2s;

        }
        .botonMenu:hover {
            transform:scale(1.08);
            filter:brightness(1.2);

        }
        .botonVolver {padding:12px 25px;
            margin-top: 15px;
            border:none;
            font-family:texto;
            font-size:20px;
            border-radius:10px;
            background: #7801ffbb;
            color:#000000;
            font-weight:bold;
            cursor:pointer;
        }

    </style>

`;

document.body.appendChild(
    menuPrincipal
);


// INTENTAR INICIAR LA MÚSICA DEL LOBBY
iniciarMusicaLobby();

// ACTIVAR MÚSICA CON LA PRIMERA INTERACCIÓN
menuPrincipal.addEventListener("pointerdown", () => {

    iniciarMusicaLobby();

});




// BOTÓN JUGAR
document
    .getElementById("btnPlay")
    .addEventListener("click", () => {

        if (juegoTerminado) {

            location.reload();

            return;

        }


        juegoIniciado = true;
        // DETENER MÚSICA DEL LOBBY
        detenerMusicaLobby();

        // INICIAR MÚSICA DEL JUEGO
        musicaJuego.currentTime = 0;
        musicaJuego.play().catch(error => {
            console.log("No se pudo reproducir la música:", error);
        });

        menuPrincipal.remove();

    }

    );


// BOTÓN CRÉDITOS
document
    .getElementById(
        "btnCreditos"
    )
    .addEventListener("click", () => {
        const contenido =
            document.getElementById("contenidoMenu");
        contenido.style.display = "block"; contenido.innerHTML = `
                <h2
                    style="color:#ffe000;"
                >
                    CRÉDITOS
                </h2>
                <p
                    style="margin:15px 0;"
                >
                    <strong>
                        GALAXY RUSH
                    </strong>

                </p>
                <p>
                    Galeana Carrillo
                    Alexa Guadalupe
                </p>
                <p>
                    Documentador/Modelador 3d
                </p>
                <p>
                    <br>
                    Meléndez Medina
                    Ximena
                </p>
                <p>
                    Documentador/Modelador 3d
                </p>
                <p>
                    <br>
                    Súarez López
                    Ramón Alexis
                </p>
                <p>
                    Programador principal
                </p>
                <p>
                    <br>
                    Grupo 2842
                </p>

                <button
                    class="botonVolver"
                    id="volverMenu"
                >
                    VOLVER
                </button>

            `;

        document
            .getElementById(
                "volverMenu"
            )
            .addEventListener("click",
                () => {
                    contenido.style.display = "none";
                }
            )
    }
    );





// BOTÓN TUTORIAL

document
    .getElementById("btnTutorial")
    .addEventListener("click", () => {
        // DETENER MÚSICA DEL LOBBY
        detenerMusicaLobby();

        const pantallaTutorial = document.createElement("div");

        pantallaTutorial.id = "pantallaTutorial";

        // PANTALLA COMPLETA
        pantallaTutorial.style.position = "fixed";
        pantallaTutorial.style.top = "0";
        pantallaTutorial.style.left = "0";
        pantallaTutorial.style.width = "100vw";
        pantallaTutorial.style.height = "100vh";
        pantallaTutorial.style.height = "100dvh";
        pantallaTutorial.style.margin = "0";
        pantallaTutorial.style.padding = "0";
        pantallaTutorial.style.border = "none";
        pantallaTutorial.style.overflow = "hidden";
        pantallaTutorial.style.background = "black";
        pantallaTutorial.style.zIndex = "999999";

        // VIDEO
        const video = document.createElement("video");

        video.src = "./videos/tutorial.mp4";
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;

        video.style.position = "absolute";
        video.style.top = "0";
        video.style.left = "0";
        video.style.width = "100%";
        video.style.height = "100%";
        video.style.objectFit = "fill";
        video.style.margin = "0";
        video.style.padding = "0";

        // BOTÓN REGRESAR
        const botonRegresar = document.createElement("button");

        botonRegresar.className = "botonVolver";
        botonRegresar.textContent = "REGRESAR";

        botonRegresar.style.position = "absolute";
        botonRegresar.style.bottom = "25px";
        botonRegresar.style.left = "50%";
        botonRegresar.style.transform = "translateX(-50%)";
        botonRegresar.style.zIndex = "2";
        botonRegresar.style.margin = "0";



        botonRegresar.addEventListener("click", () => {

            video.pause();

            pantallaTutorial.remove();

            // REGRESAR MÚSICA DEL LOBBY
            iniciarMusicaLobby();

        });

        pantallaTutorial.appendChild(video);
        pantallaTutorial.appendChild(botonRegresar);

        document.body.appendChild(pantallaTutorial);

    });







let frames = 0;
let inicioMedicion = performance.now();





// =============================================
// RESPONSIVIDAD EXCLUSIVA PARA TABLETS Y CELULARES
// =============================================

const estilosResponsivos = document.createElement('style');

estilosResponsivos.textContent = `

@media (pointer: coarse) and (max-width: 1024px) {

    /* OCUPAR TODA LA PANTALLA */
    html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        height: 100% !important;
        overflow: hidden !important;
    }

    /* FONDO DEL JUEGO */
    #menuPrincipal {
        width: 100vw !important;
        height: 100dvh !important;
        padding: 18px !important;
        box-sizing: border-box !important;
        justify-content: center !important;
        overflow-y: auto !important;
    }

    #menuPrincipal img {
        width: clamp(180px, 45vw, 350px) !important;
        max-width: 85% !important;
        margin-bottom: 20px !important;
    }

    #opcionesMenu {
        width: 100% !important;
        gap: 12px !important;
        justify-content: center !important;
    }

    .botonMenu {
        width: clamp(110px, 22vw, 150px) !important;
        height: clamp(42px, 7vh, 55px) !important;
        font-size: clamp(15px, 2.5vw, 20px) !important;
    }

    #contenidoMenu {
        width: 95% !important;
        max-height: 65dvh !important;
        font-size: clamp(13px, 2vw, 17px) !important;
    }



  

    /* INDICADOR DE NIVEL */
    #hudNivel {
        top: 12px !important;
        font-size: clamp(20px, 4vw, 32px) !important;
        white-space: nowrap !important;
    }


    /* CONTADOR DE ESTRELLAS */
    #hudEstrellas {
        top: 5px !important;
        left: 5px !important;
        width: clamp(105px, 20vw, 155px) !important;
        height: clamp(75px, 14vw, 105px) !important;
        padding-left: 18px !important;
        font-size: clamp(17px, 2.8vw, 23px) !important;
    }


    /* CONTADOR DE VIDAS */
    #hudVidas {
        top: 2px !important;
        right: 5px !important;
        width: clamp(105px, 20vw, 155px) !important;
        height: clamp(70px, 13vw, 100px) !important;
    }

    #hudVidas img {
        width: clamp(23px, 4.5vw, 36px) !important;
        height: auto !important;
    }


    /* TEMPORIZADOR */
    #hudTiempo {
        top: 75px !important;
        right: 5px !important;
        width: clamp(105px, 20vw, 155px) !important;
        height: clamp(75px, 13vw, 100px) !important;
        font-size: clamp(18px, 3vw, 25px) !important;
    }


    /* JOYSTICK */
    #joystickMovil {
        width: clamp(125px, 23vw, 190px) !important;
        height: clamp(125px, 23vw, 190px) !important;
        bottom: max(18px, env(safe-area-inset-bottom)) !important;
    }


    
/* PANTALLA FINAL */
#pantallaFinal {
    width: 100vw !important;
    height: 100dvh !important;
    padding: 15px !important;
    box-sizing: border-box !important;
    display: flex;
    flex-direction: column;
    justify-content: center !important;
    align-items: center !important;
    gap: 10px !important;
    overflow: hidden !important;
}

#pantallaFinal video {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    object-fit: contain !important;
    z-index: 0 !important;
}

/* CONTADOR */
#detalleFinal {
    position: relative !important;
    z-index: 1 !important;
    width: 90% !important;
    max-width: 600px !important;
    margin: 0 !important;
    padding: 8px !important;
    font-size: clamp(15px, 2.8vw, 23px) !important;
    line-height: 1.3 !important;
    text-align: center !important;
    box-sizing: border-box !important;
}

/* BOTONES */
#botonReiniciar,
#botonContinuar,
#botonReintentarNivel3 {
    position: relative !important;
    z-index: 2 !important;
    width: auto !important;
    max-width: 90% !important;
    min-height: 42px !important;
    margin: 0 !important;
    padding: 10px 18px !important;
    font-size: clamp(14px, 2.5vw, 20px) !important;
    border-radius: 10px !important;
    box-sizing: border-box !important;
}


    /* TUTORIAL */
    #pantallaTutorial {
        width: 100vw !important;
        height: 100dvh !important;
        overflow: hidden !important;
    }

    #pantallaTutorial video {
        width: 100% !important;
        height: 100% !important;
        object-fit: contain !important;
    }

    #pantallaTutorial button {
        bottom: max(12px, env(safe-area-inset-bottom)) !important;
        font-size: clamp(14px, 2.5vw, 19px) !important;
        padding: 10px 20px !important;
    }

}


/* AJUSTES EXTRA PARA CELULARES EN VERTICAL */
@media (pointer: coarse) and (max-width: 600px) {

    #menuPrincipal {
        gap: 8px !important;
    }

    #menuPrincipal img {
        width: min(75vw, 280px) !important;
        margin-bottom: 12px !important;
    }

    #opcionesMenu {
        gap: 8px !important;
    }

    #opcionesMenu button {
        width: 105px !important;
        height: 42px !important;
        font-size: 15px !important;
    }

    #hudNivel {
        top: 85px !important;
        font-size: 19px !important;
    }

    #hudEstrellas {
        width: 112px !important;
        height: 78px !important;
        font-size: 16px !important;
        padding-left: 12px !important;
    }

    #hudVidas {
        width: 105px !important;
        height: 70px !important;
    }

    #hudVidas img {
        width: 23px !important;
    }

    #hudTiempo {
        top: 65px !important;
        width: 105px !important;
        height: 75px !important;
        font-size: 18px !important;
    }

    #joystickMovil {
        width: 145px !important;
        height: 145px !important;
        left: 50% !important;
        right: auto !important;
        transform: translateX(-50%) !important;
    }

    #detalleFinal {
        font-size: 16px !important;
    }



    #pantallaFinal {
        padding: 12px !important;
        gap: 8px !important;
    }

    #detalleFinal {
        font-size: 15px !important;
        max-width: 95% !important;
    }

    #botonReiniciar,
    #botonContinuar,
    #botonReintentarNivel3 {
        width: 85% !important;
        max-width: 300px !important;
        min-height: 40px !important;
        padding: 9px 12px !important;
        font-size: 14px !important;
    }


}


/* TABLETS */
@media (pointer: coarse) and (min-width: 601px) and (max-width: 1024px) {

    #joystickMovil {
        left: auto !important;
        right: 25px !important;
        transform: none !important;
    }

}

/* AJUSTE EXCLUSIVO PARA COMPUTADORA */
@media (pointer: fine) {

    #detalleFinal,
    #botonReiniciar,
    #botonContinuar,
    #botonReintentarNivel3 {
        transform: translateY(70px);
    }

}



/* ======================================
   BOTÓN DE PAUSA RESPONSIVO
====================================== */

/* TABLETS Y CELULARES */
@media (pointer: coarse) and (max-width: 1024px) {

    #botonPausa {
        width: clamp(45px, 9vw, 60px) !important;
        height: clamp(45px, 9vw, 60px) !important;
        bottom: 20px !important;
        left: 15px !important;
        font-size: clamp(22px, 5vw, 30px) !important;
    }

    #pantallaPausa {
        padding: 20px !important;
        box-sizing: border-box !important;
    }

    #botonContinuarPausa {
        min-width: 180px !important;
        min-height: 48px !important;
    }

}

/* CELULARES */
@media (pointer: coarse) and (max-width: 600px) {

    #botonPausa {
        bottom: 18px !important;
        left: 12px !important;
        width: 48px !important;
        height: 48px !important;
        font-size: 23px !important;
    }

}




  
`;

document.head.appendChild(estilosResponsivos);








// ANIMACIÓN 
function animate() {
    requestAnimationFrame(animate);

    // MOSTRAR CONTROLES SOLO EN CELULAR O TABLET
    if (esDispositivoTactil && juegoIniciado && !juegoTerminado && !juegoPausado) {

        controlesMoviles.style.display = 'block';

    } else {

        controlesMoviles.style.display = 'none';

    }




    if (cube && juegoIniciado && !juegoTerminado && !juegoPausado) {

        mover();
        collect();
        actualizarTimer();
        perseguirCamera();
        moverObstaculos();
        generarNuevosElementos();
        actualizarVelocidad();

        for (const estrella of spheresInScene) {
            if (estrella.visible) {
                estrella.rotation.y += 0.08;
            }
        }





        // MOSTRAR BOTÓN DE PAUSA SOLO DURANTE LA PARTIDA
        if (juegoIniciado && !juegoTerminado) {

            botonPausa.style.display = 'block';

        } else {

            botonPausa.style.display = 'none';

        }



        // GIRAR LOS CORAZONES SOBRE SU PROPIO EJE
        for (const corazon of corazonesInScene) {
            if (corazon.visible) {
                corazon.rotation.y += 0.08;
            }
        }

        // ANIMACIÓN DE LOS OBJETOS ESPECIALES
        for (const objeto of objetosEspeciales) {

            if (objeto.visible) {

                // GIRAR EL MODELO
                objeto.rotation.y += 0.025;

                // HACER PULSAR LA LUZ DORADA
                const tiempo = Date.now() * 0.003;

                objeto.userData.luz.intensity =
                    7 + Math.sin(tiempo) * 3;

                // ANIMAR EL RESPLANDOR
                objeto.userData.resplandor.material.opacity =
                    0.65 + Math.sin(tiempo) * 0.20;

                objeto.userData.resplandor.scale.set(
                    5 + Math.sin(tiempo) * 0.4,
                    5 + Math.sin(tiempo) * 0.4,
                    1
                );

            }
        }



    }

    frames++;

    const ahora = performance.now();

    if (ahora - inicioMedicion >= 1000) {
        console.log(
            "FPS:", frames,
            "| Dibujos:", renderer.info.render.calls,
            "| Triángulos:", renderer.info.render.triangles
        );

        frames = 0;
        inicioMedicion = ahora;
    }


    renderer.render(
        scene,
        camera
    );
}

console.log(
    "GPU:",
    renderer.getContext().getParameter(
        renderer.getContext().RENDERER
    )
);



// REDIMENSIONAR VENTANA Y CAMBIAR ORIENTACIÓN

function ajustarPantalla() {

    const ancho = window.innerWidth;
    const alto = window.innerHeight;

    camera.aspect = ancho / alto;
    camera.updateProjectionMatrix();

    renderer.setSize(ancho, alto);

}

window.addEventListener('resize', ajustarPantalla);

window.addEventListener('orientationchange', () => {

    setTimeout(() => {
        ajustarPantalla();
    }, 200);

});



// ANIMACIÓN DEL RESPLANDOR DEL PREMIO

objetosEspeciales.forEach((objeto) => {

    if (objeto.visible) {

        const tiempo = Date.now() * 0.003;

        objeto.userData.luz.intensity =
            7 + Math.sin(tiempo) * 3;

        objeto.userData.resplandor.material.opacity =
            0.65 + Math.sin(tiempo) * 0.20;

        objeto.userData.resplandor.scale.set(
            5 + Math.sin(tiempo) * 0.4,
            5 + Math.sin(tiempo) * 0.4,
            1
        );

    }

});
animate();


