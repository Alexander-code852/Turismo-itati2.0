// ==========================================
// 1. BASE DE DATOS (LUGARES DE ITATÍ)
// ==========================================
const lugaresItati = [
    // --- TURISMO Y RELIGIÓN ---
    { 
        nombre: "Basílica Nuestra Señora de Itatí", tipo: "iglesia", 
        lat: -27.269210, lng: -58.243923, 
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Bas%C3%ADlica_de_Nuestra_Se%C3%B1ora_de_Itat%C3%AD_-_Corrientes.jpg/320px-Bas%C3%ADlica_de_Nuestra_Se%C3%B1ora_de_Itat%C3%AD_-_Corrientes.jpg", 
        desc: "Santuario monumental.", wp: "5493794000000" 
    },
    { 
        nombre: "Plaza Bolaños", tipo: "plaza", 
        lat: -27.269265, lng: -58.242503, 
        img: "https://placehold.co/400x200/E8F5E9/2E7D32?text=Plaza", 
        desc: "Plaza principal frente a la Basílica." 
    },
    { 
        nombre: "Costanera", tipo: "turismo", 
        lat: -27.267500, lng: -58.244000, 
        img: "https://placehold.co/400x200/E0F7FA/006064?text=Costanera", 
        desc: "Paseo costero sobre el Río Paraná." 
    },
    { 
        nombre: "Club Naútico", tipo: "nautica", 
        lat: -27.270993, lng: -58.241720, 
        img: "https://placehold.co/400x200/0288D1/FFFFFF?text=Club", 
        desc: "Pesca, lanchas y parrillas.", wp: "5493794999999" 
    },
    // --- NUEVO: GASTRONOMÍA (Para que funcione el filtro) ---
    { 
        nombre: "Comedor El Peregrino", tipo: "comida", 
        lat: -27.268500, lng: -58.243000, 
        img: "https://placehold.co/400x200/FFCCBC/BF360C?text=Comedor", 
        desc: "Platos típicos y minutas para la familia.", wp: "5493794111111" 
    },
    { 
        nombre: "Parrilla Don José", tipo: "parrilla", 
        lat: -27.270100, lng: -58.245000, 
        img: "https://placehold.co/400x200/FFAB91/D84315?text=Asado", 
        desc: "El mejor asado a la estaca de la zona." 
    },
    // --- HOSPEDAJE ---
    { 
        nombre: "Camping Municipal", tipo: "camping", 
        lat: -27.273903, lng: -58.250262, 
        img: "https://placehold.co/400x200/C8E6C9/2E7D32?text=Camping", 
        desc: "Zona de acampe y naturaleza.", wp: "5493794222222" 
    },
    { 
        nombre: "Hotel Del Río", tipo: "hotel", 
        lat: -27.273906, lng: -58.242332, 
        img: "https://placehold.co/400x200/F8BBD0/880E4F?text=Hotel", 
        desc: "Hotel céntrico.", wp: "5493794000000" 
    },
    { 
        nombre: "Cabañas Itatí", tipo: "hospedaje", 
        lat: -27.272786, lng: -58.239136, 
        img: "https://placehold.co/400x200/D7CCC8/4E342E?text=Cabañas", 
        desc: "Cabañas equipadas.", wp: "5493794222222" 
    },
    // --- SERVICIOS ---
    { 
        nombre: "Municipalidad", tipo: "gobierno", 
        lat: -27.269706, lng: -58.241290, 
        desc: "Gobierno local.", wp: "5493794444444" 
    },
    { 
        nombre: "Hospital", tipo: "salud", 
        lat: -27.273954, lng: -58.248380, 
        img: "https://placehold.co/400x200/FFEBEE/C62828?text=Hospital", 
        desc: "Atención médica.", wp: "5493794555555" 
    },
    { 
        nombre: "Farmacia Farmaben", tipo: "farmacia", 
        lat: -27.271770, lng: -58.242972, 
        img: "https://placehold.co/400x200/E0F2F1/00695C?text=Farmacia", 
        desc: "Farmacia de turno.", wp: "5493794666666" 
    }
];

// ==========================================
// 2. CONFIGURACIÓN DEL MAPA
// ==========================================
const latCentro = -27.269210; 
const lngCentro = -58.243923;

const mapaCalle = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { 
    attribution: '© CARTO', maxZoom: 20 
});
const mapaSatelite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { 
    attribution: '© Esri', maxZoom: 19 
});

var map = L.map('map', { 
    zoomControl: false, 
    layers: [mapaCalle] 
}).setView([latCentro, lngCentro], 16); 

