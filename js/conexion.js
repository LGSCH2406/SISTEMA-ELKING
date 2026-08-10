// ==========================================================================
// CONFIGURACIÓN E INICIALIZACIÓN DE FIREBASE - MULTISERVICIOS EL KING
// ==========================================================================

// 🔥 CONFIGURACIÓN ORIGINAL DE MULTISERVICIOS EL KING
const firebaseConfig = {
    apiKey: "AIzaSyBb5B66MeMC2BgUKaoFQ6hLbppKFzjn0IM",
    authDomain: "multiservicios-elking.firebaseapp.com",
    projectId: "multiservicios-elking",
    storageBucket: "multiservicios-elking.firebasestorage.app",
    messagingSenderId: "966238801484",
    appId: "1:966238801484:web:5fba1938b141f36eee6ee9"
};

// 1. Inicializar la aplicación base (solo si no está inicializada)
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log('✅ Firebase inicializado correctamente');
} else if (typeof firebase === 'undefined') {
    console.error('❌ Firebase no está cargado. Verifica que el SDK esté incluido.');
}

// 2. Instanciar Auth y Database
const auth = firebase.auth();
const database = firebase.database();

// 3. Exportar para usar en otros módulos
export { auth, database };

console.log('📌 Proyecto:', firebaseConfig.projectId);
console.log('🔑 Auth:', auth ? 'disponible' : 'no disponible');