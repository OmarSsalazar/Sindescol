/**
 * Wrapper de fetch que incluye automáticamente el token de autenticación
 */
export async function fetchWithAuth(url, options = {}) {
  // Obtener token de localStorage o sessionStorage
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  // Si no hay token, redirigir al login
  if (!token) {
    window.location.href = '/login';
    throw new Error('No hay token de autenticación');
  }

  // Construir URL completa si es relativa
  const fullUrl = url.startsWith('http') ? url : `http://localhost:4000${url}`;

  // Agregar headers de autenticación
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers
    });

    // Si hay error 401, el token expiró o es inválido
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('usuario');
      window.location.href = '/login';
      throw new Error('Sesión expirada');
    }

    return response;
  } catch (error) {
    // Si es un error de red, lanzarlo
    if (error.message === 'Sesión expirada' || error.message === 'No hay token de autenticación') {
      throw error;
    }
    
    // Para otros errores, también lanzarlos
    console.error('Error en fetchWithAuth:', error);
    throw error;
  }
}
