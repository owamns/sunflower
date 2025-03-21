const NUM_PETALS = 12;  // Número de pétalos
const PETAL_RADIUS = 20;  // Radio para los pétalos
const PETAL_LAYERS = 1;  // Número de capas de pétalos
const NUM_SUNFLOWERS = 8;  // Número total de girasoles
const SUNFLOWERS_PER_QUADRANT = NUM_SUNFLOWERS / 4;  // Número de girasoles por cuadrante
const CONTAINER_SIZE = 300;  // Tamaño del contenedor de los pétalos
const MAX_DELAY = 2000;  // Tiempo máximo de retraso para la aparición de una flor (en ms)
const ANIMATION_SPEED = 0.7;  // Velocidad de animación (1.0 es normal, valores menores son más rápidos)

function getRandomPositionInQuadrant(quadrant) {
    const width = window.innerWidth / 2;  // Ancho de cada cuadrante
    const height = window.innerHeight / 2;  // Altura de cada cuadrante
    let x, y;

    // Evitar que las flores se salgan del margen restando el tamaño del contenedor
    switch (quadrant) {
        case 1:  // Cuadrante superior izquierdo
            x = Math.random() * (width - CONTAINER_SIZE);
            y = Math.random() * (height - CONTAINER_SIZE);
            break;
        case 2:  // Cuadrante superior derecho
            x = Math.random() * (width - CONTAINER_SIZE) + width/2;
            y = Math.random() * (height - CONTAINER_SIZE);
            break;
        case 3:  // Cuadrante inferior izquierdo
            x = Math.random() * (width - CONTAINER_SIZE);
            y = Math.random() * (height - CONTAINER_SIZE) + height/2;
            break;
        case 4:  // Cuadrante inferior derecho
            x = Math.random() * (width - CONTAINER_SIZE) + width/2;
            y = Math.random() * (height - CONTAINER_SIZE) + height/2;
            break;
    }

    return { x, y };
}

function createPetalContainer(quadrant) {
    const petalsContainer = document.createElement('div');
    petalsContainer.style.position = 'absolute';
    petalsContainer.style.width = `${CONTAINER_SIZE}px`;
    petalsContainer.style.height = `${CONTAINER_SIZE}px`;
    petalsContainer.style.overflow = 'hidden';

    // Posición aleatoria dentro del cuadrante
    const position = getRandomPositionInQuadrant(quadrant);
    petalsContainer.style.left = `${position.x}px`;
    petalsContainer.style.top = `${position.y}px`;

    document.body.appendChild(petalsContainer);
    return petalsContainer;
}

function createPetals(petalsContainer) {
    for (let i = 0; i < NUM_PETALS * PETAL_LAYERS; i++) {
        const petal = document.createElement('div');
        petal.classList.add('petal');

        // Calcular posición y rotación del pétalo
        const layer = Math.floor(i / NUM_PETALS);
        const angle = (i % NUM_PETALS) * (360 / NUM_PETALS) + (layer * (360 / (NUM_PETALS * 2)));
        const radius = PETAL_RADIUS + layer * 20;

        const x = radius * Math.cos((angle * Math.PI) / 180) + CONTAINER_SIZE / 2;  // Centrado
        const y = radius * Math.sin((angle * Math.PI) / 180) + CONTAINER_SIZE / 2;  // Centrado

        petal.style.left = `${x}px`;
        petal.style.top = `${y}px`;
        petal.style.transform = `rotate(${angle}deg)`;

        // Agregar animación con velocidad configurable
        petal.style.transition = `opacity ${0.5 * ANIMATION_SPEED}s, transform ${0.5 * ANIMATION_SPEED}s`;
        petal.style.opacity = 0;
        petal.style.transform += ' scale(0)';  // Iniciar con escala 0

        petalsContainer.appendChild(petal);

        // Animar el pétalo con velocidad configurable
        setTimeout(() => {
            petal.style.opacity = 1;
            petal.style.transform = `rotate(${angle}deg) scale(1)`;  // Finalizar en escala 1
        }, i * (100 * ANIMATION_SPEED));  // Ajustar retraso entre pétalos según la velocidad
    }
}

function removePetalContainer(petalsContainer) {
    setTimeout(() => {
        petalsContainer.remove();
    }, (NUM_PETALS * 100 * ANIMATION_SPEED) + (800 * ANIMATION_SPEED));  // Tiempo para que termine la animación
}