L.control.zoom({ position: 'bottomright' }).addTo(map);
L.control.layers({ 
    "🗺️ Calle": mapaCalle, 
    "🛰️ Satélite": mapaSatelite 
}, null, { position: 'bottomright' }).addTo(map);

map.on('click', () => document.getElementById('sidebar').classList.remove('activo'));

// ==========================================
// 3. ICONOS (FLATICON)
// ==========================================
const urlIconos = {
    iglesia: 'https://cdn-icons-png.flaticon.com/512/2236/2236962.png',
    plaza: 'https://cdn-icons-png.flaticon.com/128/2169/2169407.png',
    turismo: 'https://cdn-icons-png.flaticon.com/128/8729/8729269.png', 
    gobierno: 'https://cdn-icons-png.flaticon.com/128/7853/7853433.png',
    nautica: 'https://cdn-icons-png.flaticon.com/128/3003/3003632.png',
    farmacia: 'https://cdn-icons-png.flaticon.com/128/4320/4320337.png',
    escuela: 'https://cdn-icons-png.flaticon.com/128/8074/8074788.png',
    camping: 'https://cdn-icons-png.flaticon.com/128/1020/1020535.png',
    comida: 'https://cdn-icons-png.flaticon.com/512/3448/3448609.png',
    parrilla: 'https://cdn-icons-png.flaticon.com/512/1134/1134447.png',
    hotel: 'https://cdn-icons-png.flaticon.com/512/3009/3009489.png',
    hospedaje: 'https://cdn-icons-png.flaticon.com/128/9027/9027521.png',
    salud: 'https://cdn-icons-png.flaticon.com/512/3063/3063176.png',
};

// ==========================================
// 4. GESTIÓN DE MARCADORES (CON GOOGLE MAPS BTN)
// ==========================================
let marcadoresGlobales = [];

function inicializarMarcadores() {
    lugaresItati.forEach(lugar => {
        let tipoIcono = lugar.tipo;
        if(lugar.nombre.includes("Cabañas")) tipoIcono = 'hospedaje';
        
        let iconHeaderClass = 'fa-map-marker-alt';
        if(tipoIcono === 'hospedaje' || tipoIcono === 'hotel') iconHeaderClass = 'fa-bed';
        if(tipoIcono === 'iglesia') iconHeaderClass = 'fa-church';
        if(tipoIcono === 'comida' || tipoIcono === 'parrilla') iconHeaderClass = 'fa-utensils';

        // MEJORA: Botón Google Maps y onError en imagen
        const popupContent = `
            <div class="popup-card-pro">
                <div class="popup-header"><h3><i class="fas ${iconHeaderClass}"></i> ${lugar.nombre}</h3></div>
                ${lugar.img ? `<img src="${lugar.img}" class="popup-hero-img" onerror="this.src='https://placehold.co/400x200/eee/999?text=Sin+Imagen'">` : ''}
                <div class="popup-body">
                    <p class="popup-desc-pro">${lugar.desc || 'Visita este lugar.'}</p>
                    <div class="popup-btns-pro">
                        <button onclick="trazarRuta(${lugar.lat}, ${lugar.lng})" class="btn-pill btn-ir">
                            <i class="fas fa-route"></i> Ir
                        </button>
                        <a href="https://www.google.com/maps/dir/?api=1&destination=${lugar.lat},${lugar.lng}" target="_blank" class="btn-pill" style="background:#4285F4; margin-left:5px;">
                            <i class="fas fa-location-arrow"></i> GMaps
                        </a>
                    </div>
                     <div style="margin-top:10px; display:flex; gap:5px; justify-content:center;">
                        ${lugar.wp ? `<a href="https://wa.me/${lugar.wp}" target="_blank" class="btn-pill btn-whatsapp" style="padding: 5px 15px; font-size: 0.8em;"><i class="fab fa-whatsapp"></i> Chat</a>` : ''}
                        ${lugar.tel ? `<a href="tel:${lugar.tel}" class="btn-pill" style="background:var(--color-primario); padding: 5px 15px; font-size: 0.8em;">📞 Llamar</a>` : ''}
                    </div>
                </div>
            </div>`;

        let icon = generarIconoPorZoom(tipoIcono, map.getZoom());
        let marker = L.marker([lugar.lat, lugar.lng], { icon: icon }).bindPopup(popupContent);
        marker.addTo(map);
        marcadoresGlobales.push({ marker: marker, data: lugar, tipoIcono: tipoIcono });
    });
}

