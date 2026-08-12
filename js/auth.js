// js/auth.js - VERSIÓN CORREGIDA (BUSCA POR UID)

console.log('🔐 auth.js iniciado');

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

window.iniciarSesion = async function(email, password) {
  console.log('🔐 Intentando login:', email);
  
  try {
    await esperarFirebase();
    
    const auth = firebase.auth();
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    console.log("✅ Inicio de sesión exitoso:", user.email);
    console.log("🆔 UID del usuario:", user.uid);

    // 🔥 BUSCAR POR UID DIRECTAMENTE
    try {
      const snapshot = await firebase.database().ref('usuarios').child(user.uid).once('value');
      const dbUser = snapshot.val();
      
      console.log('📦 Datos desde Firebase por UID:', dbUser);
      
      let userData = {};
      
      if (dbUser) {
        // 🔥 TOMAR EL NOMBRE DIRECTAMENTE DE FIREBASE
        const nombreReal = dbUser.nombre || dbUser.name || 'Usuario';
        
        userData = {
          email: dbUser.email || user.email,
          name: nombreReal,
          initials: nombreReal ? 
            nombreReal.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2) : 
            (user.email.split('@')[0]?.charAt(0) || 'U').toUpperCase(),
          role: dbUser.rol || 'Administrador',
          telefono: dbUser.telefono || '',
          uid: user.uid,
          estado: dbUser.estado || 'Activo'
        };
        console.log('👤 Datos encontrados en Firebase:', userData);
        console.log('📛 Nombre real desde Firebase:', nombreReal);
      } else {
        // Si no hay datos en DB, usar email como nombre
        const nombreDesdeEmail = email.split('@')[0] || 'Usuario';
        userData = {
          email: user.email,
          name: nombreDesdeEmail,
          initials: nombreDesdeEmail.charAt(0).toUpperCase(),
          role: 'Administrador',
          uid: user.uid
        };
        console.log('👤 Datos básicos (sin DB):', userData);
      }
      
      // 🔥 FORZAR QUE EL NOMBRE SEA EL DE FIREBASE
      if (dbUser && dbUser.nombre) {
        userData.name = dbUser.nombre;
        userData.initials = dbUser.nombre.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
        console.log('🔄 Nombre forzado desde Firebase:', userData.name);
      }
      
      sessionStorage.setItem('user', JSON.stringify(userData));
      console.log('💾 Guardado en sessionStorage:', userData);

    } catch (dbError) {
      console.warn('⚠️ Error al buscar datos en DB:', dbError);
      
      const nombreDesdeEmail = email.split('@')[0] || 'Usuario';
      const fallbackData = {
        email: user.email,
        name: nombreDesdeEmail,
        initials: nombreDesdeEmail.charAt(0).toUpperCase(),
        role: 'Administrador',
        uid: user.uid
      };
      sessionStorage.setItem('user', JSON.stringify(fallbackData));
      console.log('💾 Fallback guardado:', fallbackData);
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