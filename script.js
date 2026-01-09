/* ==========================================
   TURISMO ITATÍ - APP LOGIC V12.0 (FULL)
   ========================================== */

// 1. DATOS (Base + Fallback)
const datosLocales = [
  { 
    "nombre": "Hotel Del Río", "tipo": "hotel", "destacado": true, "estrellas": 5, 
    "lat": -27.273906, "lng": -58.242332, 
    "desc": "Hotel céntrico con piscina y desayuno incluido.", 
    "wp": "5493794000000",
    "imagenes": [
        "https://placehold.co/400x200/F8BBD0/880E4F?text=Hotel+Fachada",
        "https://placehold.co/400x200/F8BBD0/880E4F?text=Habitacion"
    ]
  },
  { 
    "nombre": "Basílica de Itatí", "tipo": "iglesia", "destacado": true, "estrellas": 5, 
    "lat": -27.269210, "lng": -58.243923, 
    "imagenes": ["https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Bas%C3%ADlica_de_Nuestra_Se%C3%B1ora_de_Itat%C3%AD_-_Corrientes.jpg/320px-Bas%C3%ADlica_de_Nuestra_Se%C3%B1ora_de_Itat%C3%AD_-_Corrientes.jpg"], 
    "desc": "Santuario histórico nacional.", 
    "audio": "https://upload.wikimedia.org/wikipedia/commons/7/75/Canto_de_los_pájaros_del_litoral.ogg", 
    "wp": "5493794000000" 
  }
];

const eventosItati = [
    { fecha: "16 de Julio", titulo: "Coronación Pontificia", desc: "Gran festival y procesión náutica." },
    { fecha: "21 de Septiembre", titulo: "Día de la Primavera", desc: "Eventos en la costanera." },
    { fecha: "8 de Diciembre", titulo: "Inmaculada Concepción", desc: "Celebración religiosa mayor." }
];

const datosCombis = [
    {
        empresa: "Combi 'Itatí'", telefono: "5493794123456",
        horarios: { desdeItati: ["05:30", "08:00", "11:00", "14:00", "17:30"], desdeCtes: ["07:00", "10:30", "13:00", "16:00", "19:00"] }
    },
    {
        empresa: "Ramírez Tours", telefono: "5493794987654",
        horarios: { desdeItati: ["06:00", "09:30", "12:30", "15:30"], desdeCtes: ["08:00", "11:30", "14:30", "17:30"] }
    }
];

// Configuración Global
let map, markers, userMarker, routingControl, parkingMarker;
let tileLayer; 
let lugaresItati = []; 
let favoritos = JSON.parse(localStorage.getItem('favs_itati')) || [];

const urlIconos = {
    iglesia: 'https://cdn-icons-png.flaticon.com/512/2236/2236962.png',
    turismo: 'https://cdn-icons-png.flaticon.com/128/8729/8729269.png', 
    comida: 'https://cdn-icons-png.flaticon.com/512/3448/3448609.png',
    parrilla: 'https://cdn-icons-png.flaticon.com/512/1134/1134447.png',
    hotel: 'https://cdn-icons-png.flaticon.com/512/3009/3009489.png',
    hospedaje: 'https://cdn-icons-png.flaticon.com/128/9027/9027521.png',
    camping: 'https://cdn-icons-png.flaticon.com/128/1020/1020535.png',
    salud: 'https://cdn-icons-png.flaticon.com/512/3063/3063176.png',
    farmacia: 'https://cdn-icons-png.flaticon.com/128/4320/4320337.png'
};

/* ==========================================
   2. INICIO
   ========================================== */
async function initApp() {
    initTheme();
    mostrarSkeletons();
    
    // Detector Offline
    window.addEventListener('offline', () => { document.getElementById('offline-indicator').style.display = 'block'; showToast("Sin conexión"); });
    window.addEventListener('online', () => { document.getElementById('offline-indicator').style.display = 'none'; showToast("Conectado", "success"); });

    try {
        const response = await fetch('lugares.json');
        lugaresItati = response.ok ? await response.json() : datosLocales;
    } catch (e) { lugaresItati = datosLocales; }

    initMap();
    iniciarGPS();
    fetchClima();
    
    // Verificar si hay auto guardado
    const autoGuardado = localStorage.getItem('mi_auto_latlng');
    if(autoGuardado) setTimeout(() => dibujarAuto(JSON.parse(autoGuardado)), 2000);

    // Ocultar Splash
    setTimeout(() => {
        const s = document.getElementById('splash-screen');
        if(s) { s.style.opacity = '0'; setTimeout(() => s.remove(), 500); }
    }, 1500);
}

