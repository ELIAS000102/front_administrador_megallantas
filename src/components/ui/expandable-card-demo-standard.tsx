//src/components/ui/expandable-card-demo-standard.tsx
"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
// 1. IMPORTAMOS EL SERVICIO
import { getAllUsers } from "@/service/authService";

// 2. DEFINIMOS LA ESTRUCTURA DE LA TARJETA
interface Card {
  description: string; 
  title: string;       
  src: string;         
  ctaText: string;
  ctaLink: string;
  content: () => React.ReactNode;
}

export default function ExpandableCardDemo() {
  const [cards, setCards] = useState<Card[]>([]);
  const [active, setActive] = useState<Card | boolean | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  // 4. EFECTO DE CARGA DE DATOS
  useEffect(() => {
    const fetchClients = async () => {
      const response = await getAllUsers();
      
      if (response.success && response.data) {
        const mappedCards: Card[] = response.data.map((user: any) => ({
          title: user.email, 
          description: user.name || "Sin nombre",
          
          src: user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random&color=fff&size=200`,
          
          ctaText: "Ver Perfil",
          ctaLink: "#", 
          
          // --- CONTENIDO EXPANDIDO ---
          content: () => {
            return (
              <div className="w-full p-1">
                <div className="flex items-center justify-between mb-6 border-b border-neutral-100 pb-4 dark:border-neutral-800">
                    <div>
                        <p className="font-bold text-2xl text-neutral-800 dark:text-neutral-200">
                        Detalles del Cliente
                        </p>
                        <p className="text-sm text-neutral-500 mt-1">Información registrada en sistema</p>
                    </div>
                    {/* Badge de Rol */}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${
                        user.rol === 'admin' 
                        ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/30 dark:border-red-900' 
                        : 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:border-blue-900'
                    }`}>
                        {user.rol || "User"}
                    </span>
                </div>
                
                {/* Grilla de información detallada */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow">
                    <span className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Nombre Completo</span>
                    <span className="text-base font-semibold text-neutral-800 dark:text-neutral-100">{user.name || "No registrado"}</span>
                  </div>

                  <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow">
                    <span className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Email de Contacto</span>
                    <span className="text-base font-semibold text-neutral-800 dark:text-neutral-100 truncate block" title={user.email}>{user.email}</span>
                  </div>

                  <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow">
                    <span className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Teléfono</span>
                    <span className="text-base font-semibold text-neutral-800 dark:text-neutral-100">{user.telefono || "No registrado"}</span>
                  </div>

                  <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow">
                    <span className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">DNI / Documento</span>
                    <span className="text-base font-semibold text-neutral-800 dark:text-neutral-100">{user.dni || "No registrado"}</span>
                  </div>

                  <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow col-span-1 md:col-span-2">
                    <span className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Dirección de Envío</span>
                    <span className="text-base font-semibold text-neutral-800 dark:text-neutral-100">{user.direccion || "No registrada"}</span>
                  </div>

                  <div className="flex justify-between items-center bg-gray-50 dark:bg-neutral-900/50 p-3 rounded-lg col-span-1 md:col-span-2 mt-2 border border-dashed border-neutral-200 dark:border-neutral-800">
                    <span className="text-xs text-neutral-500 font-medium">ID Interno:</span>
                    <span className="font-mono text-xs text-neutral-400">#{user.id}</span>
                  </div>

                </div>
              </div>
            );
          },
        }));

        setCards(mappedCards);
      }
    };

    fetchClients();
  }, []); 

  // --- LÓGICA VISUAL ---

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
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

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            
            {/* TARJETA EXPANDIDA */}
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              // FIX: 'h-full md:h-fit md:max-h-[90%]' permite que en PC se ajuste al contenido pero en móvil ocupe todo.
              // 'flex flex-col' es vital para que los hijos se comporten bien.
              className="w-full max-w-[600px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden shadow-2xl"
            >
              
              {/* IMAGEN (Fija arriba, no hace scroll) */}
              <motion.div layoutId={`image-${active.title}-${id}`} className="shrink-0">
                <img
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-60 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-center"
                />
              </motion.div>

              {/* CONTENIDO (Scrollable) */}
              {/* FIX: 'flex-1 overflow-y-auto' hace que ESTE contenedor tome el espacio restante y haga scroll si es necesario */}
              {/* AGREGADO: Clases para ocultar scrollbar manteniendo scroll */}
              <div className="flex-1 overflow-y-auto relative [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex justify-between items-start p-6 pb-2">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-xl text-neutral-800 dark:text-neutral-200"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-base text-neutral-500 dark:text-neutral-400 mt-1"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.a
                    layoutId={`button-${active.title}-${id}`}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-5 py-2 text-sm rounded-full font-bold bg-yellow-500 text-black hover:bg-yellow-600 transition-colors shadow-md"
                  >
                    {active.ctaText}
                  </motion.a>
                </div>
                
                <div className="pt-2 px-6 pb-6 relative">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base dark:text-neutral-400"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-2xl mx-auto w-full gap-4">
        {cards.map((card, index) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={`card-${card.title}-${id}-${index}`} 
            onClick={() => setActive(card)}
            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer border border-transparent hover:border-neutral-100 dark:hover:border-neutral-700 transition-all"
          >
            <div className="flex gap-4 flex-col md:flex-row items-center md:items-start">
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <img
                  width={100}
                  height={100}
                  src={card.src}
                  alt={card.title}
                  className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                />
              </motion.div>
              <div className="flex flex-col items-center md:items-start">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-semibold text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-sm text-neutral-500 dark:text-neutral-400 text-center md:text-left"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>
            <motion.button
              layoutId={`button-${card.title}-${id}`}
              className="px-4 py-2 text-sm rounded-full font-bold bg-gray-50 hover:bg-yellow-500 hover:text-black text-neutral-600 mt-4 md:mt-0 transition-colors"
            >
              {card.ctaText}
            </motion.button>
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
