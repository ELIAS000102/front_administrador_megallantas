"use client";

import React, { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "@/service/orderService";
import { IconEye, IconPackage, IconTruck, IconCheck, IconClock, IconX } from "@tabler/icons-react";

export function OrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar pedidos al iniciar
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const result = await getAllOrders();
    if (result.success) {
      setOrders(result.data);
    }
    setLoading(false);
  };

  // Manejar cambio de estado (Select)
  const handleStatusChange = async (id: number, newStatus: string) => {
    // Actualización optimista (cambia en la UI primero)
    const oldOrders = [...orders];
    setOrders(prev => prev.map(o => o.id === id ? { ...o, estado: newStatus } : o));

    const result = await updateOrderStatus(id, newStatus);
    
    if (!result.success) {
      // Si falla, revertimos
      alert("Error al actualizar: " + result.error);
      setOrders(oldOrders);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'pagado': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'enviado': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'entregado': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelado': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500 animate-pulse">Cargando pedidos...</div>;

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-900">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-neutral-800 dark:text-gray-400">
            <tr>
              <th className="px-6 py-4 font-bold"># Pedido</th>
              <th className="px-6 py-4 font-bold">Cliente</th>
              <th className="px-6 py-4 font-bold">Fecha</th>
              <th className="px-6 py-4 font-bold">Total</th>
              <th className="px-6 py-4 font-bold text-center">Estado</th>
              <th className="px-6 py-4 font-bold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
                
                {/* ID */}
                <td className="px-6 py-4 font-mono font-medium text-gray-900 dark:text-white">
                  #{order.id.toString().padStart(4, '0')}
                </td>
                
                {/* Cliente */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 dark:text-white">{order.Usuario?.name || 'Anónimo'}</span>
                    <span className="text-xs text-gray-500">{order.Usuario?.email}</span>
                  </div>
                </td>

                {/* Fecha */}
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                {/* Total */}
                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                  S/ {Number(order.total).toFixed(2)}
                </td>

                {/* Selector de Estado */}
                <td className="px-6 py-4 text-center">
                  <select 
                    value={order.estado}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border cursor-pointer outline-none appearance-none text-center ${getStatusColor(order.estado)}`}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="pagado">Pagado</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </td>

                {/* Botón Detalles */}
                <td className="px-6 py-4 text-center">
                  <button className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg text-gray-600 dark:text-gray-300 transition-colors">
                    <IconEye size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                        No hay pedidos registrados aún.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}