function generateSunflower(quadrant) {
    const petalsContainer = createPetalContainer(quadrant);
    createPetals(petalsContainer);
    removePetalContainer(petalsContainer);
}

function generateSunflowersInQuadrant(quadrant, numSunflowers) {
    for (let i = 0; i < numSunflowers; i++) {
        const randomDelay = Math.random() * MAX_DELAY;  // Retraso aleatorio
        setTimeout(() => {
            generateSunflower(quadrant);
        }, randomDelay);  // Aplicar el retraso aleatorio a cada girasol
    }
}

function generateMultipleSunflowers(numSunflowers) {
    // Generar girasoles en cada cuadrante
    generateSunflowersInQuadrant(1, SUNFLOWERS_PER_QUADRANT);  // Cuadrante 1 (superior izquierdo)
    generateSunflowersInQuadrant(2, SUNFLOWERS_PER_QUADRANT);  // Cuadrante 2 (superior derecho)
    generateSunflowersInQuadrant(3, SUNFLOWERS_PER_QUADRANT);  // Cuadrante 3 (inferior izquierdo)
    generateSunflowersInQuadrant(4, SUNFLOWERS_PER_QUADRANT);  // Cuadrante 4 (inferior derecho)
}

function removeAllSunflowers() {
    const containers = document.querySelectorAll('div'); // Selecciona todos los divs que podrían ser contenedores de girasoles
    containers.forEach(container => {
        if (container.style.position === 'absolute') {
            container.remove(); // Elimina el contenedor
        }
    });
}


// Generar múltiples girasoles simultáneamente en los 4 cuadrantes cada cierto intervalo

document.getElementById('startAnimation').addEventListener('click', () => {
    const startButton = document.getElementById('startAnimation'); // Obtener el botón
    removeAllSunflowers();
    const image = document.querySelector('.image');

    const titleText = "!Ten tus flores amarillas por preciosa";
    const titleElement = document.getElementById('animatedTitle');
    
    titleElement.innerHTML = '';
    
    startButton.disabled = true;
    startButton.classList.remove('ready');
    startButton.style.display = 'none';
    
    const words = titleText.split(' '); // Separar palabras
    let wordIndex = 0;
    
    function animateWords() {
        if (wordIndex < words.length) {
            const wordSpan = document.createElement('span'); // Contenedor para cada palabra
            wordSpan.classList.add('word');
            
            words[wordIndex].split('').forEach((char, charIndex) => {
                const span = document.createElement('span');
                span.textContent = char;
                span.classList.add('letter');
                span.style.opacity = 0; // Iniciar con opacidad 0
                span.style.animationDelay = `${charIndex * 50}ms`; // Agregar retraso para cada letra
                wordSpan.appendChild(span);
            });
    
            titleElement.appendChild(wordSpan);
    
            // Agregar un espacio no divisible después de cada palabra para que sea visible
            const space = document.createElement('span');
            space.innerHTML = '&nbsp;';
            titleElement.appendChild(space);
    
            let charIndex = 0;
    
            function animateLetters() {
                if (charIndex < wordSpan.children.length) {
                    wordSpan.children[charIndex].style.opacity = 1;
                    charIndex++;
                    setTimeout(animateLetters, 50);
                } else {
                    wordIndex++;
                    setTimeout(animateWords, 200); // Esperar antes de la siguiente palabra
                }
            }
    
            animateLetters();
        } else {
            // Añadir el corazón después del texto
            const heartSpan = document.createElement('span');
            heartSpan.textContent = '💛';
            heartSpan.classList.add('heart');
            titleElement.appendChild(heartSpan);
    
            startButton.disabled = false;
            startButton.classList.add('ready');
        }
    }
    
    animateWords();
    // Ocultar la imagen primero
    image.style.display = 'none';
    setTimeout(() => {
        // Mostrar la imagen y reiniciar la animación
        image.style.display = 'block'; // Mostrar la imagen
        image.style.animation = 'none'; // Resetea la animación
        void image.offsetWidth; // Forzar un reflujo para reiniciar la animación
        image.style.animation = 'slideUp 5s forwards'; // Reiniciar la animación
    }, 20); // Un pequeño retraso en milisegundos

    // Reiniciar el intervalo de generación de girasoles
    setInterval(() => {
        generateMultipleSunflowers(NUM_SUNFLOWERS);
    }, (NUM_PETALS * 100 * ANIMATION_SPEED) + (3000 * ANIMATION_SPEED));
});

