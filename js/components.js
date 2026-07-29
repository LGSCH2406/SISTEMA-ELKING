document.addEventListener('DOMContentLoaded', () => {
  async function loadComponent(elementId, componentName) {
    const el = document.getElementById(elementId);
    if (!el) return;

    // Detecta si el HTML invocador está dentro de la carpeta /app/
    const isInsideApp = window.location.pathname.includes('/app/');
    const basePath = isInsideApp ? '../components/' : './components/';

    try {
      const response = await fetch(basePath + componentName);
      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
      const html = await response.text();
      el.innerHTML = html;
    } catch (err) {
      console.error(`Error cargando el componente ${componentName}:`, err);
    }
  }

  // Cargar componentes
  loadComponent('sidebar-container', 'sidebar-interno.html');
  loadComponent('topbar-container', 'topbar-interno.html');
});