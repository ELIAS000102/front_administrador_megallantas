"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ProductForm } from "@/components/products/ProductForm";
import { ProductList } from "@/components/ui/expandable-card-demo-grid";
import { ProductSearch } from "@/components/products/ProductSearch";
import { ProductFilters, FilterState } from "@/components/products/ProductFilters";
import { getAllProducts } from "@/service/productService";
import { IconPackage, IconSearch } from "@tabler/icons-react";

export default function ProductosPage() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estado Unificado de Filtros
  const [filters, setFilters] = useState<FilterState>({
    ancho: "",
    perfil: "",
    aro: "",
    tipoVehiculo: "",
    sort: "newest"
  });

  // --- 1. CARGA INICIAL ---
  const loadProducts = async () => {
    setLoading(true);
    const result = await getAllProducts();
    if (result.success && result.data) {
      setAllProducts(result.data);
      setFilteredProducts(result.data); 
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // --- 2. EXTRAER OPCIONES DISPONIBLES (Dinámico) ---
  const options = useMemo(() => {
    if (!allProducts.length) return { anchos: [], perfiles: [], aros: [], tipos: [] };

    const anchos = Array.from(new Set(allProducts.map(p => p.ancho))).sort((a, b) => a - b);
    const perfiles = Array.from(new Set(allProducts.map(p => p.perfil))).sort((a, b) => a - b);
    const aros = Array.from(new Set(allProducts.map(p => p.aro))).sort((a, b) => a - b);
    const tipos = Array.from(new Set(allProducts.map(p => p.tipoVehiculo).filter(Boolean))).sort();

    return { anchos, perfiles, aros, tipos };
  }, [allProducts]);


  // --- 3. LÓGICA DE FILTRADO MAESTRA ---
  useEffect(() => {
    let result = [...allProducts];

    // A. Filtrar por Búsqueda (Texto)
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.nombre.toLowerCase().includes(lowerTerm) ||
        p.marca.toLowerCase().includes(lowerTerm) ||
        p.sku.toLowerCase().includes(lowerTerm)
      );
    }

    // B. Filtros Técnicos (Selectores)
    if (filters.ancho) result = result.filter(p => p.ancho === Number(filters.ancho));
    if (filters.perfil) result = result.filter(p => p.perfil === Number(filters.perfil));
    if (filters.aro) result = result.filter(p => p.aro === Number(filters.aro));
    if (filters.tipoVehiculo) result = result.filter(p => p.tipoVehiculo === filters.tipoVehiculo);

    // C. Ordenar
    switch (filters.sort) {
      case "price-asc": result.sort((a, b) => Number(a.precio) - Number(b.precio)); break;
      case "price-desc": result.sort((a, b) => Number(b.precio) - Number(a.precio)); break;
      case "stock-low": result.sort((a, b) => a.stock - b.stock); break;
      case "newest": default: result.sort((a, b) => b.id - a.id); break;
    }

    setFilteredProducts(result);
  }, [searchTerm, filters, allProducts]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-1 bg-gray-50 dark:bg-neutral-950 h-full overflow-hidden">
      <div className="flex h-full w-full flex-1 flex-col rounded-tl-3xl border-l border-neutral-200 bg-gray-50/30 dark:border-neutral-800 dark:bg-neutral-950 overflow-hidden">
        
        {/* Encabezado Fijo */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-neutral-200 bg-white px-8 py-6 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm z-20 shrink-0">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-600 dark:text-blue-500">
              <IconPackage size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Inventario de Productos
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Gestiona el catálogo de llantas y stock disponible.
              </p>
            </div>
          </div>
          
          <ProductForm onProductCreated={loadProducts} />
        </header>

        {/* Contenido Principal */}
        <div className="flex flex-1 overflow-hidden">
            
            {/* SIDEBAR DE FILTROS (IZQUIERDA) */}
            <aside className="w-80 border-r border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-y-auto hidden lg:flex flex-col z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
                
                {/* Barra de Búsqueda Fija en el Sidebar */}
                <div className="p-6 pb-2 sticky top-0 bg-white dark:bg-neutral-900 z-10">
                    <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <IconSearch size={14} /> Búsqueda Rápida
                    </h3>
                    <ProductSearch onSearch={setSearchTerm} />
                </div>

                <div className="px-6 py-2">
                    <div className="h-px w-full bg-gray-100 dark:bg-neutral-800 my-2" />
                </div>
                
                {/* Lista de Filtros Scrollable */}
                <div className="p-6 pt-2 flex-1">
                    <ProductFilters 
                        filters={filters} 
                        onFilterChange={handleFilterChange}
                        options={options} 
                    />
                </div>
            </aside>

            {/* GRID DE PRODUCTOS (DERECHA) */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth bg-gray-50/50 dark:bg-neutral-950/50">
                {/* Mobile Search (Solo visible en móviles) */}
                <div className="lg:hidden mb-6 sticky top-0 z-20 bg-gray-50/95 dark:bg-neutral-950/95 p-2 backdrop-blur-sm -mx-2">
                    <ProductSearch onSearch={setSearchTerm} />
                </div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center h-full text-neutral-400 gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-800 dark:border-white"></div>
                        <p className="text-sm font-medium animate-pulse">Cargando inventario...</p>
                    </div>
                ) : (
                    <div className="pb-20">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                {filteredProducts.length} Resultados
                            </span>
                        </div>
                        <ProductList products={filteredProducts} /> 
                    </div>
                )}
            </main>
        </div>

      </div>
    </div>
  );
}