function mostrarSkeletons() {
    const skeletonHTML = `
        <li class="skeleton-li"><div class="skeleton skeleton-img"></div><div style="flex:1"><div class="skeleton skeleton-title"></div><div class="skeleton skeleton-text"></div></div></li>
        <li class="skeleton-li"><div class="skeleton skeleton-img"></div><div style="flex:1"><div class="skeleton skeleton-title"></div><div class="skeleton skeleton-text"></div></div></li>
    `;
    ['lista-turismo', 'lista-gastronomia', 'lista-hospedaje', 'lista-servicios'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.innerHTML = skeletonHTML;
    });
}

/* ==========================================
   3. MAPA Y MARCADORES (CON AUDIO GUÍA)
   ========================================== */
function initMap() {
    map = L.map('map', { zoomControl: false }).setView([-27.269210, -58.243923], 15);
    const isDark = document.body.classList.contains('dark-mode');
    updateMapTiles(isDark);
    markers = L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 40 });
    renderizarMarcadores(lugaresItati);
}

function updateMapTiles(isDark) {
    if (tileLayer) map.removeLayer(tileLayer);
    const urlLight = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    const urlDark = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'; 
    tileLayer = L.tileLayer(isDark ? urlDark : urlLight, { attribution: '© CartoDB', maxZoom: 20 }).addTo(map);
}

function renderizarMarcadores(lista) {
    markers.clearLayers();
    lista.forEach(lugar => {
        let tipo = lugar.tipo;
        if(lugar.nombre.includes("Cabañas")) tipo = 'hospedaje';
        
        let imgs = lugar.imagenes || (lugar.img ? [lugar.img] : []);
        if(imgs.length === 0) imgs = ['https://via.placeholder.com/400x200?text=Sin+Imagen'];
        lugar._imgs = imgs; lugar._imgIndex = 0;

        const esFav = favoritos.includes(lugar.nombre);
        const iconHeart = esFav ? "fas" : "far";
        const colorHeart = esFav ? "#ff4757" : "#fff";

        let controles = '';
        if(imgs.length > 1) {
            controles = `<button class="carrusel-btn carrusel-prev" onclick="cambiarFoto('${lugar.nombre}', -1)"><i class="fas fa-chevron-left"></i></button>
                         <button class="carrusel-btn carrusel-next" onclick="cambiarFoto('${lugar.nombre}', 1)"><i class="fas fa-chevron-right"></i></button>
                         <div class="indicador-fotos" id="ind-${lugar.nombre.replace(/\s/g, '')}">1 / ${imgs.length}</div>`;
        }
        
        // Escape de comillas para el audio
        const textoAudio = lugar.desc ? lugar.desc.replace(/'/g, "\\'") : "Sin descripción";

        const html = `
            <div class="popup-card-pro" id="popup-${lugar.nombre.replace(/\s/g, '')}">
                <div class="popup-header" id="header-${lugar.nombre.replace(/\s/g, '')}" style="background-image: url('${imgs[0]}');">
                    ${controles}
                    <div class="popup-hero-overlay">
                        <h3 style="color:white; margin:0; padding:15px;">${lugar.nombre}</h3>
                    </div>
                    <button class="btn-fav-popup" onclick="toggleFavorito('${lugar.nombre}')">
                        <i class="${iconHeart} fa-heart" style="color:${colorHeart}"></i>
                    </button>
                </div>
                <div class="popup-body">
                    <p>${lugar.desc}</p>
                    <div class="popup-btns">
                        <button onclick="irRutaGPS(${lugar.lat}, ${lugar.lng})" class="btn-pill primary"><i class="fas fa-route"></i> Ir</button>
                        <button onclick="leerDescripcion('${textoAudio}')" class="btn-pill audio"><i class="fas fa-volume-up"></i> Oír</button>
                        <button onclick="compartirLugar('${lugar.nombre}')" class="btn-pill" style="background:var(--color-secundario)"><i class="fas fa-share-alt"></i></button>
                        ${lugar.wp ? `<a href="https://wa.me/${lugar.wp}" target="_blank" class="btn-pill whatsapp"><i class="fab fa-whatsapp"></i></a>` : ''}
                    </div>
                </div>
            </div>`;

        let icon = L.icon({ iconUrl: urlIconos[tipo] || urlIconos.turismo, iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -30] });
        let m = L.marker([lugar.lat, lugar.lng], { icon: icon }).bindPopup(html);
        m.id_nombre = lugar.nombre;
        markers.addLayer(m);
    });
    map.addLayer(markers);
    actualizarListas(lista);
    verificarDeepLink();
}

