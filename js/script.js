// EVITAR ZOOM Y GESTOS NO DESEADOS
document.addEventListener('dblclick', function(event) { event.preventDefault(); }, { passive: false });
document.addEventListener('gesturestart', function(e) { e.preventDefault(); });
const isMobile = window.innerWidth < 768;

const paperSound = new Audio('assets/pagina.mp3'); // Ruta de tu sonido
paperSound.volume = 0.6;

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        typeWriter();

        // --- NUEVA LÍNEA: MOSTRAR EL LIBRO DESPUÉS DEL PRELOADER ---
        // Esperamos un poquito más (500ms) después de que se va el preloader para que aparezca el libro suavemente
        setTimeout(() => {
            document.getElementById('valentine-book').classList.add('book-appears');
        }, 500);
        // -----------------------------------------------------------

    }, 1500);
});


/* --- SECUENCIA INSTANTÁNEA: LOADER -> HEART --- */
window.addEventListener('load', () => {
    // 1. Esperamos 3.5 segundos de lectura de "Tu lugar feliz..."
    setTimeout(() => {
        const loader = document.getElementById('loading-screen');
        const intro = document.getElementById('intro-screen');
        
        // A. DESVANECER LOADER
        if (loader) {
            loader.style.opacity = '0'; // Se empieza a borrar
            // Lo quitamos del HTML después de que termine la animación (1s)
            setTimeout(() => { loader.style.display = 'none'; }, 1000);
        }

        // B. MOSTRAR CORAZÓN (INMEDIATAMENTE, SIN ESPERAS)
        if (intro) {
            // Como ya tiene display:flex en el CSS, solo subimos la opacidad.
            // Esto evita el "estiramiento" porque el layout ya estaba listo.
            intro.classList.add('active-heart-screen');
        }
        
    }, 3500); // Tiempo en pantalla del loader
});

function updateGreeting() {
    const hour = new Date().getHours();
    const greetingElem = document.getElementById('greeting');
    let text = "Hola, mi vida";
    if (hour >= 6 && hour < 12) text = "Buenos días, princesa ☀️";
    else if (hour >= 12 && hour < 20) text = "Que te vaya muy bien esta tarde 🌤️";
    else text = "Buenas noches mamor, recuerda dormir :3 🌙";
    greetingElem.innerText = text;
}
updateGreeting();

const whispers = [
    "Eres mi casualidad favorita", "Sonríe, te ves hermosa", "Te pienso a cada momento", 
    "Nuestra historia es mi favorita", "Tú y yo, contra el mundo", "Gracias por existir", 
    "Mi lugar feliz eres tú", "Eres arte", "Te amo más de lo que imaginas"
];
function showToast() {
    const container = document.getElementById('toast-container');
    const msg = whispers[Math.floor(Math.random() * whispers.length)];
    const div = document.createElement('div');
    div.className = 'toast-msg';
    div.innerText = msg;
    container.appendChild(div);
    requestAnimationFrame(() => { setTimeout(() => div.classList.add('active'), 50); });
    setTimeout(() => { div.classList.remove('active'); setTimeout(() => div.remove(), 600); }, 4000);
}
setInterval(showToast, 45000);

const zenToggle = document.getElementById('zen-toggle');
zenToggle.addEventListener('click', (e) => { e.stopPropagation(); document.body.classList.add('zen-active'); });
document.body.addEventListener('click', (e) => { if(document.body.classList.contains('zen-active')) { document.body.classList.remove('zen-active'); } });

// PARALLAX
const layer1 = document.getElementById('bg-layer-1'), layer2 = document.getElementById('bg-layer-2'), layer3 = document.getElementById('bg-layer-3');
let targetX = 0, targetY = 0, currentX = 0, currentY = 0; 
function updateParallax() {
    currentX += (targetX - currentX) * 0.12; currentY += (targetY - currentY) * 0.12;
    const x = Math.round(currentX * 100) / 100; const y = Math.round(currentY * 100) / 100;
    if(layer1) layer1.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    if(layer2) layer2.style.transform = `translate3d(${x * 1.8}px, ${y * 1.8}px, 0)`;
    if(layer3) layer3.style.transform = `translate3d(${x * 2.5}px, ${y * 2.5}px, 0)`;
    requestAnimationFrame(updateParallax);
}
updateParallax(); 
/* --- OPTIMIZACIÓN: CURSOR MÁGICO LIGERO --- */
let lastSparkTime = 0;

document.addEventListener('mousemove', function(e) {
    const now = Date.now();
    // LIMITADOR: Solo crea una chispa cada 50ms (20 veces por seg, no 1000)
    if (now - lastSparkTime < 50) return; 
    
    lastSparkTime = now;

    let body = document.querySelector('body');
    let spark = document.createElement('div');
    
    spark.className = 'spark';
    spark.style.left = (e.pageX - 2) + 'px'; 
    spark.style.top = (e.pageY - 2) + 'px';
    
    // Quitamos el random de la escala para que el navegador no recalcule tanto
    // spark.style.transform = `scale(${Math.random()})`; // BORRAR ESTO SI SIGUE LENTO
    
    body.appendChild(spark);

    setTimeout(function() {
        spark.remove();
    }, 800);
});
function handleOrientation(event) {
    if (event.gamma === null || event.beta === null) return;
    const x = Math.min(Math.max(event.gamma, -45), 45); const y = Math.min(Math.max(event.beta - 45, -45), 45); 
    targetX = x * 1.5; targetY = y * 1.5;
}
function requestMotionPermission() {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission().then(p => { if (p === 'granted') window.addEventListener('deviceorientation', handleOrientation, {passive: true}); }).catch(console.error);
    } else { window.addEventListener('deviceorientation', handleOrientation, {passive: true}); }
}

// TRAIL
const trailCanvas = document.getElementById('trail-canvas'), trailCtx = trailCanvas.getContext('2d', { alpha: true });
let particles = [];
function resizeTrail() { trailCanvas.width = window.innerWidth; trailCanvas.height = window.innerHeight; }
resizeTrail(); window.addEventListener('resize', resizeTrail, {passive: true});
class Particle {
    constructor(x, y) { this.x = x; this.y = y; this.size = Math.random() * 3 + 1; this.speedX = Math.random() * 2 - 1; this.speedY = Math.random() * 2 - 1; this.life = 1.0; this.color = `hsl(${Math.random() * 60 + 180}, 100%, 75%)`; }
    update() { this.x += this.speedX; this.y += this.speedY; this.life -= 0.02; if(this.size > 0.2) this.size -= 0.05; }
    draw() { trailCtx.fillStyle = this.color; trailCtx.globalAlpha = this.life; trailCtx.beginPath(); trailCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2); trailCtx.fill(); }
}
function handleParticles() { 
    trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height); 
    for (let i = particles.length - 1; i >= 0; i--) { particles[i].update(); particles[i].draw(); if (particles[i].life <= 0) { particles.splice(i, 1); } } 
    requestAnimationFrame(handleParticles); 
}
handleParticles();
const addParticle = (e) => { if(Math.random() > 0.5) return; const x = e.touches ? e.touches[0].clientX : e.clientX; const y = e.touches ? e.touches[0].clientY : e.clientY; particles.push(new Particle(x, y)); };
window.addEventListener('mousemove', addParticle, {passive: true}); window.addEventListener('touchmove', addParticle, {passive: true});

// GESTOS PLAYER
let touchStartY = 0; let isDragging = false;
const playerOverlay = document.getElementById('music-player-overlay');
playerOverlay.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; isDragging = false; }, {passive: true});
playerOverlay.addEventListener('touchmove', e => {
    const touchY = e.touches[0].clientY; const diff = touchY - touchStartY;
    const lyricsContent = document.getElementById('lyrics-text'); const playlistContent = document.getElementById('playlist-items-container');
    if (e.target.closest('.lyrics-text') && lyricsContent.scrollTop > 0) return;
    if (e.target.closest('#playlist-items-container') && playlistContent.scrollTop > 0) return;
    if (diff > 0) { playerOverlay.style.transition = 'none'; playerOverlay.style.transform = `translateY(${diff}px) translateZ(0)`; isDragging = true; }
}, {passive: false});
playerOverlay.addEventListener('touchend', e => {
    if (!isDragging) return; const touchY = e.changedTouches[0].clientY; const diff = touchY - touchStartY;
    playerOverlay.style.transition = 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)';
    if (diff > 150) { closeMusicPlayer(); setTimeout(() => { playerOverlay.style.transform = ''; }, 400); } else { playerOverlay.style.transform = ''; }
    isDragging = false;
});

// TYPING
const titleText = "Una cajita de razones"; const titleElement = document.getElementById('typewriter-title'); let charIndex = 0;
function typeWriter() { if (charIndex < titleText.length) { titleElement.innerHTML += titleText.charAt(charIndex); charIndex++; setTimeout(typeWriter, 120); } }

// FONDOS
const fadeOverlay = document.getElementById('fadeoverlay'), aurora = document.getElementById('aurora-bg'), ctxAurora = aurora.getContext('2d', {alpha: true}), canvas = document.getElementById('stars-bg'), ctx = canvas.getContext('2d', {alpha: true});
function resizeBGs() { aurora.width = (window.innerWidth * 1.3) / 2; aurora.height = (window.innerHeight * 1.3) / 2; canvas.width = window.innerWidth * 1.3; canvas.height = window.innerHeight * 1.3; }
resizeBGs(); window.addEventListener('resize', resizeBGs, {passive: true});

