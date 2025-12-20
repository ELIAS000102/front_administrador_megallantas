// src/service/productService.js

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Helper para manejar errores de forma consistente
 */
const handleResponseError = (res, data) => {
  if (res.status === 401) return 'No autorizado. Por favor inicia sesión.';
  if (res.status === 403) return 'Acceso denegado. No tienes permisos de administrador.';
  
  if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors[0].msg;
  }
  return data.error || data.message || 'Ocurrió un error inesperado';
};

/**
 * Obtiene el catálogo completo de productos.
 * Acceso: Público (o usuarios logueados)
 */
export const getAllProducts = async () => {
  try {
    const res = await fetch(`${API_URL}/api/productos`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Cache-Control': 'no-store'
      }
    });
    
    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: handleResponseError(res, data) };
    }
    
    return { success: true, data: data };
  } catch (err) {
    console.error('Error fetching products:', err);
    return { success: false, error: 'Error de conexión al cargar productos' };
  }
};

/**
 * Crea un nuevo producto con imagen.
 * Acceso: Solo Admin
 * @param {Object} productData - Objeto con datos (nombre, precio, etc.)
 * @param {File} imageFile - Archivo de imagen (opcional, pero recomendado)
 */
export const createProduct = async (productData, imageFile) => {
  try {
    const formData = new FormData();
    
    // Agregamos todos los campos de texto al FormData
    Object.keys(productData).forEach(key => {
      if (productData[key] !== null && productData[key] !== undefined) {
        formData.append(key, productData[key]);
      }
    });

    // Agregamos la imagen si existe
    // 'imagen' debe coincidir con upload.single('imagen') en el backend
    if (imageFile) {
      formData.append('imagen', imageFile);
    }

    const res = await fetch(`${API_URL}/api/productos`, {
      method: 'POST',
      body: formData, // No lleva Content-Type header, el navegador lo pone automático
      credentials: 'include',
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: handleResponseError(res, data) };
    }

    return { success: true, data: data.producto };

  } catch (err) {
    console.error('Error creating product:', err);
    return { success: false, error: 'Error de conexión al crear producto' };
  }
};

/**
 * Actualiza un producto existente.
 * Acceso: Solo Admin
 * @param {number} id - ID del producto
 * @param {Object} productData - Datos a actualizar
 * @param {File} imageFile - Nueva imagen (opcional)
 */
export const updateProduct = async (id, productData, imageFile) => {
  try {
    const formData = new FormData();
    
    Object.keys(productData).forEach(key => {
        if (productData[key] !== null && productData[key] !== undefined) {
            formData.append(key, productData[key]);
        }
    });

    if (imageFile) {
      formData.append('imagen', imageFile);
    }

    const res = await fetch(`${API_URL}/api/productos/${id}`, {
      method: 'PUT',
      body: formData,
      credentials: 'include',
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: handleResponseError(res, data) };
    }

    return { success: true, data: data.producto };

  } catch (err) {
    return { success: false, error: 'Error de conexión al actualizar' };
  }
};

/**
 * Elimina un producto.
 * Acceso: Solo Admin
 */
export const deleteProduct = async (id) => {
  try {
    const res = await fetch(`${API_URL}/api/productos/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: handleResponseError(res, data) };
    }

    return { success: true, message: 'Producto eliminado' };

  } catch (err) {
    return { success: false, error: 'Error de conexión al eliminar' };
  }
};