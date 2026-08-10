// ============================================
// CONFIGURACIÓN FIREBASE - MULTISERVICIOS EL KING
// ============================================

const firebaseConfig = {
    apiKey: "AIzaSyBb5B66MeMC2BgUKaoFQ6hLbppKFzjn0IM",
    authDomain: "multiservicios-elking.firebaseapp.com",
    projectId: "multiservicios-elking",
    storageBucket: "multiservicios-elking.firebasestorage.app",
    messagingSenderId: "966238801484",
    appId: "1:966238801484:web:5fba1938b141f36eee6ee9"
};

// Inicializar Firebase SOLO si no está inicializado ya
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log('✅ Firebase conectado (desde auth.js)');
}

// Crear la variable auth local a este archivo
const auth = firebase.auth();

// ============================================
// CLASE: Controlador de Autenticación
// ============================================

// 1. Función para iniciar sesión (AHORA GLOBAL)
window.iniciarSesion = async function(email, password) {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    console.log("✅ Inicio de sesión exitoso:", user.email);

    // Guardar datos del usuario en sessionStorage
    const userData = {
      email: user.email,
      name: user.displayName || 'Usuario',
      initials: user.displayName ? 
        user.displayName.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2) : 
        user.email.charAt(0).toUpperCase(),
      role: 'Administrador',
      uid: user.uid
    };
    sessionStorage.setItem('user', JSON.stringify(userData));

    // Redirigir a la apertura de caja
    window.location.href = "../app/apertura-caja.html";

  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error.message);
    
    // Mensajes de error amigables
    let mensaje = 'Error al iniciar sesión.';
    switch (error.code) {
      case 'auth/user-not-found':
        mensaje = 'Usuario no encontrado. Verifica tu correo.';
        break;
      case 'auth/wrong-password':
        mensaje = 'Contraseña incorrecta. Intenta nuevamente.';
        break;
      case 'auth/invalid-email':
        mensaje = 'Correo electrónico inválido.';
        break;
      case 'auth/too-many-requests':
        mensaje = 'Demasiados intentos. Espera un momento.';
        break;
      case 'auth/network-request-failed':
        mensaje = 'Error de red. Verifica tu conexión.';
        break;
      default:
        mensaje = error.message;
    }
    
    throw new Error(mensaje);
  }
};

// 2. Función para registrar usuarios (AHORA GLOBAL)
window.registrarUsuario = async function(email, password) {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    console.log("✅ Usuario registrado:", userCredential.user.email);
    return userCredential.user;
  } catch (error) {
    console.error("❌ Error al registrar:", error.message);
    throw error;
  }
};

// 3. Función global para cerrar sesión (YA ERA GLOBAL)
window.cerrarSesion = function() {
  auth.signOut().then(() => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('montoApertura');
    console.log('🔒 Sesión cerrada correctamente');
    window.location.href = '../public/login.html';
  }).catch((error) => {
    console.error('❌ Error al cerrar sesión:', error);
  });
};

// 4. Protección automática de rutas protegidas
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  
  if (path.includes('/app/') || path.includes('apertura-caja.html')) {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        console.warn('⚠️ Acceso no autorizado. Redirigiendo al login...');
        window.location.href = '../public/login.html';
      } else {
        console.log('👤 Sesión activa:', user.email);
        const userData = {
          email: user.email,
          name: user.displayName || 'Usuario',
          initials: user.displayName ? 
            user.displayName.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2) : 
            user.email.charAt(0).toUpperCase(),
          role: 'Administrador',
          uid: user.uid
        };
        sessionStorage.setItem('user', JSON.stringify(userData));
      }
    });
  }
});