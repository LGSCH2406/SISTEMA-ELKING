// js/app.js - VERSIÓN CON ACTUALIZACIÓN FORZADA DEL TOPBAR

console.log('🚀 app.js iniciado');

async function loadComponent(selector, filePath) {
  try {
    const cacheBuster = `?t=${Date.now()}`;
    const url = filePath + cacheBuster;
    
    console.log(`📥 Cargando: ${url}`);
    const response = await fetch(url);
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    
    const element = document.querySelector(selector);
    if (element) {
      element.innerHTML = html;
      console.log(`✅ Cargado: ${selector}`);
      return true;
    } else {
      console.warn(`⚠️ Selector no encontrado: ${selector}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error:`, error);
    return false;
  }
}

function getPageType() {
  const path = window.location.pathname;
  console.log('📍 Ruta actual:', path);
  
  if (path.includes('/app/')) {
    return 'interna';
  }
  if (path.includes('/public/')) {
    return 'publica';
  }
  if (path.includes('login.html')) {
    return 'login';
  }
  if (path.includes('apertura-caja.html')) {
    return 'caja';
  }
  return 'publica';
}

function highlightActiveLink() {
  const links = document.querySelectorAll('.side-nav a');
  const currentPath = window.location.pathname;
  const currentFile = currentPath.split('/').pop() || 'venta.html';
  
  links.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === currentFile) {
      link.classList.add('active');
    }
  });
}

// ============================================================
// FUNCIÓN: ACTUALIZAR TOPBAR
// ============================================================
function actualizarTopbar() {
  console.log('🔄 actualizarTopbar() ejecutado');
  
  try {
    const userData = sessionStorage.getItem('user');
    console.log('📦 Datos de sessionStorage:', userData);
    
    if (userData) {
      const user = JSON.parse(userData);
      
      const avatarEl = document.getElementById('avatarInicialTopbar');
      const nombreEl = document.getElementById('nombreTopbar');
      const rolEl = document.getElementById('rolTopbar');
      
      if (avatarEl) avatarEl.textContent = user.initials || 'U';
      if (nombreEl) nombreEl.textContent = user.name || 'Usuario';
      if (rolEl) rolEl.textContent = user.role || 'Usuario';
      
      console.log('✅ Topbar actualizado con:', user.name);
      return true;
    } else {
      console.warn('⚠️ No hay datos de usuario en sessionStorage');
      return false;
    }
  } catch (e) {
    console.error('❌ Error actualizando topbar:', e);
    return false;
  }
}

// ============================================================
// CARGA DE COMPONENTES
// ============================================================

document.addEventListener('DOMContentLoaded', async function() {
  const pageType = getPageType();
  console.log('📄 Tipo de página:', pageType);

  if (pageType === 'publica') {
    console.log('🔄 Cargando componentes públicos...');
    await loadComponent('#header-publico', '../components/header-publico.html');
    await loadComponent('#footer-publico', '../components/footer-publico.html');
  } 
  else if (pageType === 'interna') {
    console.log('🔄 Cargando componentes internos...');
    
    const userData = sessionStorage.getItem('user');
    if (!userData) {
      console.warn('⚠️ No hay sesión, redirigiendo al login...');
      window.location.href = '../public/login.html';
      return;
    }
    
    // Cargar SIDEBAR
    await loadComponent('#sidebar-interno', '../components/sidebar-interno.html');
    
    // Cargar TOPBAR
    await loadComponent('#topbar-interno', '../components/topbar-interno.html');
    
    // Cargar MODAL
    await loadComponent('#modal-formatos', '../components/modal-formatos.html');
    
    // 🔥 ACTUALIZAR TOPBAR DESPUÉS DE CARGARLO
    setTimeout(function() {
      actualizarTopbar();
    }, 200);
    
    // Resaltar enlace activo
    setTimeout(function() {
      highlightActiveLink();
    }, 300);
  }
  else if (pageType === 'login') {
    console.log('🔄 Página de login...');
  }
  else if (pageType === 'caja') {
    console.log('🔄 Apertura de caja...');
  }
});

// ============================================================
// FUNCIONES GLOBALES
// ============================================================

window.toggleFormatos = function(open) {
  const modal = document.getElementById('formatos-modal');
  if (modal) {
    modal.classList.toggle('open', open);
  } else {
    console.warn('⚠️ Modal de formatos no encontrado');
  }
};

// Exponer actualizarTopbar globalmente para que el topbar pueda llamarlo
window.actualizarTopbar = actualizarTopbar;

console.log('✅ Multiservicios El King - App cargada correctamente');