function generarIconoPorZoom(tipo, zoomActual) {
    let url = urlIconos[tipo] || urlIconos.turismo;
    let size = 30; 

    if (zoomActual < 15) size = 18;       
    else if (zoomActual >= 15 && zoomActual < 17) size = 32; 
    else if (zoomActual >= 17) size = 55; 

    if (tipo === 'iglesia') size += 10;

    return L.icon({ 
        iconUrl: url, 
        iconSize: [size, size], 
        iconAnchor: [size/2, size], 
        popupAnchor: [0, -size],
        shadowUrl: zoomActual < 15 ? '' : 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        shadowSize: [size, size],
        shadowAnchor: [size/3, size] 
    });
}

map.on('zoomend', function() {
    let z = map.getZoom();
    marcadoresGlobales.forEach(i => i.marker.setIcon(generarIconoPorZoom(i.tipoIcono, z)));
});

inicializarMarcadores();

// ==========================================
// 5. INTERFAZ: FILTROS Y BÚSQUEDA
// ==========================================
function toggleAcordeon(id) {
    document.getElementById(id).classList.toggle('open');
}

function filtrarMapa(categoria) {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    document.querySelector(`.chip[data-cat="${categoria}"]`)?.classList.add('active'); // Ojo: necesitas agregar data-cat en HTML o dejarlo como estaba

    const sidebar = document.getElementById('sidebar');
    if(categoria !== 'todos' && window.innerWidth > 768) {
        sidebar.classList.add('activo');
        document.querySelectorAll('.categoria-item').forEach(el => el.classList.remove('open'));
        if(categoria === 'gastronomia') document.getElementById('cat-gastronomia').classList.add('open');
        if(categoria === 'hospedaje') document.getElementById('cat-hospedaje').classList.add('open');
        if(categoria === 'turismo') document.getElementById('cat-turismo').classList.add('open');
        if(categoria === 'servicios') document.getElementById('cat-servicios').classList.add('open');
    }

    const grupos = { 
        'turismo': ['turismo', 'plaza', 'iglesia', 'nautica'], 
        'gastronomia': ['comida', 'parrilla'], 
        'hospedaje': ['hotel', 'hospedaje', 'camping'], 
        'servicios': ['gobierno', 'salud', 'farmacia', 'escuela'] 
    };
    
    let limites = []; 
    marcadoresGlobales.forEach(item => {
        let mostrar = (categoria === 'todos') || (grupos[categoria] && grupos[categoria].includes(item.data.tipo));
        gestionarVisibilidad(item, mostrar);
        if(mostrar) limites.push([item.data.lat, item.data.lng]);
    });
    if (limites.length > 0) map.fitBounds(limites, { padding: [50, 50] });
}

function filtrarPorBusqueda() {
    const txt = document.getElementById('buscador-input').value.toLowerCase();
    let limites = [];
    marcadoresGlobales.forEach(item => {
        const coincide = item.data.nombre.toLowerCase().includes(txt);
        gestionarVisibilidad(item, coincide);
        if(coincide) limites.push([item.data.lat, item.data.lng]);
    });
    if (limites.length > 0 && txt.length > 0) map.fitBounds(limites, { padding: [50, 50] });
}

function verCercanos() {
    if(!userMarker) { alert("⚠️ Activa el GPS."); return; }
    let limites = [];
    marcadoresGlobales.forEach(item => {
        const mostrar = map.distance(userMarker.getLatLng(), [item.data.lat, item.data.lng]) <= 500;
        gestionarVisibilidad(item, mostrar);
        if(mostrar) limites.push([item.data.lat, item.data.lng]);
    });
    if(limites.length > 0) { map.fitBounds(limites, { padding: [50, 50] }); } 
    else alert("Nada cerca (500m).");
}

function gestionarVisibilidad(item, mostrar) {
    if (mostrar) { if (!map.hasLayer(item.marker)) item.marker.addTo(map); } 
    else { if (map.hasLayer(item.marker)) map.removeLayer(item.marker); }
}

async function obtenerClima() {
    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-27.27&longitude=-58.24&current_weather=true');
        const data = await res.json();
        document.getElementById('clima-widget').innerHTML = `${Math.round(data.current_weather.temperature)}°C`;
    } catch (e) {}
}
obtenerClima();

// Modales
function abrirModalInfo() { document.getElementById('modal-info').style.display = 'block'; }
function cerrarModalInfo() { document.getElementById('modal-info').style.display = 'none'; }
window.onclick = function(event) { if (event.target == document.getElementById('modal-info')) cerrarModalInfo(); }

