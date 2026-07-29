// js/app.js - CON ANTI-CACHÉ

console.log('🚀 app.js iniciado');

// Función para cargar componentes HTML (CON ANTI-CACHÉ)
async function loadComponent(selector, filePath) {
  try {
    // Agregar timestamp para evitar caché del navegador
    const cacheBuster = `?t=${Date.now()}`;
    const url = filePath + cacheBuster;
    
    console.log(`📥 Cargando: ${url}`);
    const response = await fetch(url, {
      cache: 'no-store', // Forzar a no usar caché
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    console.log(`📊 Estado: ${response.status} ${response.statusText}`);
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    console.log(`📄 HTML recibido: ${html.length} caracteres`);
    
    const element = document.querySelector(selector);
    console.log(`📍 Elemento encontrado:`, element);
    
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

// Determinar tipo de página
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

// Función para resaltar el enlace activo en el sidebar
function highlightActiveLink() {
  const links = document.querySelectorAll('.side-nav a');
  const currentPath = window.location.pathname;
  const currentFile = currentPath.split('/').pop() || 'venta.html';
  
  console.log(`📄 Archivo actual para resaltar: ${currentFile}`);
  console.log(`🔗 Enlaces encontrados: ${links.length}`);
  
  links.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === currentFile) {
      link.classList.add('active');
      console.log(`✅ Enlace activo: ${href}`);
    }
  });
}

// Cargar componentes según página
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
    
    // Cargar SIDEBAR
    const sidebarLoaded = await loadComponent('#sidebar-interno', '../components/sidebar-interno.html');
    console.log('📊 Sidebar cargado:', sidebarLoaded);
    
    // Cargar TOPBAR
    const topbarLoaded = await loadComponent('#topbar-interno', '../components/topbar-interno.html');
    console.log('📊 Topbar cargado:', topbarLoaded);
    
    // Cargar MODAL
    await loadComponent('#modal-formatos', '../components/modal-formatos.html');
    
    // Resaltar el enlace activo (el sidebar ya está en el DOM)
    setTimeout(() => {
      highlightActiveLink();
    }, 100);
  }
  else if (pageType === 'login') {
    console.log('🔄 Página de login...');
  }
  else if (pageType === 'caja') {
    console.log('🔄 Apertura de caja...');
  }
});

// Función global para modal de formatos
window.toggleFormatos = function(open) {
  const modal = document.getElementById('formatos-modal');
  if (modal) {
    modal.classList.toggle('open', open);
  } else {
    console.warn('⚠️ Modal de formatos no encontrado');
  }
};

// Función global para cerrar sesión
window.cerrarSesion = function() {
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('montoApertura');
};

console.log('✅ Multiservicios El King - App cargada correctamente');