// --- FUNCIÓN AUDIO GUÍA ---
window.leerDescripcion = function(texto) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); 
        const lectura = new SpeechSynthesisUtterance(texto);
        lectura.lang = 'es-ES'; 
        lectura.rate = 0.9;
        window.speechSynthesis.speak(lectura);
        showToast("🔊 Reproduciendo...");
    } else {
        showToast("Tu celular no soporta audio", "error");
    }
};

window.cambiarFoto = function(nombreLugar, dir) {
    let lugar = lugaresItati.find(l => l.nombre === nombreLugar);
    if(!lugar) return;
    lugar._imgIndex = (lugar._imgIndex || 0) + dir;
    if(lugar._imgIndex < 0) lugar._imgIndex = lugar._imgs.length - 1;
    if(lugar._imgIndex >= lugar._imgs.length) lugar._imgIndex = 0;
    
    let id = nombreLugar.replace(/\s/g, '');
    let header = document.getElementById(`header-${id}`);
    let ind = document.getElementById(`ind-${id}`);
    if(header) header.style.backgroundImage = `url('${lugar._imgs[lugar._imgIndex]}')`;
    if(ind) ind.innerText = `${lugar._imgIndex + 1} / ${lugar._imgs.length}`;
};

/* ==========================================
   4. GESTIÓN DE AUTO / ESTACIONAMIENTO
   ========================================== */
window.gestionarEstacionamiento = function() {
    const guardado = localStorage.getItem('mi_auto_latlng');
    if (guardado) {
        if(confirm("¿Quieres ir a tu vehículo guardado? (Cancelar para borrar y guardar nueva posición)")) {
            const pos = JSON.parse(guardado);
            irRutaGPS(pos.lat, pos.lng);
            showToast("Calculando ruta al vehículo...");
            cerrarMenu();
        } else {
            localStorage.removeItem('mi_auto_latlng');
            if(parkingMarker) map.removeLayer(parkingMarker);
            guardarUbicacionActual();
        }
    } else {
        guardarUbicacionActual();
    }
};

function guardarUbicacionActual() {
    if (!userMarker) { showToast("Espera a tener señal GPS", "error"); return; }
    const latlng = userMarker.getLatLng();
    localStorage.setItem('mi_auto_latlng', JSON.stringify(latlng));
    dibujarAuto(latlng);
    showToast("¡Estacionamiento guardado!", "success");
    cerrarMenu();
}

function dibujarAuto(latlng) {
    if(parkingMarker) map.removeLayer(parkingMarker);
    const iconCar = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png', 
        iconSize: [40, 40], iconAnchor: [20, 20]
    });
    parkingMarker = L.marker(latlng, {icon: iconCar}).addTo(map).bindPopup("🚗 Tu vehículo está aquí");
}

/* ==========================================
   5. RUTA GPS & UTILS
   ========================================== */
window.irRutaGPS = function(destLat, destLng) {
    if (!userMarker) { showToast("Esperando señal GPS...", "error"); return; }
    map.closePopup(); cerrarMenu();
    if (routingControl) map.removeControl(routingControl);
    
    showToast("Calculando ruta...", "info");
    
    routingControl = L.Routing.control({
        waypoints: [ L.latLng(userMarker.getLatLng()), L.latLng(destLat, destLng) ],
        language: 'es', routeWhileDragging: false, showAlternatives: false,
        createMarker: () => null,
        lineOptions: { styles: [{color: '#00897B', opacity: 0.8, weight: 6}] }
    }).addTo(map);

    let btn = document.getElementById('btn-cancelar-ruta');
    if(!btn) {
        btn = document.createElement('button');
        btn.id = 'btn-cancelar-ruta';
        btn.innerHTML = '<i class="fas fa-times"></i> Cancelar Ruta';
        btn.onclick = cancelarRuta;
        document.body.appendChild(btn);
    }
    btn.style.display = 'block';
};

function cancelarRuta() {
    if (routingControl) { map.removeControl(routingControl); routingControl = null; }
    document.getElementById('btn-cancelar-ruta').style.display = 'none';
    map.setView(userMarker.getLatLng(), 16);
}

window.compartirLugar = function(nombre) {
    const url = `${window.location.origin}${window.location.pathname}?lugar=${encodeURIComponent(nombre)}`;
    if (navigator.share) navigator.share({ title: 'Itatí', url: url });
    else { navigator.clipboard.writeText(url); showToast("Link copiado"); }
};

