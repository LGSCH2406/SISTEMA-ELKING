// ==========================================================================
// CONFIGURACIÓN FIREBASE - MULTISERVICIOS EL KING
// ==========================================================================

const firebaseConfig = {
    apiKey: "AIzaSyBb5B66MeMC2BgUKaoFQ6hLbppKFzjn0IM",
    authDomain: "multiservicios-elking.firebaseapp.com",
    projectId: "multiservicios-elking",
    storageBucket: "multiservicios-elking.firebasestorage.app",
    messagingSenderId: "966238801484",
    appId: "1:966238801484:web:5fba1938b141f36eee6ee9"
};

// Inicializar Firebase
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log('✅ Firebase conectado');
}

// 👇 ESTO ES LO QUE CAMBIAMOS: ASIGNAR A 'window' PARA QUE SEAN GLOBALES
window.auth = firebase.auth();
window.database = firebase.database();
window.storage = firebase.storage();

console.log('✅ Servicios de Firebase listos (auth, database, storage)');