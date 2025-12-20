"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconBrandTabler,
  IconShoppingCart,
  IconUsers,
  IconPackage,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

// 1. IMPORTAMOS EL GUARDIA Y EL HOOK DE USUARIO
import PanelGuard from "@/components/security/withAuth";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 2. OBTENEMOS LOS DATOS DEL USUARIO
  const { usuario } = useUserProfile();
  const [open, setOpen] = useState(false);

  // Calculamos la imagen (Si no hay foto real, usamos UI Avatars con su nombre)
  const userImage = usuario?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario?.name || 'User')}&background=random&color=fff&size=100`;
  
  // Nombres para mostrar (o "Cargando..." si aún no llegan los datos)
  const displayName = usuario?.name || "Cargando...";
  const displayEmail = usuario?.email || "";

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-black" />,
    },
    {
      label: "Productos",
      href: "/productos",
      icon: <IconPackage className="h-5 w-5 shrink-0 text-black" />,
    },
    {
      label: "Pedidos",
      href: "/pedidos",
      icon: <IconShoppingCart className="h-5 w-5 shrink-0 text-black" />,
    },
    {
      label: "Clientes",
      href: "/clientes",
      icon: <IconUsers className="h-5 w-5 shrink-0 text-black" />,
    },
  ];

  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col overflow-hidden bg-yellow-500 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          
          {/* 3. SECCIÓN DE PERFIL PERSONALIZADA */}
          <div>
            <SidebarLink
              link={{
                // A. Usamos un DIV para el label para poner Nombre y Email separados
                label: (
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="text-sm font-semibold text-white dark:text-white leading-none">
                      {displayName}
                    </span>
                    <span className="text-xs text-neutral-600 dark:text-neutral-400 font-normal">
                      {displayEmail}
                    </span>
                  </div>
                ) as any, // 'as any' evita quejas de TypeScript si SidebarLink espera string estricto
                
                href: "/perfil",
                
                // B. Icono: La foto de perfil real
                icon: (
                  <Image
                    src={userImage}
                    className="h-9 w-9 shrink-0 rounded-full object-cover border border-neutral-200"
                    width={50}
                    height={50}
                    alt="Avatar"
                    unoptimized // Para permitir URLs externas sin config extra
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      <main
        className={cn(
          "flex w-full flex-1 flex-col overflow-hidden rounded-tl-2xl rounded-bl-2xl bg-white md:flex-row dark:bg-neutral-800",
          "h-screen"
        )}
      >
        <PanelGuard>{children}</PanelGuard>
      </main>
    </div>
  );
}

// ... (Componentes Logo y LogoIcon siguen igual)
export const Logo = () => {
  return (
    <a
      href="/dashboard"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <Image
        src="/logo-tienda-1.png"
        alt="Logo"
        width={50}
        height={50}
        className="h-12 w-12 object-contain"
        priority
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="whitespace-pre font-medium text-black"
      >
        <Image
          src="/logo-nombre.png"
          alt="Nombre Tienda"
          width={150}
          height={50}
          className="h-8 w-auto object-contain"
          priority
        />
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="/dashboard"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <Image
        src="/logo-tienda-2.png"
        alt="Logo"
        width={32}
        height={32}
        className="h-8 w-8 object-contain"
        priority
      />
    </a>
  );
};