function verificarDeepLink() {
    const params = new URLSearchParams(window.location.search);
    const lugarParam = params.get('lugar');
    if (lugarParam) {
        setTimeout(() => {
            markers.eachLayer(l => {
                if (l.id_nombre === lugarParam) markers.zoomToShowLayer(l, () => l.openPopup());
            });
            window.history.replaceState({}, document.title, window.location.pathname);
        }, 1000);
    }
}

function toggleFavorito(nombre) {
    if(favoritos.includes(nombre)) {
        favoritos = favoritos.filter(f => f !== nombre); showToast("Eliminado de favoritos");
    } else {
        favoritos.push(nombre); showToast("¡Añadido!", "success");
    }
    localStorage.setItem('favs_itati', JSON.stringify(favoritos));
    const activeChip = document.querySelector('.chip.active');
    if(activeChip) filtrarMapa(activeChip.getAttribute('onclick').match(/'([^']+)'/)[1]);
}

function filtrarMapa(cat) {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    const btn = Array.from(document.querySelectorAll('.chip')).find(b => b.getAttribute('onclick').includes(cat));
    if(btn) btn.classList.add('active');

    const grupos = { 'turismo': ['turismo', 'plaza', 'iglesia'], 'gastronomia': ['comida', 'parrilla'], 'hospedaje': ['hotel', 'hospedaje', 'camping'], 'servicios': ['salud', 'farmacia'] };
    
    let filtrados = lugaresItati;
    if (cat === 'favoritos') {
        filtrados = lugaresItati.filter(l => favoritos.includes(l.nombre));
        if(filtrados.length === 0) showToast("Sin favoritos");
        document.getElementById('sidebar').classList.add('activo');
    } else if(cat !== 'todos') {
        filtrados = lugaresItati.filter(l => grupos[cat] && grupos[cat].includes(l.tipo));
        document.getElementById('sidebar').classList.add('activo');
        document.querySelectorAll('.categoria-item').forEach(e => e.classList.remove('open'));
        if(document.getElementById(`cat-${cat}`)) document.getElementById(`cat-${cat}`).classList.add('open');
    }
    renderizarMarcadores(filtrados);
}

function filtrarPorBusqueda() {
    let txt = document.getElementById('buscador-input').value.toLowerCase();
    renderizarMarcadores(lugaresItati.filter(l => l.nombre.toLowerCase().includes(txt)));
}

function actualizarListas(lista) {
    document.querySelectorAll('.lista-lugares').forEach(ul => ul.innerHTML='');
    const catsMap = { turismo: 'lista-turismo', iglesia: 'lista-turismo', comida: 'lista-gastronomia', parrilla: 'lista-gastronomia', hotel: 'lista-hospedaje', hospedaje: 'lista-hospedaje', camping: 'lista-hospedaje', salud: 'lista-servicios', farmacia: 'lista-servicios' };

    lista.forEach(l => {
        let ul = document.getElementById(catsMap[l.tipo] || 'lista-turismo');
        let stars = ''; for(let i=0; i<(l.estrellas||0); i++) stars += '<i class="fas fa-star" style="color:#FFD700; font-size:0.7rem;"></i>';
        const heartClass = favoritos.includes(l.nombre) ? "fas fa-heart" : "far fa-heart";
        const heartColor = favoritos.includes(l.nombre) ? "#ff4757" : "#ccc";

        if(ul) {
            ul.innerHTML += `
            <li class="${l.destacado ? 'destacado-item' : ''}">
                <img src="${urlIconos[l.tipo] || urlIconos.turismo}" class="icono-lista" onerror="this.onerror=null;this.src='https://cdn-icons-png.flaticon.com/512/2236/2236962.png';">
                <div class="info-container" onclick="centrarEnMapa(${l.lat}, ${l.lng})">
                    <span class="nombre-lugar">${l.nombre}</span>
                    <div style="display:flex; gap:5px; align-items:center;">${stars} <span class="meta-info">${l.tipo}</span></div>
                </div>
                <i class="${heartClass}" onclick="event.stopPropagation(); toggleFavorito('${l.nombre}')" style="color:${heartColor}; cursor:pointer; font-size:1.2rem; padding:5px;"></i>
            </li>`;
        }
    });
}

function centrarEnMapa(lat, lng) {
    map.flyTo([lat, lng], 18);
    if(window.innerWidth < 768) cerrarMenu();
    markers.eachLayer(l => { if(l.getLatLng().lat === lat) markers.zoomToShowLayer(l, () => l.openPopup()); });
}

