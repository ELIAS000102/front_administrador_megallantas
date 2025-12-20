const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getDashboardSummary = async () => {
  try {
    const res = await fetch(`${API_URL}/api/dashboard/resumen`, {
      method: 'GET',
      credentials: 'include', 
      headers: {
        'Cache-Control': 'no-store'
      }
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || 'Error al cargar datos' };
    }
    
    return { success: true, data: data };
  } catch (err) {
    console.error('Error dashboard:', err);
    return { success: false, error: 'Error de conexión' };
  }
};