let auroraActive = false, auroraFrameId = null;
function drawAurora(ts=0) {
  if (!auroraActive) {ctxAurora.clearRect(0,0,aurora.width,aurora.height);return;}
  const w = aurora.width, h = aurora.height; ctxAurora.clearRect(0,0,w,h);
  const layers = [{ color: 'rgba(0, 255, 200, 0.4)', amp: h*0.2, ybase: h*0.5, freq: 0.003, speed: .08}, { color: 'rgba(160, 32, 240, 0.35)', amp: h*0.15, ybase: h*0.6, freq: 0.002, speed: .06}, { color: 'rgba(50, 205, 50, 0.3)', amp: h*0.25, ybase: h*0.45, freq: 0.001, speed: .04}];
  const step = 15; 
  for (let k=0;k<layers.length;k++) {
    const {color, amp, ybase, freq, speed} = layers[k]; ctxAurora.beginPath(); ctxAurora.moveTo(0, h);
    const tBase = ts*speed + 600*k;
    for(let i=0;i<=w;i+=step) { let sine = Math.sin(freq*i + tBase*0.0003 + Math.cos(i/200 + tBase*0.0002)); let y = ybase + (amp*(sine)); ctxAurora.lineTo(i, y); }
    ctxAurora.lineTo(w,h); ctxAurora.fillStyle = color; ctxAurora.fill(); 
  }
  auroraFrameId = requestAnimationFrame(drawAurora);
}
function activarAurora(){ auroraActive = true; aurora.style.opacity = "0.7"; drawAurora(); }
function desactivarAurora(){ if(auroraFrameId) cancelAnimationFrame(auroraFrameId); aurora.style.opacity = "0"; auroraActive=false; setTimeout(()=>{ctxAurora.clearRect(0,0,aurora.width,aurora.height);}, 1500);}

let universeMode = false, animUniverseId = null;
let stars=[], STAR_N=isMobile?40:88;
let universeStars = [], shooterQueue = [], flairCloud = [], dustCloud = [], lastSuperstar = 0, ripples = [], flashStars = [];
function resetStars(n=STAR_N){ stars=[]; for(let i=0;i<n;i++){stars.push({x: Math.random()*canvas.width, y: Math.random()*canvas.height,r: Math.random()*1.09+0.49,phase: Math.random()*Math.PI*2,s: Math.random()*0.14+0.07,sway: Math.random()*0.6+0.5});} }
resetStars();
function animStars(ts=0){
  if(universeMode) return; // Si entra al modo universo, esta se detiene

  // Limpiamos el canvas
  ctx.clearRect(0,0,canvas.width,canvas.height);

  const timeScale = ts/1000;

  for(let s of stars){
    // ESTO FALTABA: Calcular el brillo basado en el tiempo (seno)
    // Hace que parpadeen suavemente entre 0.3 y 1
    let a = 0.5 + Math.sin(timeScale + s.phase) * 0.5; 

    // Dibujamos la estrella con ese brillo dinámico
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, 2*Math.PI);
    
    // Usamos el 'a' (alpha) que calculamos arriba
    ctx.fillStyle = `rgba(255, 255, 255, ${a})`; 
    ctx.fill();
    
    // (Opcional) Un halo suave extra
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r * 2, 0, 2*Math.PI);
    ctx.fillStyle = `rgba(225, 234, 255, ${a * 0.15})`;
    ctx.fill();
  }
  
  requestAnimationFrame(animStars);
}
animStars();

const NUM_STARS = isMobile ? 180 : 400; const ORBITS = [32, 65, 90, 150, 120, 200, 260];
function genStarU() { let r = 0.4+Math.random()*1.3, hue = 210+Math.random()*80; let oRad = ORBITS[Math.floor(Math.random()*ORBITS.length)] + Math.random()*18; let oAng = Math.random()*2*Math.PI; return {bx: Math.random()*canvas.width, by: Math.random()*canvas.height, r,orbitRad: oRad, baseAngle: oAng,drift: Math.random()*2*Math.PI,speed: 0.00022+Math.random()*0.00045,glow: 7+r*6,phase: Math.random()*7, color: `hsla(${hue},74%,85%,.82)`, extraGlow: 0}; }
function resetUniverseStars() {universeStars = [];for(let i=0;i<NUM_STARS;i++) universeStars.push(genStarU());}
function spawnShooter() { const angle = Math.PI/22 + Math.random()*(Math.PI/6-Math.PI/22); const side = Math.random()<0.5; const x = side?-80:canvas.width+80; const y = Math.random()*canvas.height*0.29 + 60; const vx = side ? Math.cos(angle) : -Math.cos(angle); const vy = Math.sin(angle); shooterQueue.push({x0:x, y0:y, vx, vy, len: canvas.width*0.28+Math.random()*canvas.width*0.18, duration: 1400+Math.random()*1200,t0: performance.now()}); }
function spawnFlair() { if(Math.random()<0.13) flairCloud.push({x: Math.random()*canvas.width, y: Math.random()*canvas.height, r: 1.1+Math.random()*2.8, alpha: 0, up:true, peak: 0.18+Math.random()*0.13}); }
function genDust() {dustCloud.push({x: Math.random()*canvas.width, y: Math.random()*canvas.height*0.93, r: 11+Math.random()*35, baseAlpha: .045 + Math.random()*0.021, alpha: 0.05, hue: 170+Math.random()*60, pulsePhase: Math.random()*Math.PI*2});}
function resetDust() { dustCloud=[]; for(let i=0;i<12;i++) genDust(); }

