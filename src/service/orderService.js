const API_URL = process.env.NEXT_PUBLIC_API_URL;

const handleResponseError = (res, data) => {
  if (res.status === 401) return 'No autorizado.';
  if (res.status === 403) return 'Acceso denegado.';
  return data.error || data.message || 'Error inesperado';
};

export const getAllOrders = async () => {
  try {
    const res = await fetch(`${API_URL}/api/pedidos`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Cache-Control': 'no-store' }
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: handleResponseError(res, data) };
    return { success: true, data: data };
  } catch (err) {
    return { success: false, error: 'Error de conexión' };
  }
};

export const updateOrderStatus = async (id, estado) => {
  try {
    const res = await fetch(`${API_URL}/api/pedidos/${id}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: handleResponseError(res, data) };
    return { success: true, data: data.pedido };
  } catch (err) {
    return { success: false, error: 'Error al actualizar estado' };
  }
};