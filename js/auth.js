// js/auth.js - VERSIÓN COMPLETA Y CORREGIDA

console.log('🔐 auth.js iniciado');

// ============================================
// ESPERAR A QUE FIREBASE ESTÉ LISTO
// ============================================
function esperarFirebase() {
  return new Promise((resolve) => {
    if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
      resolve();
    } else {
      const interval = setInterval(() => {
        if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    }
  });
}

// ============================================
// FUNCIÓN: INICIAR SESIÓN (GLOBAL)
// ============================================
window.iniciarSesion = async function(email, password) {
  console.log('🔐 Intentando login:', email);
  
  try {
    await esperarFirebase();
    
    const auth = firebase.auth();
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    console.log("✅ Inicio de sesión exitoso:", user.email);

    // Buscar datos adicionales en la base de datos
    try {
      const snapshot = await firebase.database().ref('usuarios').orderByChild('email').equalTo(user.email).once('value');
      const data = snapshot.val();
      
      let userData = {
        email: user.email,
        name: user.displayName || 'Usuario',
        initials: user.displayName ? 
          user.displayName.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2) : 
          user.email.charAt(0).toUpperCase(),
        role: 'Administrador',
        uid: user.uid
      };
      
      if (data) {
        const key = Object.keys(data)[0];
        const dbUser = data[key];
        userData = {
          email: dbUser.email || user.email,
          name: dbUser.nombre || 'Usuario',
          initials: dbUser.nombre ? 
            dbUser.nombre.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2) : 
            user.email.charAt(0).toUpperCase(),
          role: dbUser.rol || 'Administrador',
          telefono: dbUser.telefono || '',
          uid: user.uid,
          estado: dbUser.estado || 'Activo'
        };
      }
      
      sessionStorage.setItem('user', JSON.stringify(userData));
      console.log('👤 Usuario guardado en sessionStorage:', userData);

    } catch (dbError) {
      console.warn('⚠️ Error al buscar datos en DB:', dbError);
      sessionStorage.setItem('user', JSON.stringify({
        email: user.email,
        name: user.displayName || 'Usuario',
        initials: user.displayName ? 
          user.displayName.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2) : 
          user.email.charAt(0).toUpperCase(),
        role: 'Administrador',
        uid: user.uid
      }));
    }

    window.location.href = "../app/apertura-caja.html";

  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error.code, error.message);
    
    let mensaje = 'Error al iniciar sesión.';
    switch (error.code) {
      case 'auth/user-not-found':
        mensaje = '❌ Usuario no encontrado. Verifica tu correo.';
        break;
      case 'auth/wrong-password':
        mensaje = '❌ Contraseña incorrecta. Intenta nuevamente.';
        break;
      case 'auth/invalid-email':
        mensaje = '❌ Correo electrónico inválido.';
        break;
      case 'auth/too-many-requests':
        mensaje = '❌ Demasiados intentos. Espera un momento.';
        break;
      case 'auth/network-request-failed':
        mensaje = '❌ Error de red. Verifica tu conexión.';
        break;
      default:
        mensaje = '❌ ' + error.message;
    }
    
    throw new Error(mensaje);
  }
};

// ============================================
// FUNCIÓN: REGISTRAR USUARIO (GLOBAL)
// ============================================
window.registrarUsuario = async function(email, password) {
  console.log('🔐 Intentando registrar:', email);
  
  try {
    await esperarFirebase();
    const auth = firebase.auth();
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    console.log("✅ Usuario registrado:", userCredential.user.email);
    return userCredential.user;
  } catch (error) {
    console.error("❌ Error al registrar:", error.code, error.message);
    throw error;
  }
};

// ============================================
// FUNCIÓN: CERRAR SESIÓN (GLOBAL)
// ============================================
window.cerrarSesion = function() {
  if (typeof firebase !== 'undefined' && firebase.auth) {
    firebase.auth().signOut().catch(function(error) {
      console.error('❌ Error al cerrar sesión:', error);
    });
  }
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('montoApertura');
  window.location.href = '../public/login.html';
};

// ============================================
// PROTECCIÓN DE RUTAS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const path = window.location.pathname;
  
  if (path.includes('/app/') || path.includes('apertura-caja.html')) {
    const userData = sessionStorage.getItem('user');
    if (!userData) {
      console.warn('⚠️ No hay sesión, redirigiendo...');
      window.location.href = '../public/login.html';
      return;
    }
    
    if (typeof firebase !== 'undefined' && firebase.auth) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
          console.warn('⚠️ No hay sesión en Firebase, redirigiendo...');
          sessionStorage.removeItem('user');
          window.location.href = '../public/login.html';
        }
      });
    }
  }
});

console.log('✅ auth.js cargado correctamente');