// --- LETRAS RESTAURADAS ---
const songs = [
  {
    title: "La passion (Ext.)", artist: "Gigi D'Agostino", src: "assets/La Passion.mp3", cover: "assets/1.jpg", 
    lyrics: "Baby, I love you so, and never let you go\nI'm looking for your face, waiting for warm embrace\nI'm living in the space, I'm following your trace\nTell me what's going on, tell me what's going on\nI'm gonna make you queen, girl, have you ever seen?\nOh baby, come to me\nBaby, just come to me\nDon't break my heart tonight, swinging my soul desire\nBaby, just come to me, be what you wanna be\nUsing your fantasy, I need your soul to see\nBaby, just come to me, now we can do it right\nHolding each other tight, now we can make it right\nI promise you delight, waiting until daylight\nI gotta have the key, to open your heart to me\nNow I can set you free, be what you wanna be\nDon't wanna live alone, I gotta be so strong\nDon't wanna be alone\nBaby, I love you so, and never let you go\nI'm looking for your face, waiting for warm embrace\nI'm living in the space, I'm following your trace\nTell me what's going on, tell me what's going on\nI'm gonna make you queen, girl, have you ever seen?\nOh baby, come to me\nBaby, just come to me\nDon't break my heart tonight, swinging my soul desire\nBaby, just come to me, be what you wanna be\nUsing your fantasy, I need your soul to see\nBaby, just come to me, now we can do it right\nHolding each other tight, now we can make it right\nI promise you delight, waiting until daylight\nI gotta have the key, to open your heart to me\nNow I can set you free, be what you wanna be\nDon't wanna live alone, I gotta be so strong\nDon't wanna be alone\nBaby, I love you so, and never let you go\nI'm looking for your face, waiting for warm embrace\nI'm living in the space, I'm following your trace\nTell me what's going on, tell me what's going on\nI'm gonna make you queen, girl, have you ever seen?\nOh baby, come to me\nBaby, just come to me\nDon't break my heart tonight, swinging my soul desire\nBaby, just come to me, be what you wanna be\nUsing your fantasy, I need your soul to see\nBaby, just come to me\nI never think you wanna, we won't belong\nI can see your face too strong\nI sing you anything, you'll be wide on mind\nDon't you ever satisfy my soul in any by my side\nI'm not laughing, I'm not crying\nDon't you go\nBaby, I love you so, and never let you go\nI'm looking for your face, waiting for warm embrace\nI'm living in the space, I'm following your trace\nTell me what's going on, tell me what's going on\nI'm gonna make you queen, girl, have you ever seen?\nOh baby, come to me\nBaby, just come to me\nDon't break my heart tonight, swinging my soul desire\nBaby, just come to me, be what you wanna be\nUsing your fantasy, I need your soul to see\nBaby, just come to me\nI never think you wanna, we won't belong\nI can see your face too strong\nI sing you anything, you'll be wide on mind\nDon't you ever satisfy my soul in any by my side\nI'm not laughing, I'm not crying\nDon't you go\nBaby, I love you so, and never let you go\nI'm looking for your face, waiting for warm embrace\nI'm living in the space, I'm following your trace\nTell me what's going on, tell me what's going on\nI'm gonna make you queen, girl, have you ever seen?\nOh baby, come to me\nBaby, just come to me\nDon't break my heart tonight, swinging my soul desire\nBaby, just come to me, be what you wanna be\nUsing your fantasy, I need your soul to see\nBaby, just come to me\nI never think you wanna, we won't belong\nI can see your face too strong\nI sing you anything, you'll be wide on mind\nDon't you ever satisfy my soul in any by my side\nI'm not laughing, I'm not crying\nDon't you go\nBaby, I love you so, and never let you go\nI'm looking for your face, waiting for warm embrace\nI'm living in the space, I'm following your trace\nTell me what's going on, tell me what's going on\nI'm gonna make you queen, girl, have you ever seen?\nOh baby, come to me (to me, to me, to me)\nTo me (to me, to me, to me)\nTo me (to me, to me, to me)\nI never think you wanna, we won't belong\nI can see your face too strong\nI sing you anything, you'll be wide on mind\nDon't you ever satisfy my soul in any by my side\nI'm not laughing, I'm not crying\nDon't you go\nBaby, I love you so, and never let you go\nI'm looking for your face, waiting for warm embrace\nI'm living in the space, I'm following your trace\nTell me what's going on, tell me what's going on\nI'm gonna make you queen, girl, have you ever seen?\nOh baby, come to me",
    translation: "Cariño, te amo tanto y nunca te dejaré ir\nEstoy buscando tu rostro, esperando un cálido abrazo.\nEstoy viviendo en el espacio, estoy siguiendo tu rastro.\nDime que esta pasando, dime que esta pasando\nVoy a hacerte reina, niña, ¿lo has visto alguna vez?\nOh nena, ven a mí\nBebé, sólo ven a mí\nNo rompas mi corazón esta noche, balanceando el deseo de mi alma\nBebé, sólo ven a mí, sé lo que quieres ser\nUsando tu fantasía, necesito que tu alma vea\nCariño, solo ven a mí, ahora podemos hacerlo bien.\nAbrazándonos fuerte, ahora podemos hacerlo bien\nTe prometo deleite, esperando hasta el amanecer.\nTengo que tener la llave para abrirme tu corazón.\nAhora puedo liberarte, ser lo que quieras ser\nNo quiero vivir solo, tengo que ser tan fuerte\nNo quiero estar solo\nCariño, te amo tanto y nunca te dejaré ir\nEstoy buscando tu cara, esperando un cálido abrazo.\nEstoy viviendo en el espacio, estoy siguiendo tu rastro.\nDime que esta pasando, dime que esta pasando\nVoy a hacerte reina, niña, ¿lo has visto alguna vez?\nOh nena, ven a mí\nBebé, sólo ven a mí\nNo rompas mi corazón esta noche, balanceando el deseo de mi alma\nBebé, sólo ven a mí, sé lo que quieres ser\nUsando tu fantasía, necesito que tu alma vea\nBebé, sólo ven a mí\nNunca creo que quieras, no perteneceremos\nPuedo ver tu cara demasiado fuerte\nTe canto cualquier cosa, tendrás amplia mente\nNunca satisfagas mi alma en ninguno a mi lado.\nNo me estoy riendo, no estoy llorando\nno te vayas\nCariño, te amo tanto y nunca te dejaré ir\nEstoy buscando tu cara, esperando un cálido abrazo.\nEstoy viviendo en el espacio, estoy siguiendo tu rastro.\nDime que esta pasando, dime que esta pasando\nVoy a hacerte reina, niña, ¿lo has visto alguna vez?\nOh nena, ven a mí\nBebé, sólo ven a mí\nNo rompas mi corazón esta noche, balanceando el deseo de mi alma\nBebé, sólo ven a mí, sé lo que quieres ser\nUsando tu fantasía, necesito que tu alma vea\nBebé, sólo ven a mí\nNunca creo que quieras, no perteneceremos\nPuedo ver tu cara demasiado fuerte\nTe canto cualquier cosa, tendrás amplia mente\nNunca satisfagas mi alma en ninguno a mi lado.\nNo me estoy riendo, no estoy llorando\nno te vayas\nCariño, te amo tanto y nunca te dejaré ir\nEstoy buscando tu cara, esperando un cálido abrazo.\nEstoy viviendo en el espacio, estoy siguiendo tu rastro.\nDime que esta pasando, dime que esta pasando\nVoy a hacerte reina, niña, ¿lo has visto alguna vez?\nOh nena, ven a mí\nBebé, sólo ven a mí\nNo rompas mi corazón esta noche, balanceando el deseo de mi alma\nBebé, sólo ven a mí, sé lo que quieres ser\nUsando tu fantasía, necesito que tu alma vea\nBebé, sólo ven a mí\nNunca creo que quieras, no perteneceremos\nPuedo ver tu cara demasiado fuerte\nTe canto cualquier cosa, tendrás amplia mente\nNunca satisfagas mi alma en ninguno a mi lado.\nNo me estoy riendo, no estoy llorando\nno te vayas\nCariño, te amo tanto y nunca te dejaré ir\nEstoy buscando tu rostro, esperando un cálido abrazo.\nEstoy viviendo en el espacio, estoy siguiendo tu rastro.\nDime que esta pasando, dime que esta pasando\nVoy a hacerte reina, niña, ¿lo has visto alguna vez?\nOh nena, ven a mí (a mí, a mí, a mí)\nA mí (a mí, a mí, a mí)\nA mí (a mí, a mí, a mí)\nNunca creo que quieras, no perteneceremos\nPuedo ver tu cara demasiado fuerte\nTe canto cualquier cosa, tendrás amplia mente\nNunca satisfagas mi alma en ninguno a mi lado.\nNo me estoy riendo, no estoy llorando\nno te vayas\nCariño, te amo tanto y nunca te dejaré ir\nEstoy buscando tu rostro, esperando un cálido abrazo.\nEstoy viviendo en el espacio, estoy siguiendo tu rastro.\nDime que esta pasando, dime que esta pasando\nVoy a hacerte reina, niña, ¿lo has visto alguna vez?\nOh nena, ven a mí"
  },
  {
    title: "Never have enough", artist: "Los Retros", src: "assets/Los Retros - Never Have Enough.mp3", cover: "assets/2.jpg",
    lyrics: "I'll never leave your side\nI'll stay forever (forever)\nI can't go back\nIt's rainy weather (rainy weather)\nClose the curtains, my love\nWe are happy ending (happy ending)\nToo good to be true\nHow can someone like you\nEver care?\n\nCould never have enough\nNever have enough\nI never have enough\nNever have enough\nYou're all I think about\nYou're all I have left (all I have left)\nIf the universe says No\nThen I say Yes (I say yes)\nI wanna wake up every day\nWake up next to you (next to you)\nWe can do whatever you want\nIt's all up to you\nCould never have enough (never baby)\nNever have enough (never get tired)\nI never have enough\nNever have enough",
    translation: "Nunca me iré de tu lado\nMe quedaré para siempre (para siempre)\nNo puedo volver\nEs un clima lluvioso (clima lluvioso)\nCierra las cortinas, mi amor\nSomos un final feliz (final feliz)\nDemasiado bueno para ser verdad\n¿Cómo puede alguien como tú\nSiquiera importarle?\n\nNunca podría tener suficiente\nNunca tener suficiente\nNunca tengo suficiente\nNunca tener suficiente\nEres todo en lo que pienso\nEres todo lo que me queda (todo lo que me queda)\nSi el universo dice No\nEntonces yo digo Sí (yo digo sí)\nQuiero despertar cada día\nDespertar junto a ti (junto a ti)\nPodemos hacer lo que quieras\nTodo depende de ti\nNunca podría tener suficiente (nunca bebé)\nNunca tener suficiente (nunca cansarme)\nNunca tengo suficiente\nNunca tener suficiente"
  },
  {
    title: "Champagne Coast", artist: "Blood Orange", src: "assets/Blood Orange - Champagne Coast.mp3", cover: "assets/3.jpg",
    lyrics: "Come to my bedroom\nCome to my bedroom\nTell me what's the joke of giving if you never please\nI'm not against all your beliefs\nYoung as I want to know\nI never let you go\nDreaming in the baseball\nLove the face the snow\nCome to my bedroom\nCome to my bedroom\nTell me it's the perfect time\nI told you I'll be waiting hiding from the rain\nTell me what to do\nIf you never please\nI'm not against your beliefs\nBaby tell me what you need to know\nI never let you go\nDreaming in the baseball\nLove is the face of snow",
    translation: "Ven a mi habitación\nVen a mi habitación\nDime cuál es el chiste de dar si nunca complaces\nNo estoy en contra de todas tus creencias\nJoven como quiero saber\nNunca te dejaré ir\nSoñando en el béisbol\nAmor la cara de la nieve\nVen a mi habitación\nVen a mi habitación\nDime que es el momento perfecto\nTe dije que estaría esperando escondiéndome de la lluvia\nDime qué hacer\nSi nunca complaces\nNo estoy en contra de tus creencias\nBebé dime lo que necesitas saber\nNunca te dejaré ir\nSoñando en el béisbol\nEl amor es la cara de la nieve"
  },
  {
    title: "Something about us", artist: "Daft Punk", src: "assets/musica.mp3", cover: "assets/4.jpg",
    lyrics: "It might not be the right time\nI might not be the right one\nBut there's something about us I want to say\nCause there's something between us anyway\n\nI might not be the right one\nIt might not be the right time\nBut there's something about us I've got to do\nSome kind of secret I will share with you\n\nI need you more than anything in my life\nI want you more than anything in my life\nI'll miss you more than anyone in my life\nI love you more than anyone in my life",
    translation: "Puede que no sea el momento adecuado\nPuede que no sea el indicado\nPero hay algo sobre nosotros que quiero decir\nPorque de todos modos hay algo entre nosotros\n\nPuede que no sea el indicado\nPuede que no sea el momento adecuado\nPero hay algo sobre nosotros que tengo que hacer\nAlgún tipo de secreto que compartiré contigo\n\nTe necesito más que a nada en mi vida\nTe quiero más que a nada en mi vida\nTe extrañaré más que a nadie en mi vida\nTe amo más que a nadie en mi vida"
  },
  {title: "Sueña lindo corazón", artist: "Macario Martinez", src: "assets/Macario Martínez - sueña lindo, corazón.mp3", cover: "assets/5.jpg", lyrics: "Sueña lindo corazón\nSueña lindo que la herida que dejó\nYa no duela más\n¿Cómo es que me duele?\nÉl no sabe cómo es que me duele\nNo sabe cómo es que quisiera ir yo tener claridad\nSi no sé lo que soy para ti\nTú me tienes aquí\nSueña lindo corazón\nSueña lindo que la herida que dejó\nYa no duela más\n¿Cómo es que me duele?\nÉl no sabe cómo es que me duele\nNo sabe cómo es que quisiera ir yo saber la verdad\nSi al momento en que te conocí\nQuise hacerte feliz\nComo es que quisiera yo tenerte, quererte, quererte", translation: "Sueña lindo corazón\nSueña lindo que la herida que dejó\nYa no duela más\n¿Cómo es que me duele?\nÉl no sabe cómo es que me duele\nNo sabe cómo es que quisiera ir yo tener claridad\nSi no sé lo que soy para ti\nTú me tienes aquí\nSueña lindo corazón\nSueña lindo que la herida que dejó\nYa no duela más\n¿Cómo es que me duele?\nÉl no sabe cómo es que me duele\nNo sabe cómo es que quisiera ir yo saber la verdad\nSi al momento en que te conocí\nQuise hacerte feliz\nComo es que quisiera yo tenerte, quererte, quererte"},
  {
    title: "Dreams", artist: "The Cranberries", src: "assets/The Cranberries - Dreams (Dir Peter Scammell) (Official Music Video).mp3", cover: "assets/6.jpg",
    lyrics: "Oh, my life is changing everyday\nIn every possible way\nAnd though my dreams, it's never quite as it seems\nNever quite as it seems\n\nI know I felt like this before\nBut now I'm feeling it even more\nBecause it came from you\nThen I open up and see\nThe person falling here is me\nA different way to be\n\nI want more, impossible to ignore\nImpossible to ignore\nAnd they'll come true, impossible not to do\nImpossible not to do\n\nAnd now I tell you openly\nYou have my heart so don't hurt me\nYou're what I couldn't find\nA totally amazing mind\nSo understanding and so kind\nYou're everything to me",
    translation: "Oh, mi vida está cambiando todos los días\nDe todas las formas posibles\nY aunque mis sueños, nunca es como parece\nNunca es como parece\n\nSé que me he sentido así antes\nPero ahora lo siento aún más\nPorque vino de ti\nEntonces me abro y veo\nLa persona cayendo aquí soy yo\nUna forma diferente de ser\n\nQuiero más, imposible de ignorar\nImposible de ignorar\nY se harán realidad, imposible no hacerlo\nImposible no hacerlo\n\nY ahora te digo abiertamente\nTienes mi corazón así que no me lastimes\nEres lo que no podía encontrar\nUna mente totalmente asombrosa\nTan comprensiva y tan amable\nEres todo para mí"
  },
  {title: "Quiéreme siempre", artist: "Orquesta Aragón", src: "assets/Quiéreme Sempre.mp3", cover: "assets/7.jpg", lyrics: "Quiéreme siempre\nDame tu amor\nSiempre, quiéreme siempre\nTanto como yo a ti\nNunca, nunca me olvides\nDime, dime que sí\nCuando beso tu boca\nNada, nada es mejor\nDame, dame tu vida\nQuiéreme siempre\nDame tu amor\nSiempre, quiéreme siempre\nTanto como yo a ti\nNunca, nunca me olvides\nDime, dime que sí\nCuando beso tu boca\nNada, nada es mejor\nDame, dame tu vida\nQuiéreme siempre\nDame tu amor\nSiempre, quiéreme siempre\nTanto como yo a ti\nNunca, nunca me olvides\nDime, dime que sí\nCuando beso tu boca\nNada, nada es mejor\nDame, dame tu vida\nQuiéreme siempre\nDame tu amor", translation: "Quiéreme siempre\nDame tu amor\nSiempre, quiéreme siempre\nTanto como yo a ti\nNunca, nunca me olvides\nDime, dime que sí\nCuando beso tu boca\nNada, nada es mejor\nDame, dame tu vida\nQuiéreme siempre\nDame tu amor\nSiempre, quiéreme siempre\nTanto como yo a ti\nNunca, nunca me olvides\nDime, dime que sí\nCuando beso tu boca\nNada, nada es mejor\nDame, dame tu vida\nQuiéreme siempre\nDame tu amor"},
  {
    title: "My kind of woman", artist: "Mac DeMarco", src: "assets/Mac DeMarco  My Kind of Woman (OFFICIAL VIDEO).mp3", cover: "assets/8.jpg",
    lyrics: "Oh baby, oh man\nYou're making me crazy, really driving me mad\nThat's all right with me\nIt's really no new thing\nJust got to understand\n\nYou're my, my, my, my kind of woman\nMy, oh my, what a girl\nYou're my, my, my, my kind of woman\nAnd I'm down on my hands and knees\nBegging you please, baby\nShow me your world\n\nOh brother, sweetheart\nI'm feeling so tired, really falling apart\nAnd it just don't make sense to me\nI really don't know\nWhy you stick right next to me\nOr wherever I go",
    translation: "Oh bebé, oh hombre\nMe estás volviendo loco, realmente volviéndome loco\nEso está bien conmigo\nRealmente no es cosa nueva\nSolo tienes que entender\n\nEres mi, mi, mi, mi tipo de mujer\nMi, oh mi, qué chica\nEres mi, mi, mi, mi tipo de mujer\nY estoy de rodillas\nRogándote por favor, bebé\nMuéstrame tu mundo\n\nOh hermano, cariño\nMe siento tan cansado, realmente desmoronándome\nY simplemente no tiene sentido para mí\nRealmente no sé\nPor qué te quedas justo a mi lado\nO donde sea que vaya"
  },
  {
    title: "November Rain", artist: "Guns N' Roses", src: "assets/November Rain (2022 Version).mp3", cover: "assets/9.jpg",
    lyrics: "When I look into your eyes\nI can see a love restrained\nBut darlin' when I hold you\nDon't you know I feel the same?\n'Cause nothin' lasts forever\nAnd we both know hearts can change\nAnd it's hard to hold a candle\nIn the cold November rain\n\nWe've been through this such a long long time\nJust tryin' to kill the pain\nBut lovers always come and lovers always go\nAnd no one's really sure who's lettin' go today\nWalking away\n\nIf we could take the time\nTo lay it on the line\nI could rest my head\nJust knowin' that you were mine\nAll mine\nSo if you want to love me\nThen darlin' don't refrain\nOr I'll just end up walkin'\nIn the cold November rain",
    translation: "Cuando miro en tus ojos\nPuedo ver un amor contenido\nPero querida cuando te abrazo\n¿No sabes que siento lo mismo?\nPorque nada dura para siempre\nY ambos sabemos que los corazones pueden cambiar\nY es difícil sostener una vela\nEn la fría lluvia de noviembre\n\nHemos pasado por esto tanto tiempo\nSolo tratando de matar el dolor\nPero los amantes siempre vienen y los amantes siempre se van\nY nadie está realmente seguro de quién está dejando ir hoy\nAlejándose\n\nSi pudiéramos tomarnos el tiempo\nPara ponerlo en claro\nPodría descansar mi cabeza\nSolo sabiendo que eras mía\nCompletamente mía\nAsí que si quieres amarme\nEntonces querida no te reprimas\nO simplemente terminaré caminando\nEn la fría lluvia de noviembre"
  },
  {
    title: "Every Breath You Take", artist: "The Police", src: "assets/Every Breath You Take.mp3", cover: "assets/10.jpg",
    lyrics: "Every breath you take\nAnd every move you make\nEvery bond you break\nEvery step you take\nI'll be watching you\n\nEvery single day\nAnd every word you say\nEvery game you play\nEvery night you stay\nI'll be watching you\n\nOh, can't you see\nYou belong to me\nHow my poor heart aches\nWith every step you take\n\nEvery move you make\nAnd every vow you break\nEvery smile you fake\nEvery claim you stake\nI'll be watching you",
    translation: "Cada respiro que tomas\nY cada movimiento que haces\nCada lazo que rompes\nCada paso que das\nTe estaré observando\n\nCada día\nY cada palabra que dices\nCada juego que juegas\nCada noche que te quedas\nTe estaré observando\n\nOh, ¿no puedes ver?\nTú me perteneces\nCómo duele mi pobre corazón\nCon cada paso que das\n\nCada movimiento que haces\nY cada voto que rompes\nCada sonrisa que finges\nCada reclamo que haces\nTe estaré observando"
  },
  {
    title: "Kingston town", artist: "UB40", src: "assets/UB40 - Kingston Town 1989 (Official Music Video) Remastered.mp3", cover: "assets/11.jpg",
    lyrics: "The night seems to fade\nBut the moonlight lingers on\nThere are wonders for everyone\nThe stars shine so bright\nBut they're fading after dawn\nThere is magic in Kingston Town\n\nOh Kingston Town\nThe place I long to be\nIf I had the whole world\nI would give it away\nJust to see the girls at play\n\nAnd when I am king\nSurely I would need a queen\nAnd a palace and everything, yeah\nAnd now I am king\nAnd my queen will come at dawn\nShe'll be waiting in Kingston Town",
    translation: "La noche parece desvanecerse\nPero la luz de la luna persiste\nHay maravillas para todos\nLas estrellas brillan tan fuerte\nPero se desvanecen después del amanecer\nHay magia en Kingston Town\n\nOh Kingston Town\nEl lugar donde anhelo estar\nSi tuviera el mundo entero\nLo regalaría\nSolo para ver a las chicas jugar\n\nY cuando sea rey\nSeguramente necesitaría una reina\nY un palacio y todo, sí\nY ahora soy rey\nY mi reina vendrá al amanecer\nElla estará esperando en Kingston Town"
  },
  {
    title: "Kimi Ga Iru", artist: "Galla", src: "assets/KimiGaIru.mp3", cover: "assets/12.jpg",
    lyrics: "Furikaereba itsudatte\nKawaranu kimi no egao ga atta\nArukitsukare tachidomaru hi mo\nChiisa na yorokobi no hi mo\nKono ryoute ni kakaekirenai\nAi wo oshiete kureta\n\nAh atatakaku sotto yasashiku\nYomigaeru kaze wa\nMada ano hi no mama no mabushisa de\nFukinukete yuku yo\n\nUragiru koto no tsumibukasa wo\nShinjiaeru koto no tsuyosa wo\nKazoekirenu hiru to yoru wo\nMune ni shimatteyukou\nWakare to deai no michi wo\nKizutsukinagara bokura wa aruiteyuku n' da ne",
    translation: "Si miro hacia atrás, siempre\nEstaba tu sonrisa que no cambia\nIncluso en los días que me detengo cansado de caminar\nIncluso en los días de pequeña alegría\nQue no puedo sostener con estos dos brazos\nMe enseñaste el amor\n\nAh, cálidamente, suavemente, gentilmente\nEl viento que revive\nAún con el resplandor de ese día\nSigue soplando a través\n\nLa pecaminosidad de traicionar\nLa fuerza de creer el uno en el otro\nInnumerables días y noches\nVamos a guardarlos en el pecho\nEl camino de despedidas y encuentros\nMientras nos lastimamos, caminamos"
  },
  {title: "Silencioso Amor", artist: "Kraken", src: "assets/Kraken - Silencioso amor.mp3", cover: "assets/13.jpg", lyrics: "Me tomas o dejas\nMe daña tu juego insensible\nY ruego que quieras hablar\nMas nada me dices\nMis manos hoy tiemblan\nY muerdo palabras que solo te piden\nQue cambies la espera\nDe amor imposible\n\nTú... Que encuentras en mí calor\nTú... Que tomas de mí lo mejor\nTú... Escúchame por favor\nSilencioso amor\nNo rompas mi corazón\nNo, no, no\nAmor que trasciendes\nHorarios de estrellas por mágicas sendas\nAmor insensible\nEscucha y no olvides\nTú... Que encuentras en mí calor\nTú... Que tomas de mí lo mejor\nTú... Escúchame por favor\nSilencioso amor\nNo rompas mi corazón\nOh, oh, oh", translation: "Me tomas o dejas\nMe daña tu juego insensible\nY ruego que quieras hablar\nMas nada me dices\nMis manos hoy tiemblan\nY muerdo palabras que solo te piden\nQue cambies la espera\nDe amor imposible\n\nTú... Que encuentras en mí calor\nTú... Que tomas de mí lo mejor\nTú... Escúchame por favor\nSilencioso amor\nNo rompas mi corazón\nNo, no, no\nAmor que trasciendes\nHorarios de estrellas por mágicas sendas\nAmor insensible\nEscucha y no olvides\nTú... Que encuentras en mí calor\nTú... Que tomas de mí lo mejor\nTú... Escúchame por favor\nSilencioso amor\nNo rompas mi corazón\nOh, oh, oh"}
];

