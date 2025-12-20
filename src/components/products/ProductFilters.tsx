"use client";

import { IconSortDescending, IconSortAscending, IconBox, IconFilter, IconX, IconCar, IconRuler } from "@tabler/icons-react";

export interface FilterState {
  ancho: string;
  perfil: string;
  aro: string;
  tipoVehiculo: string;
  sort: string;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  options: {
    anchos: number[];
    perfiles: number[];
    aros: number[];
    tipos: string[];
  };
}

export function ProductFilters({ filters, onFilterChange, options }: ProductFiltersProps) {
  
  const clearFilter = (key: keyof FilterState) => onFilterChange(key, "");

  // Clases comunes para inputs
  const selectClass = "w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-black focus:border-black block p-2.5 transition-colors appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700";
  const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block";

  return (
    <div className="space-y-8">
      
      {/* SECCIÓN 1: FILTROS TÉCNICOS (GRID 2x2) */}
      <div>
        <h3 className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-neutral-800 pb-2">
          <IconFilter size={16} /> Especificaciones
        </h3>

        <div className="grid grid-cols-2 gap-4">
          
          {/* Ancho */}
          <div className="relative group">
            <label className={labelClass}>Ancho (mm)</label>
            <div className="relative">
                <select 
                    value={filters.ancho}
                    onChange={(e) => onFilterChange("ancho", e.target.value)}
                    className={selectClass}
                >
                    <option value="">Todos</option>
                    {options.anchos.map((val) => (
                        <option key={val} value={val}>{val}</option>
                    ))}
                </select>
                {filters.ancho && <div className="absolute right-2 top-2.5 h-2 w-2 rounded-full bg-blue-500"></div>}
            </div>
          </div>

          {/* Perfil */}
          <div className="relative group">
            <label className={labelClass}>Perfil (%)</label>
            <div className="relative">
                <select 
                    value={filters.perfil}
                    onChange={(e) => onFilterChange("perfil", e.target.value)}
                    className={selectClass}
                >
                    <option value="">Todos</option>
                    {options.perfiles.map((val) => (
                        <option key={val} value={val}>{val}</option>
                    ))}
                </select>
                {filters.perfil && <div className="absolute right-2 top-2.5 h-2 w-2 rounded-full bg-blue-500"></div>}
            </div>
          </div>

          {/* Aro */}
          <div className="relative group">
            <label className={labelClass}>Aro (In)</label>
            <div className="relative">
                <select 
                    value={filters.aro}
                    onChange={(e) => onFilterChange("aro", e.target.value)}
                    className={selectClass}
                >
                    <option value="">Todos</option>
                    {options.aros.map((val) => (
                        <option key={val} value={val}>R{val}</option>
                    ))}
                </select>
                {filters.aro && <div className="absolute right-2 top-2.5 h-2 w-2 rounded-full bg-yellow-500"></div>}
            </div>
          </div>

          {/* Tipo Vehículo */}
          <div className="relative group">
            <label className={labelClass}>Vehículo</label>
            <div className="relative">
                <select 
                    value={filters.tipoVehiculo}
                    onChange={(e) => onFilterChange("tipoVehiculo", e.target.value)}
                    className={selectClass}
                >
                    <option value="">Todos</option>
                    {options.tipos.map((val) => (
                        <option key={val} value={val}>{val}</option>
                    ))}
                </select>
                {filters.tipoVehiculo && <div className="absolute right-2 top-2.5 h-2 w-2 rounded-full bg-green-500"></div>}
            </div>
          </div>

        </div>
        
        {/* Botón para limpiar filtros si hay alguno activo */}
        {(filters.ancho || filters.perfil || filters.aro || filters.tipoVehiculo) && (
            <button 
                onClick={() => {
                    onFilterChange("ancho", "");
                    onFilterChange("perfil", "");
                    onFilterChange("aro", "");
                    onFilterChange("tipoVehiculo", "");
                }}
                className="mt-4 w-full text-xs text-red-500 hover:text-red-700 flex items-center justify-center gap-1 py-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
            >
                <IconX size={12} /> Limpiar Filtros
            </button>
        )}
      </div>

      {/* SECCIÓN 2: ORDENAMIENTO (Diseño Tarjetas Seleccionables) */}
      <div>
        <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-neutral-800 pb-2 flex items-center gap-2">
          <IconSortAscending size={16} /> Ordenar
        </h3>
        
        <div className="space-y-2">
          <SortOption 
            value="newest" 
            label="Más Recientes" 
            active={filters.sort === 'newest'} 
            onClick={() => onFilterChange("sort", "newest")}
          />
          <SortOption 
            value="price-asc" 
            label="Precio: Bajo a Alto" 
            active={filters.sort === 'price-asc'} 
            onClick={() => onFilterChange("sort", "price-asc")}
            icon={<IconSortAscending size={14} />}
          />
          <SortOption 
            value="price-desc" 
            label="Precio: Alto a Bajo" 
            active={filters.sort === 'price-desc'} 
            onClick={() => onFilterChange("sort", "price-desc")}
            icon={<IconSortDescending size={14} />}
          />
          <SortOption 
            value="stock-low" 
            label="Prioridad Stock Bajo" 
            active={filters.sort === 'stock-low'} 
            onClick={() => onFilterChange("sort", "stock-low")}
            icon={<IconBox size={14} className="text-red-500" />}
            colorClass="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900"
          />
        </div>
      </div>
    </div>
  );
}

// Subcomponente para opciones de ordenamiento más limpias
function SortOption({ value, label, active, onClick, icon, colorClass }: any) {
    const baseClass = "w-full flex items-center gap-3 p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer";
    const activeClass = colorClass || "bg-black text-white border-black shadow-md dark:bg-white dark:text-black";
    const inactiveClass = "bg-white text-gray-600 border-gray-100 hover:bg-gray-50 hover:border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 dark:text-gray-400 dark:hover:bg-neutral-700";

    return (
        <div 
            onClick={onClick}
            className={`${baseClass} ${active ? activeClass : inactiveClass}`}
        >
            <div className={`flex items-center justify-center w-5 h-5 rounded-full border ${active ? 'border-current opacity-100' : 'border-gray-300 opacity-50'}`}>
                {active && <div className="w-2.5 h-2.5 rounded-full bg-current" />}
            </div>
            <div className="flex items-center gap-2">
                {icon}
                <span>{label}</span>
            </div>
        </div>
    );
}