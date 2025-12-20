// src/hooks/useUserProfile.tsx
"use client";

import { useState, useEffect } from 'react';

// --- 1. ACTUALIZACIÓN DE LA INTERFAZ ---
// Agregamos los campos nuevos que creaste en la base de datos
// Usamos '?' (opcional) en los campos que pueden ser null
interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
  telefono?: string;
  direccion?: string;
  dni?: string;
  rol: string; // 'admin' | 'user'
}

/**
 * Hook personalizado para obtener los datos del perfil del usuario.
 * Ahora incluye 'reloadProfile' para actualizar los datos manualmente.
 */
export const useUserProfile = () => {
  const [usuario, setUsuario] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Esta función extrae la lógica de carga para poder reusarla
  const fetchPerfil = async () => {
    try {
      // setLoading(true) es opcional aquí dependiendo de si quieres 
      // mostrar el spinner cada vez que recargas silenciosamente.
      // Lo dejaremos para la carga inicial o forzada.
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/perfil`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-store' // Evita caché antigua
        }
      });

      if (!res.ok) {
        throw new Error('No se pudo cargar el perfil del usuario');
      }

      const data = await res.json();
      setUsuario(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    fetchPerfil();
  }, []);

  // --- 2. EXPORTAMOS LA FUNCIÓN DE RECARGA ---
  // Esto permite llamar a 'reloadProfile()' desde la página de perfil
  // después de guardar los cambios para verlos reflejados al instante.
  const reloadProfile = async () => {
    setLoading(true); // Opcional: poner true si quieres bloquear la UI mientras recarga
    await fetchPerfil();
  };

  return { usuario, loading, error, reloadProfile };
};
