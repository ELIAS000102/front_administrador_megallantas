"use client"; // Indica que este código se ejecuta en el navegador (Client Component)

import { cn } from "@/lib/utils"; // Utilidad para combinar clases de CSS (Tailwind) condicionalmente
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion"; // Librería para las animaciones fluidas
import { IconMenu2, IconX } from "@tabler/icons-react"; // Iconos de menú hamburguesa y cerrar

// --- INTERFACES (Definición de Tipos) ---

// Define la estructura de un enlace: etiqueta (texto), ruta (href) e ícono visual.
interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

// Define qué datos compartirá el contexto del Sidebar con sus hijos.
interface SidebarContextProps {
  open: boolean; // Si está abierto o cerrado
  setOpen: React.Dispatch<React.SetStateAction<boolean>>; // Función para cambiar el estado
  animate: boolean; // Si debe tener animación o ser estático
}

// --- CONTEXTO (Estado Global del Sidebar) ---

// Creamos un contexto para evitar pasar props manualmente a cada nivel (prop drilling).
const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

// Hook personalizado para usar este contexto fácilmente.
// Si intentas usar <SidebarLink> fuera de <Sidebar>, esto lanzará un error.
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

// --- PROVIDER (El cerebro del estado) ---

// Este componente envuelve el Sidebar y gestiona la lógica de "Abierto/Cerrado".
export const SidebarProvider = ({
  children,
  open: openProp, // Permite controlar el estado desde fuera (opcional)
  setOpen: setOpenProp, // Permite pasar la función de control desde fuera (opcional)
  animate = true, // Por defecto, las animaciones están activas
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  // Estado interno por si no se controla desde fuera
  const [openState, setOpenState] = useState(false);

  // Lógica "Controlado vs No Controlado":
  // Si nos pasan 'openProp', usamos ese. Si no, usamos nuestro estado interno 'openState'.
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    // Proveemos los valores a todos los componentes hijos
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

// --- COMPONENTE PRINCIPAL SIDEBAR ---

// Este es el contenedor principal que exportas e importas en tu layout.
export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

// --- CUERPO DEL SIDEBAR (Layout) ---

// Este componente renderiza TANTO la versión de escritorio como la móvil.
// CSS (Tailwind) se encarga de ocultar una y mostrar la otra según el tamaño de pantalla.
export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

// --- VERSIÓN ESCRITORIO ---

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          // Clases base:
          // hidden: Oculto en móviles por defecto.
          // md:flex: Se muestra como flexbox en pantallas medianas o grandes.
          // w-[200px]: Ancho base si no hay animación.
          "h-full px-4 py-4 hidden  md:flex md:flex-col bg-yellow-500 text-black w-[200px] shrink-0",
          className
        )}
        // --- ANIMACIÓN DE ANCHO (Aquí está la magia de la expansión) ---
        animate={{
          // Si 'animate' es true:
          //   Si 'open' es true -> Ancho 230px
          //   Si 'open' es false -> Ancho 70px (colapsado)
          width: animate ? (open ? "230px" : "70px") : "200px",
        }}
        // Eventos del Mouse: Se abre al entrar, se cierra al salir
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

// --- VERSIÓN MÓVIL ---

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          // Clases base:
          // flex: Visible en móviles.
          // md:hidden: Se oculta automáticamente en pantallas de escritorio.
          "h-10 px-4 py-4 flex flex-row md:hidden  items-center justify-between bg-yellow dark:bg-neutral-800 w-full"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          {/* Botón de Hamburguesa para abrir el menú */}
          <IconMenu2
            className="text-neutral-800 dark:text-neutral-200"
            onClick={() => setOpen(!open)}
          />
        </div>

        {/* AnimatePresence permite animar componentes cuando se desmontan del DOM */}
        <AnimatePresence>
          {open && (
            <motion.div
              // Estado inicial: Fuera de la pantalla (izquierda) y transparente
              initial={{ x: "-100%", opacity: 0 }}
              // Estado animado: En su sitio (x: 0) y visible
              animate={{ x: 0, opacity: 1 }}
              // Estado al salir: Se vuelve a ir a la izquierda
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
              className={cn(
                
                "fixed h-full w-full inset-0 bg-yellow-500 dark:bg-neutral-800 p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              {/* Botón de cerrar (X) dentro del menú móvil */}
              <div
                className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200"
                onClick={() => setOpen(!open)}
              >
                <IconX />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

// --- COMPONENTE DE ENLACE INDIVIDUAL ---

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
}) => {
  const { open, animate } = useSidebar();
  return (
    <a
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-2  group/sidebar py-2",
        className
      )}
      {...props}
    >
      {/* Siempre mostramos el icono */}
      {link.icon}

      {/* El texto (label) es lo que animamos */}
      <motion.span
        animate={{
          // Si animate está activo:
          //   Si está abierto -> display: inline-block (visible)
          //   Si está cerrado -> display: none (desaparece del DOM para no ocupar espacio)
          display: animate ? (open ? "inline-block" : "none") : "inline-block",

          // Control de opacidad para el efecto de desvanecimiento (fade-in/fade-out)
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-50 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </a>
  );
};
