"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
// Importamos solo el formulario de Login
import LoginForm from "@/components/auth/LoginForm";
import { IconAlertTriangle, IconX, IconTie } from "@tabler/icons-react";
// Importamos el componente Image de Next.js para optimizar la carga local
import Image from "next/image";

// --- COMPONENTE INTERNO (Lógica) ---
function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [errorNotification, setErrorNotification] = useState<string | null>(null);

  // Detector de errores de redirección (ej: cuando el Guardia te expulsa)
  useEffect(() => {
    const error = searchParams.get('error');
    
    if (error === 'unauthorized') {
      setErrorNotification("Acceso Denegado: Tu cuenta no tiene permisos de Administrador.");
      router.replace('/');
    }
  }, [searchParams, router]);

  return (
    // AUMENTAMOS EL PADDING AQUÍ (px-6 en móvil, md:px-0 en escritorio si se centra, pero mejor un padding seguro siempre)
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6 py-2 md:px-12">
      
      {/* --- FONDO CON IMAGEN LOCAL Y OVERLAY --- */}
      <div className="absolute inset-0 z-0">
        {/* IMPORTANTE: Asegúrate de que tu imagen esté en la carpeta 'public'.
            Si tu archivo está en 'public/imagenes/fondo.jpg', cambia el src a '/imagenes/fondo.jpg'.
        */}
        <Image
          src="/tienda-fondo.jpg" 
          alt="Fondo de taller automotriz"
          fill
          className="object-cover object-center"
          priority // Carga prioritaria para que no parpadee al entrar
          quality={90}
        />
        
        {/* Capa oscura para asegurar legibilidad del texto sobre la imagen */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px] dark:bg-black/70" />
      </div>

      {/* --- NOTIFICACIÓN FLOTANTE (ERROR) --- */}
      {errorNotification && (
        <div className="absolute top-6 z-50 animate-in fade-in slide-in-from-top-5 duration-500 w-full max-w-md px-4">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl shadow-2xl flex items-start gap-3 dark:bg-red-900/90 dark:border-red-800 dark:text-red-100 backdrop-blur-md">
            <IconAlertTriangle size={24} className="shrink-0 mt-0.5 text-red-600 dark:text-red-200" />
            <div className="flex-1">
              <h4 className="font-bold text-sm">¡Acceso Restringido!</h4>
              <p className="text-sm opacity-90 mt-0.5">{errorNotification}</p>
            </div>
            <button 
              onClick={() => setErrorNotification(null)} 
              className="text-red-400 hover:text-red-700 dark:text-red-300 dark:hover:text-white transition-colors"
            >
              <IconX size={20} />
            </button>
          </div>
        </div>
      )}

      {/* --- TARJETA DE LOGIN ÚNICA (Glassmorphism) --- */}
      {/* Agregamos 'mx-auto' y un margen seguro para que nunca toque los bordes */}
      <div className="relative z-10 w-full max-w-lg bg-white/95 dark:bg-black/85 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-neutral-800 animate-in fade-in zoom-in-95 duration-500 mx-auto my-auto">
        
        {/* Cabecera de la Tarjeta */}
        <div className="px-10 pt-12 pb-6 text-center">
            {/* Icono de Marca */}
            <div className="mx-auto mb-6 w-20 h-20 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-400/30 rotate-3 hover:rotate-0 transition-transform duration-300 cursor-default">
               <IconTie size={42} className="text-black" stroke={1.5} />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white mb-2 tracking-tight">
                Megallantas Luana
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium uppercase tracking-wide">
                Panel de Administración
            </p>
        </div>

        {/* Formulario */}
        <div className="px-10 pb-9">
            <LoginForm />
        </div>

        {/* Pie de Tarjeta */}
        <div className="px-8 py-4 bg-gray-50/50 dark:bg-neutral-900/50 border-t border-gray-100 dark:border-neutral-800 text-center">
            <p className="text-xs text-neutral-400 dark:text-neutral-500 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Acceso seguro SSL • Solo personal autorizado
            </p>
        </div>
      </div>

      {/* Footer discreto */}
      <div className="relative z-10 mt-8 text-center text-xs text-white/50 hover:text-white/80 transition-colors cursor-default pb-4">
        &copy; {new Date().getFullYear()} Megallantas Luana. Todos los derechos reservados.
      </div>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL (Wrapper) ---
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-neutral-950 text-white">
        <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
            <div className="animate-pulse font-medium text-sm text-neutral-400">Cargando sistema...</div>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}