let currentLyricsMode = 'original'; 
function setLyricsMode(mode) {
    if(currentLyricsMode === mode) return; // Evitar re-render innecesario
    currentLyricsMode = mode;
    document.getElementById('opt-original').classList.toggle('active', mode === 'original');
    document.getElementById('opt-translate').classList.toggle('active', mode === 'translate');
    renderAppleLyrics();
}

function renderAppleLyrics() {
    const song = songs[currentSongIndex];
    const rawText = currentLyricsMode === 'original' ? song.lyrics : song.translation;
    const lines = rawText.split('\n');
    const container = document.getElementById('lyrics-text');
    
    // USAR DOCUMENT FRAGMENT PARA 1 SOLO REFLOW
    const fragment = document.createDocumentFragment();
    
    lines.forEach((line) => {
        if(!line.trim()) return;
        const div = document.createElement('div');
        div.className = 'lyric-line';
        div.innerText = line;
        div.onclick = function() {
            document.querySelectorAll('.lyric-line').forEach(l => l.classList.remove('active'));
            div.classList.add('active');
            div.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };
        fragment.appendChild(div);
    });
    
    container.innerHTML = ''; // Limpiar una sola vez
    container.appendChild(fragment); // Insertar de golpe
    if(container.firstChild) container.firstChild.classList.add('active');
}

