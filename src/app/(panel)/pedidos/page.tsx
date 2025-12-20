"use client";

import React from "react";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { IconClipboardList } from "@tabler/icons-react";

export default function PedidosPage() {
  return (
    <div className="flex flex-1 bg-gray-50 dark:bg-neutral-950 h-full overflow-hidden">
      <div className="flex h-full w-full flex-1 flex-col rounded-tl-3xl border-l border-neutral-200 bg-gray-50/50 dark:border-neutral-800 dark:bg-neutral-950 overflow-hidden">
        
        {/* Encabezado */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-neutral-200 bg-white px-8 py-6 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-purple-500/10 p-3 text-purple-600 dark:text-purple-500">
              <IconClipboardList size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Gestión de Pedidos
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Supervisa el estado de las compras y envíos.
              </p>
            </div>
          </div>
        </header>

        {/* Contenido Principal */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
           <div className="mx-auto max-w-7xl pb-10">
              {/* Aquí renderizamos la tabla de pedidos */}
              <OrdersTable />
           </div>
        </div>

      </div>
    </div>
  );
}