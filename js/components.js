// js/components.js

document.addEventListener('DOMContentLoaded', () => {
  async function loadComponent(elementId, componentName) {
    const el = document.getElementById(elementId);
    if (!el) {
      console.warn(`⚠️ Elemento ${elementId} no encontrado`);
      return;
    }

    // Detecta si el HTML invocador está dentro de /app/ o /public/
    const isInsideApp = window.location.pathname.includes('/app/');
    const basePath = isInsideApp ? '../components/' : './components/';

    try {
      const response = await fetch(basePath + componentName);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();
      el.innerHTML = html;
      console.log(`✅ Componente cargado: ${elementId}`);
    } catch (err) {
      console.error(`❌ Error cargando ${componentName}:`, err);
    }
  }

  // Cargar componentes según la página
  const path = window.location.pathname;
  console.log(`📍 Ruta actual: ${path}`);

  if (path.includes('/app/')) {
    // Páginas internas - buscar ambos IDs (por compatibilidad)
    // Primero intentar con los IDs nuevos (sidebar-container, topbar-container)
    // Si no existen, intentar con los IDs viejos (sidebar-interno, topbar-interno)
    
    if (document.getElementById('sidebar-container')) {
      loadComponent('sidebar-container', 'sidebar-interno.html');
    } else if (document.getElementById('sidebar-interno')) {
      loadComponent('sidebar-interno', 'sidebar-interno.html');
    }
    
    if (document.getElementById('topbar-container')) {
      loadComponent('topbar-container', 'topbar-interno.html');
    } else if (document.getElementById('topbar-interno')) {
      loadComponent('topbar-interno', 'topbar-interno.html');
    }
  } else if (path.includes('/public/')) {
    // Páginas públicas
    if (document.getElementById('header-container')) {
      loadComponent('header-container', 'header-publico.html');
    } else if (document.getElementById('header-publico')) {
      loadComponent('header-publico', 'header-publico.html');
    }
    
    if (document.getElementById('footer-container')) {
      loadComponent('footer-container', 'footer-publico.html');
    } else if (document.getElementById('footer-publico')) {
      loadComponent('footer-publico', 'footer-publico.html');
    }
  }
});