const allGifts = [
  {emoji:'🌠',title:'Nuestro deseo',desc:'Pide un deseo, ya yo pedí el mío :)'},
  {emoji:'💖',title:'Corazón brillante',desc:'Mi corazón late más y más por ti'},
  {emoji:'🎶',title:'Melodía secreta',desc:'Sigue presionando y habrá una sorpresa :3'},
  {emoji:'🦄',title:'Magia inesperada',desc:'Las estrellas se mueven cuando pasas, eres la estrella más reluciente'},
  {emoji:'📷',title:'Recuerdo inolvidable',desc:'En el futuro veremos este mensaje juntos'},
  {emoji:'🎵',title:'Nuestra Playlist',desc:'Presiona para escuchar esta playlist que he hecho con mucho amor .-.', type: 'playlist'} 
];

let giftsUnlocked = [], GIFT_TRIGGER = 5, universeTouchCount = 0, nextGift = 0, badgeCount = 0, visitedUniverseBefore = false;

const observerOptions = {root: document.getElementById('gallery-scroll-view'),rootMargin: '-45% 0px -45% 0px', threshold: 0};
const giftObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {if (entry.isIntersecting) {entry.target.classList.add('active');} else {entry.target.classList.remove('active');}});
}, observerOptions);

function showGifts() {
  const gal = document.getElementById('gift-gallery'); gal.classList.add('visible'); 
  badgeCount = 0; document.getElementById('notification-badge').style.display = 'none'; document.getElementById('notification-badge').innerText = '0';
  const scrollContainer = document.getElementById('gallery-scroll-view'); scrollContainer.innerHTML = ''; 
  const fragment = document.createDocumentFragment();
  giftsUnlocked.forEach(idx => {
    const gift = allGifts[idx]; const d = document.createElement('div'); d.className = 'gift-card';
    d.innerHTML = `<div style="font-size:3.5em; margin-bottom:10px;">${gift.emoji}</div><div style="font-weight:700;color:${gift.type==='playlist'?'#ff2d55':'#30d5c8'};font-size:1.3em;margin-bottom:8px;font-family:Pacifico,cursive;">${gift.title}</div><div style="color:#b8e6e1;font-size:0.95em;">${gift.desc}</div>`;
    if(gift.type === 'playlist'){ d.onclick = () => { openMusicPlayer(); }; d.style.cursor = "pointer"; }
    fragment.appendChild(d); giftObserver.observe(d);
  });
  scrollContainer.appendChild(fragment);
}
function hideGifts() { document.getElementById('gift-gallery').classList.remove('visible'); }
document.getElementById('open-gifts-btn').onclick = showGifts;

function updateNotification() {
  badgeCount++; const badge = document.getElementById('notification-badge');
  badge.innerText = badgeCount; badge.style.display = 'flex'; 
  if(universeMode) document.getElementById('open-gifts-btn').style.display='flex';
}

