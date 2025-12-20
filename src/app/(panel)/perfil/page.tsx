"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUserProfile } from '@/hooks/useUserProfile';
import * as authService from '@/service/authService';

import { FileUpload } from "@/components/ui/file-upload";
import { 
  IconCamera, IconLogout, IconUser, IconMail, IconId, IconCalendar, IconX,
  IconPhone, IconMapPin, IconIdBadge, IconShieldLock 
} from '@tabler/icons-react';

export default function PerfilPage() {
  const { usuario, loading, error } = useUserProfile();
  const router = useRouter();
  
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const result = await authService.logout();
    if (result.success) {
      router.push('/');
    } else {
      alert(result.error || 'No se pudo cerrar la sesión');
      setIsLoggingOut(false);
    }
  };

  // --- LÓGICA DE SUBIDA ---
  const handleAceternityUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen es muy pesada (Máximo 5MB)");
      return;
    }

    setIsUploading(true);
    setIsModalOpen(false);

    try {
      const result = await authService.updateProfilePhoto(file);

      if (result.success) {
        window.location.reload();
      } else {
        alert(result.error || 'Error al subir la imagen');
      }

    } catch (err) {
      console.error("Error en la vista:", err);
      alert('Error inesperado al intentar subir la foto.');
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return null;

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario?.name || 'Usuario')}&background=random&color=fff&size=200`;

  return (
    <div className="flex flex-1 flex-col h-full bg-gray-50 dark:bg-neutral-900 overflow-y-auto relative">
      
      {/* MODAL DE SUBIDA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
            >
              <IconX size={24} />
            </button>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              Actualizar Foto de Perfil
            </h3>
            
            <div className="w-full border border-dashed bg-gray-50 dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
              <FileUpload onChange={handleAceternityUpload} />
            </div>
            
            <p className="mt-4 text-center text-sm text-gray-500">
              Soporta JPG, PNG (Máx 5MB)
            </p>
          </div>
        </div>
      )}

      {/* PORTADA */}
      <div className="relative h-48 w-full bg-gradient-to-r from-yellow-400 to-orange-500 shrink-0">
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="px-4 md:px-10 pb-20 -mt-20">
        
        {/* CABECERA DE PERFIL: Foto y Nombre */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
          
          {/* Avatar con Botón */}
          <div className="relative group shrink-0">
            <div className="h-40 w-40 rounded-full border-4 border-white bg-white dark:border-neutral-800 shadow-xl overflow-hidden">
              <Image 
                src={usuario?.avatarUrl || defaultAvatar} 
                alt="Foto de perfil"
                width={160}
                height={160}
                unoptimized
                className={`h-full w-full object-cover transition-opacity ${isUploading ? 'opacity-50' : 'opacity-100'}`}
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              )}
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isUploading}
              className="absolute bottom-2 right-2 rounded-full bg-black/70 p-2 text-white hover:bg-black transition-colors shadow-lg cursor-pointer disabled:opacity-50"
              title="Cambiar foto de perfil"
            >
              <IconCamera size={20} />
            </button>
          </div>

          {/* Nombre y Badge */}
          <div className="text-center md:text-left mb-4 md:mb-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white break-words">
              {usuario?.name || 'Usuario'}
            </h2>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-1">
                <span className="text-gray-500 dark:text-gray-400 break-all">{usuario?.email}</span>
                {usuario?.rol === 'admin' && (
                    <span className="bg-red-100 text-red-600 text-xs px-2.5 py-0.5 rounded-full border border-red-200 dark:bg-red-900/30 dark:border-red-900 dark:text-red-400 font-bold uppercase tracking-wide">
                        Admin
                    </span>
                )}
            </div>
          </div>
        </div>

        {/* GRILLA DATOS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* TARJETA 1: Información Personal */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
            <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
              Información de Contacto
            </h3>
            
            <div className="space-y-5">
              
              {/* Nombre */}
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-yellow-100 rounded-xl text-yellow-600 dark:bg-yellow-900/30 shrink-0 mt-0.5">
                  <IconUser size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-0.5">Nombre Completo</p>
                  <p className="font-medium text-gray-900 dark:text-white text-base break-words">{usuario?.name || 'No especificado'}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-blue-100 rounded-xl text-blue-600 dark:bg-blue-900/30 shrink-0 mt-0.5">
                  <IconMail size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-0.5">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white text-base break-all">{usuario?.email}</p>
                </div>
              </div>

              {/* Teléfono */}
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-green-100 rounded-xl text-green-600 dark:bg-green-900/30 shrink-0 mt-0.5">
                  <IconPhone size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-0.5">Teléfono</p>
                  <p className="font-medium text-gray-900 dark:text-white text-base">{usuario?.telefono || 'No registrado'}</p>
                </div>
              </div>

              {/* Dirección */}
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-red-100 rounded-xl text-red-600 dark:bg-red-900/30 shrink-0 mt-0.5">
                  <IconMapPin size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-0.5">Dirección de Envío</p>
                  <p className="font-medium text-gray-900 dark:text-white text-base break-words leading-relaxed">
                    {usuario?.direccion || 'No registrada'}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* TARJETA 2: Detalles de la Cuenta */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 h-fit">
            <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
              Datos del Sistema
            </h3>
            
            <div className="space-y-5">
              
              {/* ID */}
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-purple-100 rounded-xl text-purple-600 dark:bg-purple-900/30 shrink-0 mt-0.5">
                  <IconId size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-0.5">ID de Usuario</p>
                  <p className="font-mono font-medium text-gray-900 dark:text-white text-base">#{usuario?.id}</p>
                </div>
              </div>

              {/* DNI */}
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-orange-100 rounded-xl text-orange-600 dark:bg-orange-900/30 shrink-0 mt-0.5">
                  <IconIdBadge size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-0.5">DNI / Documento</p>
                  <p className="font-medium text-gray-900 dark:text-white text-base">{usuario?.dni || 'No registrado'}</p>
                </div>
              </div>

              {/* Fecha */}
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-teal-100 rounded-xl text-teal-600 dark:bg-teal-900/30 shrink-0 mt-0.5">
                  <IconCalendar size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-0.5">Miembro desde</p>
                  <p className="font-medium text-gray-900 dark:text-white text-base">
                    {usuario?.createdAt ? new Date(usuario.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                  </p>
                </div>
              </div>
              
              {/* Rol */}
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-gray-100 rounded-xl text-gray-600 dark:bg-gray-800 shrink-0 mt-0.5">
                  <IconShieldLock size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-0.5">Tipo de Cuenta</p>
                  <p className="font-medium text-gray-900 dark:text-white text-base capitalize">
                    {usuario?.rol === 'admin' ? 'Administrador del Sistema' : 'Cliente Registrado'}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {error && <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-center border border-red-100">{error}</div>}

        {/* BOTÓN CERRAR SESIÓN */}
        <div className="mt-12 flex justify-center md:justify-start pb-8">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="group flex items-center gap-3 rounded-xl bg-white border border-gray-200 px-8 py-3.5 text-gray-700 font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm hover:shadow-md dark:bg-neutral-800 dark:border-neutral-700 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IconLogout size={20} className="group-hover:stroke-red-600 dark:group-hover:stroke-red-400 transition-colors" />
            {isLoggingOut ? "Cerrando sesión..." : "Cerrar Sesión"}
          </button>
        </div>
      </div>
    </div>
  );
}
