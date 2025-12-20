"use client";
// AGREMMOS EL USEMEMO
import React, { useState, useEffect, useMemo } from "react";
import { 
  IconTrendingUp, 
  IconPackage, 
  IconAlertTriangle, 
  IconUsers,
  IconCurrencySom,
  // [NUEVO] Iconos extra para la interfaz gráfica
  IconChartBar,
  IconArrowUpRight,
  IconChevronRight,
  IconX
} from "@tabler/icons-react";
// Importamos el servicio
import { getDashboardSummary } from "@/service/dashboardService";
//SE AGREGA FRAMER MOTION PARA ANIMACIONES DE LOS CARDS
import { AnimatePresence, motion } from "framer-motion";

interface DashboardData {
  kpis: {
    ingresos: number;
    pedidosActivos: number;
    clientes: number;
    stockCritico: number;
  };
  topProductos: {
    id: number;
    nombre: string;
    vendidos: number;
    imagenUrl: string;
  }[];
   // [NUEVO] Estructura para los gráficos
  graficos: {
    ventasPorMes: { mes: string; total: number }[];
    estadosPedidos: { estado: string; cantidad: number }[];
  };
  // HISTORIA DE USUARIO Sistema de Alertas y Modal de Reposición de Stock
  listas: {
    productosCriticos: any[];
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  // [NUEVO] Estados para interactividad (Historia 2)
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false); // Modal Ingresos
  const [revenueYear, setRevenueYear] = useState(new Date().getFullYear()); // Filtro Año
  const [salesView, setSalesView] = useState<'months' | 'years'>('months'); // Vista
   const [isCriticalStockModalOpen, setIsCriticalStockModalOpen] = useState(false); // Modal de Stock

  // --- HISTORIA DE USUARIO 1: CARGA INICIAL ---
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const result = await getDashboardSummary();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

   // --- [NUEVO] PROCESAMIENTO DE DATOS PARA GRÁFICOS ---
  
  // 1. Convertimos datos SQL a Array de 12 meses según el año seleccionado
  const chartData = useMemo(() => {
    if (!data?.graficos?.ventasPorMes) return Array(12).fill(0);

    const monthlyData = Array(12).fill(0);
    
    data.graficos.ventasPorMes.forEach((item) => {
      // item.mes es "2024-05"
      const [year, month] = item.mes.split('-');
      if (parseInt(year) === revenueYear) {
        // month "05" -> índice 4
        monthlyData[parseInt(month) - 1] = item.total;
      }
    });

    return monthlyData;
  }, [data, revenueYear]);

  // 2. Calculamos datos para la dona de estados
  const pieData = useMemo(() => {
    if (!data?.graficos?.estadosPedidos) return { total: 0 };
    
    const stats = { pendiente: 0, preparado: 0, entregado: 0, total: 0 };
    data.graficos.estadosPedidos.forEach(s => {
       if (s.estado === 'pendiente') stats.pendiente = s.cantidad;
       // Agrupamos 'enviado' y 'preparado' para simplificar visualización
       if (s.estado === 'preparado' || s.estado === 'enviado') stats.preparado += s.cantidad;
       if (s.estado === 'entregado') stats.entregado = s.cantidad;
    });
    stats.total = stats.pendiente + stats.preparado + stats.entregado;
    return stats;
  }, [data]);

  // Maximo para escalar las barras visualmente
  const maxMonthlyRevenue = Math.max(...chartData, 1);
  const totalAnnualRevenue = chartData.reduce((a, b) => a + b, 0);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-50 dark:bg-neutral-950">
         <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-500"></div>
            <p className="text-gray-400 font-medium">Calculando métricas del negocio...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 bg-gray-50 dark:bg-neutral-950 h-full overflow-hidden">
      <div className="flex h-full w-full flex-1 flex-col rounded-tl-3xl border-l border-neutral-200 bg-gray-50/30 dark:border-neutral-800 dark:bg-neutral-950 overflow-y-auto scroll-smooth">
        
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8 pb-20">
          