canvas.addEventListener('pointerdown', function(e){
  if(!universeMode) return;
  if(ripples.length > 6) ripples.shift(); 
  let rect = canvas.getBoundingClientRect(); let x = e.clientX - rect.left; let y = e.clientY - rect.top;
  ripples.push({x, y, radius: 0, alpha: 0.32, born: performance.now()});
  flashStars.push({x, y, size: 0, alpha: 1, born: performance.now()});
  universeTouchCount++;
  if(universeTouchCount >= GIFT_TRIGGER && nextGift < allGifts.length) {
    giftsUnlocked.push(nextGift); nextGift++; updateNotification(); universeTouchCount = 0;
  }
});

function returnToCardsFromMusic() { closeMusicPlayer(); returnToCards(); }

function returnToCards() {
  stopUniverseMode(); hideGifts(); 
  document.getElementById('open-gifts-btn').style.display = 'none';
  document.getElementById('back-to-cards-btn').style.display = 'none';
  const wrapper = document.getElementById('main-wrapper');
  wrapper.style.display = "flex"; void wrapper.offsetWidth; wrapper.style.opacity = "1";
  document.getElementById('finalMsg').classList.remove('visible'); 
  if(visitedUniverseBefore) document.getElementById('btn-return-stars').classList.add('visible');

  if(!playAudio.paused || playAudio.currentTime > 0){
      document.getElementById('mini-player').classList.add('visible');
      document.getElementById('music-toggle').style.display = 'none';
  } else {
      document.getElementById('mini-player').classList.remove('visible');
      document.getElementById('music-toggle').style.display = 'flex';
  }
  animStars();
  fadeOverlay.classList.add('active');
  setTimeout(() => { fadeOverlay.classList.remove('active'); }, 300);
}

function goToStars() {
    if(typeof requestMotionPermission === 'function') requestMotionPermission();
    const wrapper = document.getElementById('main-wrapper');
    wrapper.style.opacity = "0";
    setTimeout(() => { wrapper.style.display="none"; }, 600);
    document.getElementById('btn-return-stars').classList.remove('visible');
    startUniverseMode(); 
    if(!playAudio.paused || playAudio.currentTime > 0) {
        document.getElementById('mini-player').classList.add('visible');
        document.getElementById('music-toggle').style.display = 'none';
    } else {
        document.getElementById('mini-player').classList.remove('visible');
        document.getElementById('music-toggle').style.display = 'flex';
    }
    fadeOverlay.classList.add('active');
    setTimeout(() => { fadeOverlay.classList.remove('active'); }, 700);
}

let currentSongIndex = 0;
const playAudio = document.getElementById('playlist-audio');
const bgAudio = document.getElementById('background-music');

function openMusicPlayer() {
  if(!bgAudio.paused){ bgAudio.pause(); document.getElementById('icon-play').style.display='block'; document.getElementById('icon-pause').style.display='none';}
  
  // USAR RequestAnimationFrame PARA QUE LA CLASE ACTIVE ENTRE CUANDO EL NAVEGADOR ESTE LISTO
  const overlay = document.getElementById('music-player-overlay');
  overlay.style.display = 'flex';
  requestAnimationFrame(() => { overlay.classList.add('active'); });

  document.getElementById('mini-player').classList.remove('visible');
  if(!playAudio.src || playAudio.src === window.location.href) { loadSong(currentSongIndex); }
  fillPlaylist();
}

function closeMusicPlayer() { 
    document.getElementById('music-player-overlay').classList.remove('active');
    // Esperar transición para ocultar si se desea, pero dejarlo flex no daña
    if(!playAudio.paused || playAudio.currentTime > 0) { document.getElementById('mini-player').classList.add('visible'); }
}

function loadSong(index) {
  currentSongIndex = index; const song = songs[index]; playAudio.src = song.src;
  document.getElementById('player-title').innerText = song.title; document.getElementById('player-artist').innerText = song.artist;
  document.getElementById('player-art').style.backgroundImage = `url(${song.cover})`;
  document.getElementById('player-bg').style.backgroundImage = `url(${song.cover})`;
  
  renderAppleLyrics();

  document.getElementById('mp-title').innerText = song.title; document.getElementById('mp-artist').innerText = song.artist;
  document.getElementById('mp-art').style.backgroundImage = `url(${song.cover})`;
  updatePlaylistHighlight();
  document.getElementById('progress-fill').style.width = '0%'; document.getElementById('current-time').innerText = '0:00';
  
  // UI OPTIMISTA: Asumimos que cargará y mostramos Play
  updatePlayIcon(true);
  playAudio.play().catch(()=>{updatePlayIcon(false);});
}

function togglePlayPlayer() { 
    // FEEDBACK INSTANTANEO (0ms lag)
    const isPaused = playAudio.paused;
    updatePlayIcon(isPaused); // Si estaba pausado, ahora mostramos pausa (reproduciendo)
    
    if(isPaused) { playAudio.play(); } else { playAudio.pause(); } 
}

function updatePlayIcon(isPlaying) {
  const icon = isPlaying ? '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>' : '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  document.getElementById('btn-play-icon').innerHTML = icon; document.getElementById('mp-play-btn').innerHTML = icon;
  const art = document.getElementById('mp-art'); if(isPlaying) art.classList.add('playing'); else art.classList.remove('playing');
}

function nextSong() { currentSongIndex = (currentSongIndex + 1) % songs.length; loadSong(currentSongIndex); }
function prevSong() { currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length; loadSong(currentSongIndex); }

playAudio.ontimeupdate = () => {
  if(playAudio.duration) {
    const percent = (playAudio.currentTime / playAudio.duration) * 100;
    document.getElementById('progress-fill').style.width = percent + '%';
    document.getElementById('current-time').innerText = formatTime(playAudio.currentTime);
    document.getElementById('total-duration').innerText = formatTime(playAudio.duration);
  }
}
playAudio.onended = nextSong;
function seekSong(e) { const width = e.target.clientWidth; const clickX = e.offsetX; const duration = playAudio.duration; playAudio.currentTime = (clickX / width) * duration; }
function formatTime(s) { const min = Math.floor(s / 60); const sec = Math.floor(s % 60); return min + ':' + (sec < 10 ? '0'+sec : sec); }
function toggleLyrics() { document.getElementById('lyrics-overlay').classList.toggle('show'); }
function togglePlaylistView() { document.getElementById('playlist-view').classList.toggle('show'); }
function fillPlaylist() {
  const container = document.getElementById('playlist-items-container'); container.innerHTML = '';
  const fragment = document.createDocumentFragment();
  songs.forEach((song, idx) => {
    const div = document.createElement('div'); div.className = 'playlist-item';
    if(idx === currentSongIndex) div.classList.add('current');
    div.innerText = (idx+1) + '. ' + song.title + ' - ' + song.artist;
    div.onclick = () => { loadSong(idx); togglePlaylistView(); };
    fragment.appendChild(div);
  });
  container.appendChild(fragment);
}
function updatePlaylistHighlight() {
  const items = document.querySelectorAll('.playlist-item');
  items.forEach((item, idx) => { if(idx === currentSongIndex) item.classList.add('current'); else item.classList.remove('current'); });
}

