// src/service/authService.js

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const handleResponseError = (res, data) => {
  if (res.status === 429) {
    return data.message || 'Has intentado demasiadas veces. Por seguridad, espera 15 minutos.';
  }
  if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors[0].msg;
  }
  return data.error || 'Ocurrió un error inesperado';
};

export const login = async (email, password) => {
  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: handleResponseError(res, data) };
    }
    return { success: true, data: data.usuario };
  } catch (err) {
    console.error('Error login:', err);
    return { success: false, error: 'No se pudo conectar al servidor.' };
  }
};

export const register = async (name, email, password) => {
  try {
    const res = await fetch(`${API_URL}/api/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }), 
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: handleResponseError(res, data) };
    }
    return { success: true, data: data };
  } catch (err) {
    return { success: false, error: 'No se pudo conectar al servidor.' };
  }
};

export const logout = async () => {
  try {
    const res = await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include', 
    });
    if (!res.ok) {
      return { success: false, error: 'Error al cerrar sesión' };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Error de conexión' };
  }
};

/**
 * Sube una nueva foto de perfil.
 * @param {File} file - El archivo de imagen.
 */
export const updateProfilePhoto = async (file) => {
  try {
    const formData = new FormData();
    formData.append('imagen', file);

    const res = await fetch(`${API_URL}/api/usuarios/foto-perfil`, {
      method: 'POST',
      body: formData,
      credentials: 'include', // Necesario para la cookie de sesión
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || 'Error al subir imagen' };
    }

    return { success: true, avatarUrl: data.avatarUrl };

  } catch (err) {
    console.error('Error uploading photo:', err);
    return { success: false, error: 'Error de conexión al subir imagen' };
  }
};

// --- GESTIÓN DE USUARIOS ---

export const getAllUsers = async () => {
  try {
    const res = await fetch(`${API_URL}/api/usuarios/todos`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Cache-Control': 'no-store' 
      }
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Error al obtener usuarios' };
    }
    return { success: true, data: data }; 
  } catch (err) {
    console.error('Error fetching users:', err);
    return { success: false, error: 'Error de conexión al cargar clientes' };
  }
};