          {/* Encabezado */}
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Panel de Control
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
              Resumen en tiempo real de operaciones y rendimiento.
            </p>
          </div>

          {/* KPI CARDS (DATOS REALES DEL BACKEND) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* [MODIFICADO] KPI 1: Ingresos ahora es INTERACTIVO */}
            <motion.div 
              whileHover={{ y: -4 }}
              onClick={() => setIsRevenueModalOpen(true)} // Abre el modal
              className="group cursor-pointer p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm hover:shadow-xl hover:border-green-200 dark:hover:border-green-900/50 transition-all relative overflow-hidden"
            >
               <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                    <IconCurrencySom size={28} />
                  </div>
                  <IconArrowUpRight className="text-gray-300 group-hover:text-green-500 transition-colors" />
               </div>
               <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Ingresos Totales</p>
                  <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2 tracking-tight">
                    S/ {(data?.kpis.ingresos || 0).toLocaleString()}
                  </h3>
                  <p className="text-sm text-gray-400 mt-3 font-medium group-hover:text-green-600 transition-colors flex items-center gap-1">
                    Ver desglose anual <IconChevronRight size={14} />
                  </p>
               </div>
            </motion.div>

            {/* KPI 2: Pedidos Activos */}
            <KpiCard 
              title="Pedidos en Proceso" 
              value={data?.kpis.pedidosActivos || 0} 
              icon={<IconPackage size={24} className="text-blue-600 dark:text-blue-400" />}
              color="bg-blue-50 dark:bg-blue-900/20"
            />
            
            {/* KPI 3: Clientes */}
            <KpiCard 
              title="Clientes Registrados" 
              value={data?.kpis.clientes || 0} 
              icon={<IconUsers size={24} className="text-purple-600 dark:text-purple-400" />}
              color="bg-purple-50 dark:bg-purple-900/20"
            />

            {/* KPI 4: Alerta Stock */}
            <motion.div 
              whileHover={{ y: -4 }}
              onClick={() => setIsCriticalStockModalOpen(true)} // ABRIR MODAL
              className="group relative overflow-hidden rounded-2xl bg-red-50 dark:bg-red-900/10 p-6 border border-red-100 dark:border-red-900/30 hover:shadow-xl hover:shadow-red-500/10 transition-all cursor-pointer"
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-red-200/50 dark:bg-red-900/20 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                    <div className="p-3 bg-white dark:bg-red-950 rounded-xl shadow-sm border border-red-100 dark:border-red-900">
                      <IconAlertTriangle size={28} className="text-red-600" />
                    </div>
                    {data?.kpis.stockCritico && data.kpis.stockCritico > 0 ? (
                        <div className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-200 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                            Crítico
                        </div>
                    ) : (
                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">OK</div>
                    )}
                </div>
                
