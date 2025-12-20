"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderOne } from "@/components/ui/loader";

interface PanelGuardProps {
  children: React.ReactNode;
}

export default function PanelGuard({ children }: PanelGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/perfil`, {
          method: 'GET',
          credentials: 'include', 
          headers: { 'Cache-Control': 'no-store' }
        });

        if (res.ok) {
          // 1. LEEMOS LOS DATOS DEL USUARIO
          const userData = await res.json();

          // 2. VERIFICACIÓN DE ROL (El Muro de Fuego)
          if (userData.rol === 'admin') {
            // Si es admin, ¡Pase usted!
            setIsAuthenticated(true);
          } else {
            // Si es cliente ('user'), lo expulsamos inmediatamente.
            console.warn("Acceso denegado: Usuario no es administrador");
            
            // MODIFICACIÓN: Agregamos '?error=unauthorized' a la URL
            // Esto permite que la página de Login detecte la expulsión y muestre una alerta.
            router.replace('/?error=unauthorized'); 
          }
        } else {
          // Si no está logueado (401), simplemente lo mandamos al login
          router.replace('/'); 
        }
      } catch (error) {
        console.error('Error verificando sesión:', error);
        router.replace('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // 1. ESTADO DE CARGA (Bloqueo Total)
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white dark:bg-neutral-900">
        <div className="scale-100">
          <LoaderOne />
        </div>
      </div>
    );
  }

  // 2. SI PASÓ TODAS LAS PRUEBAS (Auth + Admin), RENDERIZA
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // 3. SI NO, RETORNA NULL (Mientras redirige)
  return null;
}