// ANIMACIÓN UNIVERSO (Mismos cálculos optimizados)
function animateUniverse(ts=0) {
  if(!ts) ts = performance.now(); ctx.clearRect(0,0,canvas.width,canvas.height);
  let grad = ctx.createRadialGradient(canvas.width/2,canvas.height/2,canvas.height/13,canvas.width/2,canvas.height/2,canvas.height*0.9);
  grad.addColorStop(0,'rgba(78,133,200,.10)'); grad.addColorStop(1,'#0a1014');
  ctx.fillStyle=grad; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.shadowBlur = 0; 
  for(let d of dustCloud){ d.alpha = d.baseAlpha + Math.sin((ts/2000) + d.pulsePhase) * 0.015; ctx.globalAlpha = Math.max(0, d.alpha); ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,2*Math.PI); ctx.fillStyle=`hsla(${d.hue},55%,80%,1)`; ctx.fill(); }
  ctx.globalAlpha = 1; 
  for(let i=0;i<universeStars.length;i++){
    let s = universeStars[i]; let t = ts * s.speed + s.drift; let movr = s.orbitRad*Math.cos(ts*0.00013+s.bx/(canvas.width+1)); let mx = s.bx + Math.cos(s.baseAngle+t)*movr*0.7; let my = s.by + Math.sin(s.baseAngle+t)*movr*0.33;
    for(let r of ripples){ let rawProgress = (ts - r.born) / 950; let progress = Math.max(0, rawProgress); if(progress > 1) continue; let dx = mx - r.x; let dy = my - r.y; let dist = Math.hypot(dx, dy); if (dist < 110 * progress + 20 && dist > 110 * progress - 20) { s.extraGlow = 1.0; } if(dist < 90 && progress < 0.7){ let angle = Math.atan2(dy, dx); let force = 4 * (1 - progress); s.bx += Math.cos(angle) * force; s.by += Math.sin(angle) * force; } }
    let baseAlpha = 0.66+Math.sin(ts/430+s.phase)*0.21;
    if(s.extraGlow > 0) { s.extraGlow -= 0.02; ctx.beginPath(); ctx.arc(mx,my,s.r*3.5,0,2*Math.PI); ctx.fillStyle = `rgba(255,255,255,${s.extraGlow * 0.6})`; ctx.fill(); }
    ctx.globalAlpha = baseAlpha; ctx.beginPath(); ctx.arc(mx,my,s.r,0,2*Math.PI); ctx.fillStyle=s.color; ctx.fill(); ctx.globalAlpha = 1;
    if(i===17 && ts-lastSuperstar>11700){ lastSuperstar=ts; for(let j=0;j<45;j++){ flairCloud.push({x:mx+Math.random()*21-10, y:my+Math.random()*20-10, r:4+Math.random()*5,alpha:1, up:false, peak:0.7}); } }
  }
  for(let i=shooterQueue.length-1; i>=0; i--){ let s = shooterQueue[i], age = ts - s.t0; if(age>s.duration){ shooterQueue.splice(i,1); continue; } let prog = age/s.duration; let px = s.x0 + s.vx*canvas.width*prog; let py = s.y0 + s.vy*canvas.width*prog*0.63; let tail = s.len*prog*0.9; let tx = px - s.vx*tail, ty = py - s.vy*tail*0.68; let alpha = 1;if(prog < 0.15) alpha = prog/0.15;if(prog > 0.88) alpha = (1-prog)/0.12;alpha = Math.max(0, Math.min(1, alpha)); let grad = ctx.createLinearGradient(tx,ty,px,py); grad.addColorStop(0,'rgba(255,247,188,0)');grad.addColorStop(1,`rgba(255,255,245,${0.8*alpha})`); ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(px, py);ctx.strokeStyle=grad; ctx.lineWidth = 1.15+2.3*alpha; ctx.stroke(); }
  for(let f of flairCloud){ if(f.up) f.alpha+=0.01; else f.alpha-=0.008; if(f.alpha>f.peak) f.up=false; }
  for(let i=flairCloud.length-1;i>=0;i--){ if(flairCloud[i].alpha<0.01) flairCloud.splice(i,1); }
  for(let f of flairCloud){ ctx.globalAlpha = f.alpha; ctx.beginPath(); ctx.arc(f.x,f.y,f.r,0,2*Math.PI); ctx.fillStyle="#d2eaff"; ctx.fill(); } ctx.globalAlpha = 1;
  for(let i=ripples.length-1; i>=0; i--){ let r = ripples[i]; let rawProgress = (ts-r.born)/950; let progress = Math.max(0, rawProgress); if(progress>1) { ripples.splice(i,1); continue; } let rad = progress*110; if(rad < 0) rad = 0; ctx.beginPath(); try { let grad = ctx.createRadialGradient(r.x, r.y, 2, r.x, r.y, rad); grad.addColorStop(0, "rgba(171,242,255,"+(r.alpha*0.65*(1-progress))+")"); grad.addColorStop(0.6, "rgba(89,232,255,"+(r.alpha*0.21*(1-progress))+")"); grad.addColorStop(1, "rgba(161,206,255,0)"); ctx.fillStyle = grad; ctx.arc(r.x, r.y, rad, 0, 2*Math.PI); ctx.fill(); } catch(e) {} }
  for(let i=flashStars.length-1; i>=0; i--){ let f = flashStars[i]; let age = (ts - f.born); if(age > 600) { flashStars.splice(i,1); continue; } let p = age / 600; let scale = 1 + p * 0.5; let alpha = 1 - p; ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(p * 0.5); ctx.globalAlpha = alpha; ctx.beginPath(); ctx.arc(0, 0, 4*scale, 0, Math.PI*2); ctx.fillStyle = "#fff"; ctx.shadowBlur = 20; ctx.shadowColor="white"; ctx.fill(); ctx.shadowBlur=0; ctx.beginPath(); ctx.moveTo(-15*scale, 0); ctx.lineTo(15*scale, 0); ctx.moveTo(0, -15*scale); ctx.lineTo(0, 15*scale); ctx.strokeStyle = "rgba(255,255,255,0.9)"; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); }
  if(Math.random()<0.015) spawnShooter(); if(Math.random()<0.08) spawnFlair();
  animUniverseId = requestAnimationFrame(animateUniverse);
}
function startUniverseMode() { if (animUniverseId) { cancelAnimationFrame(animUniverseId); animUniverseId = null; } universeMode = true; visitedUniverseBefore = true; activarAurora(); lastSuperstar = performance.now(); resetUniverseStars(); resetDust(); shooterQueue=[]; flairCloud=[]; ripples=[]; flashStars=[]; animateUniverse(); document.getElementById('back-to-cards-btn').style.display = 'block'; if(giftsUnlocked.length > 0 || universeTouchCount > 0) document.getElementById('open-gifts-btn').style.display = 'flex'; }
function stopUniverseMode() { universeMode = false; if (animUniverseId) {cancelAnimationFrame(animUniverseId); animUniverseId = null;} desactivarAurora(); }

const startDate = new Date("2025-11-07T06:53:00"); 
function updateCounter() {
    const now = new Date(); const diff = now - startDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24)); const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)); const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    const text = `Llevamos ${days} días, ${hours} horas, ${minutes} minutos y ${seconds} segundos juntos :)`;
    const counterElem = document.getElementById('counter-text'); if(counterElem) counterElem.innerText = text;
    const totalMinutesExact = diff / (1000 * 60); const heartbeats = Math.floor(totalMinutesExact * 80); 
    const heartbeatElem = document.getElementById('heartbeat-text'); if(heartbeatElem) heartbeatElem.innerText = `Nuestros corazones han latido ${heartbeats.toLocaleString('es-CL')} veces juntos aproximadamente`;
}
setInterval(updateCounter, 1000); updateCounter();

const reasons = [ "Amo tus ojos, me quedaría viendolos por siempre.", "Eres mi paz en medio del caos.", "Me encanta cómo eres mi complemento", "Adoro la forma en que me escuchas.", "Eres la casualidad más bonita de mi vida.", "Amo la forma en que hablamos siempre", "Eres la mejor, te amo mucho", "Me haces querer ser mejor cada día.", "Me das mucha atención aunque no tengas tanto tiempo.", "Sé que me amas.", "Quieres un futuro conmigo.", "Sé que podremos salir adelante.", "Siempre estaremos juntos.", "Entregamos todo de los dos.", "Amo cuando tienes wiwi jashajs", "Eres tan hermosa...", "Amo tus gustos.", "Amo tus pensamientos.", "Amo cómo eres conmigo.", "Te quiero para toda la vida" ];
let availableReasons = [...reasons];
function showReason() {
    const reasonElement = document.getElementById('random-reason'); reasonElement.classList.remove('text-blur-in'); void reasonElement.offsetWidth;
    if (availableReasons.length === 0) availableReasons = [...reasons];
    const randomIndex = Math.floor(Math.random() * availableReasons.length); const selectedReason = availableReasons[randomIndex]; availableReasons.splice(randomIndex, 1);
    reasonElement.innerText = selectedReason; reasonElement.classList.add('text-blur-in');
}
document.addEventListener('click', function(e) { if(e.target.closest('button') || e.target.closest('.modal') || e.target.closest('#music-player-overlay') || e.target.closest('.playlist-item')) return; const heart = document.createElement('div'); heart.innerText = '❤️'; heart.className = 'click-heart'; heart.style.left = e.clientX + 'px'; heart.style.top = e.clientY + 'px'; heart.style.fontSize = (Math.random() * (30 - 15) + 15) + 'px'; document.body.appendChild(heart); setTimeout(() => { heart.remove(); }, 1000); });

document.addEventListener('DOMContentLoaded',()=>{
  document.body.style.webkitTapHighlightColor='transparent'; document.body.style.msTouchAction='manipulation';
  const musicToggle=document.getElementById('music-toggle'),audio=document.getElementById('background-music'),iconPlay=document.getElementById('icon-play'),iconPause=document.getElementById('icon-pause');
  let isPlaying = false; if(audio) audio.volume = 0.55;
  function fadeAudio(target, step=0.05){ if(!audio) return; if(target && audio.volume<0.55) {audio.volume = Math.min(0.55,audio.volume+step); setTimeout(()=>fadeAudio(true,step),30);} else if(!target && audio.volume>0) {audio.volume = Math.max(0,audio.volume-step); setTimeout(()=>fadeAudio(false,step),30);} }
  if(musicToggle){ musicToggle.addEventListener('click',()=>{ if(isPlaying){fadeAudio(false); setTimeout(()=>{audio.pause();},300);iconPlay.style.display='block';iconPause.style.display='none';} else{audio.play().catch(e=>{}); fadeAudio(true);iconPlay.style.display='none';iconPause.style.display='block';} isPlaying=!isPlaying; }); }
  const openModalButtons = document.querySelectorAll('[data-modal-target]'), closeModalButtons = document.querySelectorAll('.modal-close'), modals = document.querySelectorAll('.modal');
  let opened = {}, cartas = ['#modal-1','#modal-2','#modal-3'], finished=false;
  openModalButtons.forEach(button=>{ button.addEventListener('click',()=>{ const modal = document.querySelector(button.dataset.modalTarget); modal.classList.add('is-open'); opened[button.dataset.modalTarget]=true; if(audio && !isPlaying){audio.play().catch(e=>{});fadeAudio(true);isPlaying=true;iconPlay.style.display='none';iconPause.style.display='block';} }); });
  closeModalButtons.forEach(button=>{ button.addEventListener('click',()=>{ const modal = button.closest('.modal'); modal.classList.remove('is-open'); if(!finished){ let all = cartas.every(id=>opened[id]); if(all && !visitedUniverseBefore){ finished=true; document.getElementById('main-wrapper').classList.add('blurred'); setTimeout(()=>{document.getElementById('finalMsg').classList.add('visible');},800); } } }); });
  modals.forEach(modal=>{modal.addEventListener('click',(e)=>{if(e.target===modal)modal.classList.remove('is-open');});});
  document.getElementById('btn-si').onclick = ()=>{ if(typeof requestMotionPermission === 'function') requestMotionPermission(); document.getElementById('main-wrapper').classList.remove('blurred'); document.getElementById('finalMsg').classList.remove('visible'); fadeOverlay.classList.add('active'); setTimeout(()=>{ document.getElementById('main-wrapper').style.display="none"; startUniverseMode(); fadeOverlay.classList.remove('active'); },700); };
  document.getElementById('btn-no').onclick = ()=>{ document.getElementById('main-wrapper').classList.remove('blurred'); document.getElementById('finalMsg').classList.remove('visible'); const btnReturn = document.getElementById('btn-return-stars'); btnReturn.classList.add('visible'); };
});