                <div className="mt-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-red-600/80 dark:text-red-400">Inventario Bajo</p>
                  <h3 className="text-4xl font-extrabold text-red-700 dark:text-red-100 mt-1">
                    {data?.kpis.stockCritico} <span className="text-lg">Items</span>
                  </h3>
                  <p className="text-sm text-red-600/70 dark:text-red-300 mt-2 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Ver lista de reposición <IconChevronRight size={16} />
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* --- [NUEVO] SECCIÓN DE GRÁFICOS EN PANTALLA PRINCIPAL --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Gráfico de Ventas (Resumen) */}
            <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-gray-100 dark:border-neutral-800 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h3 className="font-bold text-xl text-neutral-900 dark:text-white">Tendencia de Ventas</h3>
                    <p className="text-sm text-gray-400 mt-1">Rendimiento mensual ({revenueYear})</p>
                </div>
                {/* Selector Año Simple */}
                <div className="flex bg-gray-100 dark:bg-neutral-800 p-1.5 rounded-xl border border-gray-200 dark:border-neutral-700">
                    <select 
                        value={revenueYear}
                        onChange={(e) => setRevenueYear(Number(e.target.value))}
                        className="bg-transparent text-xs font-bold uppercase tracking-wide px-2 outline-none cursor-pointer"
                    >
                        <option value={2025}>2025</option>
                        <option value={2024}>2024</option>
                        <option value={2023}>2023</option>
                    </select>
                </div>
              </div>
              
              <div className="h-64 w-full relative flex items-end justify-between px-2 gap-2">
                {/* Barras dinámicas */}
                {chartData.map((amount, i) => {
                    const heightPercentage = (amount / maxMonthlyRevenue) * 100;
                    return (
                        <MockBar 
                            key={i} 
                            height={heightPercentage > 0 ? `${heightPercentage}%` : '2px'} 
                            label={['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][i]} 
                            value={`S/ ${amount.toLocaleString()}`} 
                            isActive={new Date().getMonth() === i && revenueYear === new Date().getFullYear()} 
                        />
                    );
                })}
              </div>
            </div>

            {/* Gráfico Dona (Estado Pedidos) */}
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-gray-100 dark:border-neutral-800 shadow-sm flex flex-col">
              <h3 className="font-bold text-xl text-neutral-900 dark:text-white mb-8">Estado Actual</h3>
              
              <div className="flex-1 flex items-center justify-center relative my-4">
                 <div className="w-48 h-48 rounded-full bg-[conic-gradient(var(--tw-gradient-stops))] from-yellow-400 via-blue-500 to-green-500 p-8 shadow-inner ring-4 ring-gray-50 dark:ring-neutral-800">
                    <div className="w-full h-full bg-white dark:bg-neutral-900 rounded-full flex items-center justify-center flex-col shadow-sm">
                        <span className="text-3xl font-extrabold text-neutral-800 dark:text-white">
                            {pieData.total}
                        </span>
                        <span className="text-xs text-neutral-400 uppercase font-bold tracking-wider mt-1">Activos</span>
                    </div>
                 </div>
              </div>
              {/* Leyenda simple */}
              <div className="flex justify-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-400"></div> Pend.</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Prep.</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Entr.</span>
              </div>
            </div>
          </div>

          {/* LISTA DE TOP PRODUCTOS (Parte de la Historia 1) */}
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-gray-100 dark:border-neutral-800 shadow-sm">
            <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-6">Productos Más Vendidos</h3>
            <div className="space-y-4">
                {data?.topProductos.map((prod) => (
                    <div key={prod.id} className="flex items-center gap-4 p-2 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-xl transition-colors">
                        <img 
                            src={prod.imagenUrl || "https://images.unsplash.com/photo-1578844251758-2f71da645217?auto=format&fit=crop&q=80&w=200"} 
                            alt={prod.nombre} 
                            className="h-12 w-12 rounded-lg object-cover bg-gray-100" 
                        />
                        <div className="flex-1">
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{prod.nombre}</span>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">{prod.vendidos} v.</span>
                            </div>
                            {/* Barra de progreso visual simple */}
                            <div className="w-full bg-gray-100 dark:bg-neutral-800 rounded-full h-2">
                                <div className="bg-black dark:bg-white h-2 rounded-full" style={{ width: `${Math.min((prod.vendidos / 20) * 100, 100)}%` }}></div>
                            </div>
                        </div>
                    </div>
                ))}
                
                {data?.topProductos.length === 0 && (
                    <p className="text-center text-gray-400 text-sm py-4">No hay datos de ventas aún.</p>
                )}
            </div>
          </div>

        </div>
      </div>
      
      {/* --- MODAL PARA EL STOCK CRITICO --- */}
      <AnimatePresence>
        {isCriticalStockModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-neutral-900 w-full max-w-3xl rounded-3xl p-8 shadow-2xl overflow-hidden relative border border-red-100 dark:border-red-900/30"
                >
                    <button onClick={() => setIsCriticalStockModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                        <IconX size={24} />
                    </button>

                    <div className="mb-6 flex items-start gap-4">
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl">
                            <IconAlertTriangle size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Alerta de Inventario</h2>
                            <p className="text-gray-500">Los siguientes productos tienen stock por debajo del mínimo permitido (5 unidades).</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-2xl overflow-hidden max-h-[50vh] overflow-y-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 dark:bg-neutral-900 text-gray-500 text-xs uppercase tracking-wider sticky top-0">
                                <tr>
                                    <th className="p-4 font-semibold">Producto</th>
                                    <th className="p-4 font-semibold">SKU</th>
                                    <th className="p-4 font-semibold text-center">Stock Actual</th>
                                    <th className="p-4 font-semibold text-center">Estado</th>
                                    <th className="p-4 font-semibold text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                                {data?.listas.productosCriticos.map((prod: any) => (
                                    <tr key={prod.id} className="hover:bg-red-50/30 dark:hover:bg-red-900/10 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img src={prod.imagenUrl || "https://images.unsplash.com/photo-1578844251758-2f71da645217?auto=format&fit=crop&q=80&w=200"} alt={prod.nombre} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                                                <span className="font-medium text-gray-900 dark:text-white">{prod.nombre}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono text-xs text-gray-500">{prod.sku}</td>
                                        <td className="p-4 text-center">
                                            <span className="text-xl font-bold text-red-600">{prod.stock}</span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase">Crítico</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-lg hover:bg-neutral-800 dark:hover:bg-gray-200 transition-colors">
                                                Reponer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {data?.listas.productosCriticos.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-400">
                                            ¡Todo en orden! No hay productos con stock crítico.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>


      {/* --- [NUEVO] MODAL DE INGRESOS DETALLADO --- */}
      <AnimatePresence>
        {isRevenueModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-neutral-900 w-full max-w-5xl rounded-3xl p-8 shadow-2xl overflow-hidden relative"
                >
                     <button onClick={() => setIsRevenueModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors z-20">
                        <IconX size={24} />
                    </button>
                    
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                             <IconCurrencySom className="text-green-500" /> Reporte de Ingresos
                        </h2>
                        <p className="text-gray-500">Desglose detallado de ventas por período fiscal.</p>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-bold uppercase text-gray-500 tracking-wider">Año Fiscal:</label>
                            <select 
                                value={revenueYear} 
                                onChange={(e) => setRevenueYear(Number(e.target.value))}
                                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white focus:ring-black focus:border-black outline-none cursor-pointer hover:bg-gray-100"
                            >
                                <option value={2025}>2025</option>
                                <option value={2024}>2024</option>
                                <option value={2023}>2023</option>
                            </select>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 uppercase">Total Anual</p>
                            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">S/ {totalAnnualRevenue.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Gráfico Detallado en el Modal */}
                    <div className="h-80 w-full bg-gray-50 dark:bg-neutral-800/30 rounded-2xl border border-gray-100 dark:border-neutral-800 p-6 relative flex items-end justify-between gap-3">
                        {chartData.map((amount, i) => {
                            const heightPercentage = (amount / (maxMonthlyRevenue || 1)) * 100;
                            return (
                                <MockBar 
                                    key={i}
                                    height={heightPercentage > 0 ? `${heightPercentage}%` : '2px'}
                                    label={['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                                    value={`S/ ${amount.toLocaleString()}`}
                                    isActive={amount > 0} 
                                />
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Subcomponente simple para KPIs
function KpiCard({ title, value, icon, color }: any) {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{value}</h3>
        </div>
    </div>
  );
}

// HISTORIO DE USUARIO 2 Subcomponente Barra (Igual que en Widgets)
function MockBar({ height, label, isActive, value }: any) {
    return (
        <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end group cursor-pointer">
            <div className={`relative w-full mx-1 bg-gray-100 dark:bg-neutral-800 rounded-t-sm overflow-hidden h-full flex items-end`}>
                <div 
                    style={{ height }} 
                    className={`w-full rounded-t-sm transition-all duration-500 ${isActive ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-neutral-700'} group-hover:bg-green-500`}
                ></div>
                {value && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-lg">
                        {value}
                    </div>
                )}
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase">{label}</span>
        </div>
    )
}