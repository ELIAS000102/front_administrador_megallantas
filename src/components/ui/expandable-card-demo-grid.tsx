"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom"; 
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
// Quitamos getAllProducts porque ya no lo usamos aquí, los datos vienen del padre
// import { getAllProducts } from "@/service/productService"; 
import { EditProductForm } from "@/components/products/EditProductForm";
import { IconRuler, IconBox, IconInfoCircle, IconBarcode } from "@tabler/icons-react";

// Interfaces
interface ProductData {
  id: number;
  nombre: string;
  marca: string;
  modelo: string;
  sku: string;
  ancho: number;
  perfil: number;
  aro: number;
  indiceCarga: string;
  indiceVelocidad: string;
  tipoVehiculo: string;
  precio: string | number;
  stock: number;
  imagenUrl: string;
  descripcion: string;
}

interface Card {
  id: number;
  description: string;
  title: string;
  src: string;
  ctaText: string;
  ctaLink: string;
  content: () => React.ReactNode;
  price: number;
  originalData: ProductData;
}

// CORRECCIÓN: Ahora aceptamos 'products' como prop y lo usamos
export function ProductList({ products }: { products: ProductData[] }) {
  const [cards, setCards] = useState<Card[]>([]);
  // loading ahora depende de si hay productos o no, o lo maneja el padre
  const [active, setActive] = useState<Card | boolean | null>(null);
  
  const [mounted, setMounted] = useState(false);

  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // EFECTO DE MAPEO: Se ejecuta cada vez que 'products' cambia (filtros del padre)
  useEffect(() => {
    if (products) {
      const mappedCards = products.map((prod: any) => ({
        id: prod.id,
        title: `${prod.marca} ${prod.modelo}`,
        description: `${prod.ancho}/${prod.perfil} R${prod.aro} ${prod.indiceCarga || ''}${prod.indiceVelocidad || ''}`,
        src: prod.imagenUrl || "https://images.unsplash.com/photo-1578844251758-2f71da645217?auto=format&fit=crop&q=80&w=800",
        ctaText: "Ver Detalles",
        ctaLink: "#",
        price: Number(prod.precio),
        originalData: prod,
        
        content: () => {
          return (
            <div className="pt-4 w-full">
              {/* Encabezado Datos */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 dark:bg-neutral-800/50 p-4 rounded-2xl border border-gray-100 dark:border-neutral-800 mb-6">
                <div className="flex flex-col justify-center p-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Precio de Lista</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-sm font-medium text-gray-500">S/</span>
                        <span className="text-3xl font-extrabold text-neutral-900 dark:text-white">
                            {Number(prod.precio).toFixed(2)}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col justify-center p-2 border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-neutral-700">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Stock Actual</span>
                    <div className={`flex items-center gap-2 font-bold ${prod.stock > 5 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600'}`}>
                        <IconBox size={20} />
                        <span className="text-xl">{prod.stock}</span>
                        <span className="text-xs font-normal text-gray-400 uppercase">Unid.</span>
                    </div>
                </div>
                <div className="flex flex-col justify-center p-2 border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-neutral-700">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">SKU</span>
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                        <IconBarcode size={18} />
                        <span className="font-mono text-sm truncate" title={prod.sku}>{prod.sku}</span>
                    </div>
                </div>
              </div>

              {/* Detalle Técnico */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wide border-b pb-2 border-gray-100 dark:border-neutral-700">
                    <IconRuler size={18} className="text-yellow-500" /> Especificaciones
                  </h5>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-white dark:bg-neutral-800 p-3 rounded-xl border border-gray-100 dark:border-neutral-700 shadow-sm">
                      <span className="block text-[10px] text-gray-400 uppercase mb-1 font-bold">Ancho</span>
                      <span className="text-xl font-bold text-neutral-800 dark:text-white">{prod.ancho}</span>
                      <span className="text-[10px] text-gray-400 block -mt-1">mm</span>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 p-3 rounded-xl border border-gray-100 dark:border-neutral-700 shadow-sm">
                      <span className="block text-[10px] text-gray-400 uppercase mb-1 font-bold">Perfil</span>
                      <span className="text-xl font-bold text-neutral-800 dark:text-white">{prod.perfil}</span>
                      <span className="text-[10px] text-gray-400 block -mt-1">%</span>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-xl border border-yellow-100 dark:border-yellow-900/30 text-center shadow-sm">
                      <span className="block text-[10px] text-yellow-600 dark:text-yellow-500 uppercase mb-1 font-bold">Aro</span>
                      <span className="text-xl font-bold text-neutral-900 dark:text-white">R{prod.aro}</span>
                      <span className="text-[10px] text-yellow-600/70 dark:text-yellow-500/70 block -mt-1">in</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-xl p-3 border border-gray-100 dark:border-neutral-800">
                     <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-neutral-700 text-center">
                         <div className="px-2">
                            <span className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Carga</span>
                            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">{prod.indiceCarga || 'N/A'}</span>
                         </div>
                         <div className="px-2">
                            <span className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Velocidad</span>
                            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">{prod.indiceVelocidad || 'N/A'}</span>
                         </div>
                         <div className="px-2">
                            <span className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Tipo</span>
                            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200 truncate" title={prod.tipoVehiculo}>{prod.tipoVehiculo || 'General'}</span>
                         </div>
                     </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h5 className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wide border-b pb-2 border-gray-100 dark:border-neutral-700">
                    <IconInfoCircle size={18} className="text-blue-500" /> Descripción
                  </h5>
                  <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed text-pretty italic">
                        &quot;{prod.descripcion || "Producto de alta calidad garantizada."}&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        }
      }));
      setCards(mappedCards);
    }
  }, [products]); // <-- Dependencia clave: reacciona cuando el padre filtra

  // Lógica de cierre con ESC
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(false);
    }
    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  // @ts-ignore
  useOutsideClick(ref, () => setActive(null));

  // Estado vacío controlado por props
  if (!products || products.length === 0) {
    return (
        <div className="text-center p-10 text-gray-400 italic border-2 border-dashed border-gray-200 rounded-2xl">
            No se encontraron productos con esos filtros.
        </div>
    );
  }

  return (
    <>
      {mounted && createPortal(
        <>
          <AnimatePresence>
            {active && typeof active === "object" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 h-full w-full z-[60] backdrop-blur-sm"
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {active && typeof active === "object" ? (
              <div className="fixed inset-0 grid place-items-center z-[100] p-4 pointer-events-none">
                <div className="pointer-events-auto relative w-full h-full flex items-center justify-center">
                    <motion.button
                    key={`button-${active.title}-${id}`}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.05 } }}
                    className="flex absolute top-4 right-4 lg:hidden items-center justify-center bg-white rounded-full h-8 w-8 shadow-lg z-50"
                    onClick={() => setActive(null)}
                    >
                    <CloseIcon />
                    </motion.button>
                    
                    <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    ref={ref}
                    className="w-full max-w-[95%] md:max-w-5xl h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden shadow-2xl"
                    >
                    <div className="flex-1 overflow-y-auto relative [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        <div className="flex justify-between items-start p-6 pb-0">
                        <div className="w-full">
                            <motion.h3
                            className="font-bold text-2xl md:text-3xl text-neutral-800 dark:text-neutral-200"
                            >
                            {active.title}
                            </motion.h3>
                            <motion.p
                            className="text-lg text-neutral-500 dark:text-neutral-400 mt-1 font-medium"
                            >
                            {active.description}
                            </motion.p>
                        </div>
                        
                        <div className="shrink-0 ml-4">
                            <EditProductForm 
                                product={active.originalData} 
                                onProductUpdated={() => {
                                    // Como este componente ya no tiene fetch propio, 
                                    // recargamos la página completa para refrescar datos.
                                    window.location.reload();
                                }} 
                            />
                        </div>

                        </div>
                        
                        <div className="px-6 pb-8 pt-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-neutral-600 dark:text-neutral-400 text-sm"
                        >
                            {typeof active.content === "function" ? active.content() : active.content}
                        </motion.div>
                        </div>
                    </div>
                    </motion.div>
                </div>
              </div>
            ) : null}
          </AnimatePresence>
        </>,
        document.body
      )}

      <ul className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.id} 
            onClick={() => setActive(card)}
            className="group p-4 flex flex-col hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-2xl cursor-pointer shadow-sm hover:shadow-md border border-neutral-200 dark:border-neutral-700 transition-all h-full"
          >
            <div className="flex flex-col gap-4 w-full h-full">
              <div className="w-full">
                <img
                  width={200}
                  height={200}
                  src={card.src}
                  alt={card.title}
                  className="h-60 w-full rounded-xl object-cover object-center shadow-sm group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-col items-center justify-center flex-1 text-center">
                <h3 className="font-bold text-neutral-800 dark:text-neutral-200 text-center md:text-left text-base truncate w-full">
                  {card.title}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center md:text-left mt-1 font-medium bg-gray-100 dark:bg-neutral-900 px-2 py-0.5 rounded-md inline-block">
                  {card.description}
                </p>
                <div className="mt-3 text-sm font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full inline-block">
                    S/ {card.price ? card.price.toFixed(2) : '0.00'}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};