/* ==========================================
   LÓGICA DEL LIBRO (REPARADA Y FINAL)
   ========================================== */
let currentLocation = 1;
let numOfPapers = 8; // Ajusta esto si agregas más hojas
let maxLocation = numOfPapers + 1;
let bookState = 'peeking';

// Referencias
const book = document.getElementById('valentine-book');
const overlay = document.getElementById('book-overlay');
const papers = [
    document.getElementById('p1'),
    document.getElementById('p2'),
    document.getElementById('p3'),
    document.getElementById('p4'),
    document.getElementById('p5'),
    document.getElementById('p6'),
    document.getElementById('p7'),
    document.getElementById('p8')
];

// 1. INICIALIZAR EL ESCUDO (Para cerrar al dar clic afuera)
if (overlay) {
    overlay.addEventListener('click', cerrarLibro);
}

// 2. DETECTAR CLICS EN EL LIBRO
if (book) {
    book.addEventListener('click', function(e) {
        e.stopPropagation(); // No propagar al fondo

        if (bookState === 'peeking') {
            abrirLibro();
        } else {
            // Lógica para pasar páginas (detecta lado izq o der)
            const rect = book.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            
            // Si clic a la derecha -> Siguiente
            if (clickX > rect.width / 2) {
                goNextPage();
            } 
            // Si clic a la izquierda -> Anterior
            else {
                goPrevPage();
            }
        }
    });
}

function abrirLibro() {
    console.log("Abriendo libro...");
    book.classList.remove('peeking');
    book.classList.add('centered');
    
    // Activar overlay y blur
    if (overlay) overlay.classList.add('active');
    const wrapper = document.getElementById('main-wrapper');
    if (wrapper) wrapper.classList.add('background-blur-active');

    bookState = 'centered';

    // --- AQUÍ ESTÁ EL CAMBIO INTELIGENTE ---
    // Buscamos tu audio original y tu botón de la interfaz
    const existingAudio = document.getElementById('background-music');
    const musicBtn = document.getElementById('music-toggle');

    // Si el audio existe, está pausado y existe el botón...
    if (existingAudio && existingAudio.paused && musicBtn) {
        // ...¡Le damos clic al botón automáticamente! 
        // Esto activa tu función original de Play y cambia el icono a Pausa.
        musicBtn.click();
    }
}

function abrirRegalo() {
    const intro = document.getElementById('intro-screen');
    const book = document.getElementById('valentine-book');
    
    // 1. Agregamos la clase que baja la opacidad a 0 suavemente (tarda 1s según CSS)
    intro.classList.add('fade-out');
    
    // 2. Activamos música inmediatamente al toque
    const musicBtn = document.getElementById('music-toggle');
    const audio = document.getElementById('background-music');
    if (audio && audio.paused && musicBtn) {
        musicBtn.click();
    }
    
    // 3. Esperamos 1 segundo (1000ms) a que termine el desvanecimiento
    setTimeout(() => {
        intro.style.display = 'none'; // Ahora sí lo quitamos del todo
        
        book.style.display = 'block'; // Mostramos el libro
        
        // Animación de entrada del libro
        book.style.animation = 'appearBook 1.5s ease-out forwards';
        
        // Ajustes técnicos
        book.classList.add('open'); 
        resetZIndexes(); 
        abrirLibro(); 
        
    }, 1000); // <-- Coincide con el "transition: opacity 1s" del CSS
}

/* === REEMPLAZA DESDE AQUÍ HASTA EL FINAL DE TU SCRIPT.JS === */

let petalInterval = null; // Variable para controlar la lluvia

function cerrarLibro() {
    // 1. Resetear todas las páginas
    for (let i = 0; i < numOfPapers; i++) {
        papers[i].classList.remove('flipped');
    }
    
    // 2. Reordenar capas
    resetZIndexes();

    book.classList.remove('open');
    book.classList.remove('centered');
    book.classList.add('peeking');
    
    if (overlay) overlay.classList.remove('active');
    
    const wrapper = document.getElementById('main-wrapper');
    if (wrapper) wrapper.classList.remove('background-blur-active');

    // === FIX FLORES: DETENER LA LLUVIA ===
    if (petalInterval) {
        clearInterval(petalInterval);
        petalInterval = null;
    }
    // Borrar las flores que queden en pantalla
    document.querySelectorAll('.petalo').forEach(p => p.remove());

    currentLocation = 1;
    bookState = 'peeking';
}

/* EN JS/SCRIPT.JS */

function goNextPage() {
    if (currentLocation < maxLocation) {
        const paper = papers[currentLocation - 1];
        
        // Reproducir sonido si lo tienes
        if(typeof paperSound !== 'undefined') { paperSound.currentTime = 0; paperSound.play(); }

        paper.classList.add('flipped');

        // AQUÍ ESTABA EL ERROR: El z-index debe cambiar EXACTAMENTE a la mitad de la animación
        // Si en CSS pusimos 1.5s (1500ms), aquí debe ser 750ms.
        setTimeout(() => {
            paper.style.zIndex = currentLocation;
        }, 750); 

        if (currentLocation === 1) {
            book.classList.add('open');
        }
        
        // (Opcional) Si tenías lo de los pétalos en la última hoja
        if (currentLocation === 7 && typeof petalInterval !== 'undefined' && !petalInterval) {
             petalInterval = setInterval(crearPetalo, 300);
        }

        currentLocation++;
    }
}

function goPrevPage() {
    if (currentLocation > 1) {
        const paper = papers[currentLocation - 2];
        const indexDelPapel = currentLocation - 2; // Corrección de índice
        
        if(typeof paperSound !== 'undefined') { paperSound.currentTime = 0; paperSound.play(); }

        paper.classList.remove('flipped');

        // IGUAL AQUÍ: 750ms para que no se vea el corte feo
        setTimeout(() => {
            paper.style.zIndex = numOfPapers - indexDelPapel + 1;
        }, 750);

        if (currentLocation === 2) {
            book.classList.remove('open');
        }

        currentLocation--;
    }
}

/* --- FUNCIÓN PARA CREAR PÉTALOS --- */
function crearPetalo() {
    const petalo = document.createElement('div');
    petalo.classList.add('petalo');
    petalo.style.left = Math.random() * 100 + 'vw';
    petalo.style.animationDuration = Math.random() * 3 + 2 + 's'; 
    petalo.innerText = '🌸'; 
    
    document.body.appendChild(petalo);

    setTimeout(() => { 
        petalo.remove(); 
    }, 5000);
}

/* --- FUNCIÓN ABRIR REGALO CON ANIMACIÓN --- */
function abrirRegalo() {
    const intro = document.getElementById('intro-screen');
    const book = document.getElementById('valentine-book');
    const musicBtn = document.getElementById('music-toggle');
    const audio = document.getElementById('background-music');
    
    // 1. Desvanecer corazón
    if (intro) intro.classList.add('fade-out');
    
    // 2. Activar música
    if (audio && audio.paused && musicBtn) {
        musicBtn.click();
    }
    
    // 3. Esperar a que el corazón se vaya (1 segundo)
    setTimeout(() => {
        if (intro) intro.style.display = 'none'; // Bye corazón
        
        // A. Hacemos que el libro "exista" en el HTML
        book.style.display = 'block'; 
        
        // B. AJUSTE TÉCNICO: Forzamos al navegador a reconocer que el libro está ahí
        // antes de animarlo (esto evita bugs visuales)
        void book.offsetWidth; 
        
        // C. ¡BOOM! Activamos la animación
        book.classList.add('book-appear');
        book.classList.add('open'); // Lo marcamos como abierto
        
        // D. Ajustamos capas lógicas
        resetZIndexes(); 
        abrirLibro(); 
        
    }, 1000); // Tiempo de espera
}

function resetZIndexes() {
    for (let i = 0; i < numOfPapers; i++) {
        papers[i].style.zIndex = numOfPapers - i + 1;
    }
}

resetZIndexes();