"use client";

import React from "react";
// Importamos el componente de lista de clientes
import ExpandableCardDemo from "@/components/ui/expandable-card-demo-standard";
import { IconDownload, IconUsers } from "@tabler/icons-react";

export default function ClientesPage() {
  return (
    <div className="flex flex-1 bg-gray-50 dark:bg-neutral-950">
      {/* Contenedor principal con esquinas redondeadas para encajar con el Sidebar */}
      <div className="flex h-full w-full flex-1 flex-col rounded-tl-3xl border-l border-neutral-200 bg-gray-50/50 dark:border-neutral-800 dark:bg-neutral-950 overflow-hidden">
        
        {/* Encabezado Fijo (Sticky Header) */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-neutral-200 bg-white px-8 py-6 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm z-10">
          <div className="flex items-center gap-4">
            {/* Icono con fondo suave */}
            <div className="rounded-xl bg-yellow-500/10 p-3 text-yellow-600 dark:text-yellow-500">
              <IconUsers size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Clientes Registrados
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Visualiza y administra la base de datos de usuarios.
              </p>
            </div>
          </div>
          
          {/* Botón de acción principal */}
          <button className="group flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-neutral-900/20 transition-all hover:bg-neutral-800 hover:shadow-neutral-900/40 active:scale-95 dark:bg-white dark:text-black dark:shadow-white/10 dark:hover:bg-neutral-200">
            <IconDownload size={18} className="transition-transform group-hover:-translate-y-0.5" />
            Exportar CSV
          </button>
        </header>

        {/* Contenido Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
           <div className="mx-auto max-w-7xl pb-10">
              {/* Renderizamos el componente de tarjetas expandibles */}
              <ExpandableCardDemo />
           </div>
        </div>

      </div>
    </div>
  );
}