function iniciarGPS() {
    if(navigator.geolocation) {
        navigator.geolocation.watchPosition(pos => {
            let lat = pos.coords.latitude, lng = pos.coords.longitude;
            document.getElementById('estado-gps').innerHTML = `<i class="fas fa-satellite-dish" style="color:#25D366"></i> GPS Activo`;
            if(!userMarker) {
                userMarker = L.marker([lat, lng], {icon: L.divIcon({className:'google-marker-core', html:'<div class="google-marker-pulse"></div>', iconSize:[16,16]})}).addTo(map);
            } else userMarker.setLatLng([lat, lng]);
        }, () => document.getElementById('estado-gps').innerText = "⚠️ GPS Off", { enableHighAccuracy: true });
    }
}

function cargarHorariosCombis() {
    const c = document.getElementById('contenedor-horarios');
    c.innerHTML = datosCombis.map(e => `
        <div class="empresa-card">
            <div class="empresa-header"><h4>${e.empresa}</h4><a href="https://wa.me/${e.telefono}" class="btn-pill whatsapp" style="padding:5px 12px; font-size:0.8rem;"><i class="fab fa-whatsapp"></i></a></div>
            <div class="horarios-grid">
                <div><h5><i class="fas fa-arrow-right" style="color:#ff4757"></i> Salen</h5><div style="display:flex; gap:5px; flex-wrap:wrap;">${e.horarios.desdeItati.map(h=>`<span class="time-badge">${h}</span>`).join('')}</div></div>
                <div><h5><i class="fas fa-arrow-left" style="color:#25D366"></i> Vuelven</h5><div style="display:flex; gap:5px; flex-wrap:wrap;">${e.horarios.desdeCtes.map(h=>`<span class="time-badge">${h}</span>`).join('')}</div></div>
            </div>
        </div>`).join('');
    abrirModal('modal-info');
}

function cargarEventos() {
    document.getElementById('eventos-container').innerHTML = eventosItati.map(ev => `
        <div class="evento-item"><div class="fecha-evento">${ev.fecha}</div><div style="padding-left:15px;"><strong style="color:var(--color-primario)">${ev.titulo}</strong><p style="margin:5px 0 0 0; font-size:0.85rem; color:var(--text-secondary)">${ev.desc}</p></div></div>`).join('');
    abrirModal('modal-eventos');
}

// Helpers
function showToast(m, t='info') {
    const d = document.createElement('div'); d.className = `toast ${t}`; d.innerHTML = m;
    document.getElementById('toast-container').appendChild(d);
    setTimeout(() => { d.style.opacity='0'; setTimeout(()=>d.remove(),300); }, 3000);
}
function fetchClima() {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=-27.27&longitude=-58.24&current_weather=true')
    .then(r=>r.json()).then(d=>document.getElementById('clima-widget').innerHTML = `<i class="fas fa-sun"></i> ${Math.round(d.current_weather.temperature)}°C`).catch(()=>{});
}
function alternarTema() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.getElementById('theme-toggle').innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    updateMapTiles(isDark);
}
function initTheme() { 
    if(localStorage.getItem('theme')==='dark') { 
        document.body.classList.add('dark-mode'); 
        document.getElementById('theme-toggle').innerHTML='<i class="fas fa-sun"></i>'; 
    } 
}
function toggleAcordeon(id) { document.getElementById(id).classList.toggle('open'); }
function cerrarMenu() { document.getElementById('sidebar').classList.remove('activo'); }
document.getElementById('menu-toggle').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('activo'));
function abrirModal(id) { document.getElementById(id).style.display = 'block'; }
function cerrarModal(id) { document.getElementById(id).style.display = 'none'; }
function compartirApp() { if(navigator.share) navigator.share({title:'Turismo Itatí', url:window.location.href}); else {navigator.clipboard.writeText(window.location.href); showToast("Link copiado");} }
function verCercanos() { if(userMarker) { map.flyTo(userMarker.getLatLng(), 16); showToast("Tu ubicación"); } else showToast("Activa tu GPS", "error"); }

let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; document.getElementById('btn-instalar').style.display = 'flex'; });
async function instalarApp() { if(deferredPrompt) { deferredPrompt.prompt(); deferredPrompt = null; } }

function mostrarQR() {
    const urlActual = window.location.href;
    const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(urlActual)}`;
    document.getElementById('qr-image').src = qrApi;
    abrirModal('modal-qr');
}

initApp();