// ==========================================
// 6. GPS Y RUTA ANIMADA (MEJORADA)
// ==========================================
var userIcon = L.divIcon({ 
    className: 'google-marker-container', 
    html: '<div class="google-marker-pulse"></div><div class="google-marker-core"></div>', 
    iconSize: [24, 24], iconAnchor: [12, 12] 
});
var userMarker = null; var userCircle = null; var controlRuta = null;

// --- NUEVA FUNCIÓN: BORRAR RUTA ---
function borrarRuta() {
    if (controlRuta) {
        map.removeControl(controlRuta);
        controlRuta = null;
    }
    // Ocultar botón de borrar
    const btn = document.getElementById('btn-borrar-ruta');
    if(btn) btn.style.display = 'none';
    
    // Opcional: Centrar mapa de nuevo
    map.flyTo([latCentro, lngCentro], 15);
}

function trazarRuta(latDestino, lngDestino) {
    if (!userMarker) { alert("⚠️ Activa GPS primero."); return; }
    
    // Limpiar ruta anterior
    if (controlRuta) map.removeControl(controlRuta);
    
    controlRuta = L.Routing.control({
        waypoints: [userMarker.getLatLng(), L.latLng(latDestino, lngDestino)],
        language: 'es', 
        routeWhileDragging: false, 
        show: false, // Ocultar instrucciones de texto para limpiar la pantalla
        createMarker: () => null, 
        lineOptions: { 
            styles: [
                { color: 'white', opacity: 1, weight: 9 }, 
                { color: '#00897B', opacity: 1, weight: 6 }, 
                { color: 'white', opacity: 0.4, weight: 4, className: 'ruta-animada-overlay' } 
            ] 
        }
    }).addTo(map);
    
    // Cerrar menú y mostrar botón de borrar
    document.getElementById('sidebar').classList.remove('activo');
    const btnBorrar = document.getElementById('btn-borrar-ruta');
    if(btnBorrar) btnBorrar.style.display = 'flex';
}

function iniciarGPS() {
    document.getElementById('estado-gps').innerText = "📡 Buscando...";
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(pos => {
            const lat = pos.coords.latitude; const lng = pos.coords.longitude;
            document.getElementById('estado-gps').innerText = `✅ GPS Activo`;
            document.getElementById('estado-gps').style.color = "#2E7D32"; 
            
            if (!userMarker) {
                userMarker = L.marker([lat, lng], {icon: userIcon}).addTo(map);
                userCircle = L.circle([lat, lng], {radius: pos.coords.accuracy, color: '#4285F4', weight:1, fillOpacity: 0.1}).addTo(map);
                map.flyTo([lat, lng], 16); 
            } else { 
                userMarker.setLatLng([lat, lng]); 
                userCircle.setLatLng([lat, lng]); 
            }
            actualizarListas(lat, lng);
        }, () => { document.getElementById('estado-gps').innerText = "❌ Error GPS"; }, { enableHighAccuracy: true });
    }
}
iniciarGPS();

function actualizarListas(userLat, userLng) {
    const listas = { turismo: document.getElementById('lista-turismo'), gastronomia: document.getElementById('lista-gastronomia'), hospedaje: document.getElementById('lista-hospedaje'), servicios: document.getElementById('lista-servicios') };
    Object.values(listas).forEach(l => l.innerHTML = '');
    lugaresItati.forEach(lugar => {
        let dist = Math.round(map.distance([userLat, userLng], [lugar.lat, lugar.lng]));
        let item = document.createElement('li'); item.onclick = () => trazarRuta(lugar.lat, lugar.lng);
        let urlIcono = urlIconos[lugar.tipo] || urlIconos.turismo;
        if(lugar.nombre.includes("Cabañas")) urlIcono = urlIconos.hospedaje;

        item.innerHTML = `
            <img src="${urlIcono}" class="icono-lista">
            <div class="info-container"><span class="nombre-lugar">${lugar.nombre}</span><span class="meta-info">${lugar.tipo}</span></div>
            <span class="distancia">${dist >= 1000 ? (dist/1000).toFixed(1) + ' km' : dist + ' m'}</span>`;
            
        if (['turismo', 'plaza', 'iglesia', 'nautica'].includes(lugar.tipo)) listas.turismo.appendChild(item);
        else if (['comida', 'parrilla'].includes(lugar.tipo)) listas.gastronomia.appendChild(item);
        else if (['hotel', 'hospedaje', 'camping'].includes(lugar.tipo)) listas.hospedaje.appendChild(item);
        else listas.servicios.appendChild(item);
    });
}

function cerrarMenu() { document.getElementById('sidebar').classList.remove('activo'); }
document.getElementById('menu-toggle').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('activo'));