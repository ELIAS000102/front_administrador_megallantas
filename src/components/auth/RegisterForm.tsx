"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as authService from "@/service/authService";
// 1. CAMBIO: Usamos LoaderOne para mantener el mismo diseño que el Login
import { LoaderOne } from "@/components/ui/loader";

const RegisterForm = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    if (e) e.preventDefault();
    
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Llamamos al servicio (que ya maneja los errores complejos del backend)
      const result = await authService.register(name, email, password);

      if (result.success) {
        setSuccess("¡Registro exitoso! Redirigiendo...");
        // Pequeña pausa para que el usuario lea el mensaje antes de recargar
        setTimeout(() => {
          window.location.reload(); 
        }, 2000);
      } else {
        // Aquí se mostrará "Contraseña muy corta" o "Email inválido"
        // gracias a la corrección que hicimos en authService.js
        setError(result.error || "Error desconocido");
      }
    } catch (err) {
      setError("Ocurrió un error inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="name-register"
          className="block text-sm font-medium text-gray-700 dark:text-neutral-300"
        >
          Nombre
        </label>

        <input
          id="name-register"
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
          placeholder="Tu Nombre"
        />
      </div>

      <div>
        <label
          htmlFor="email-register"
          className="block text-sm font-medium text-gray-700 dark:text-neutral-300"
        >
          Email
        </label>

        <input
          id="email-register"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
          placeholder="tu@email.com"
        />
      </div>

      <div>
        <label
          htmlFor="password-register"
          className="block text-sm font-medium text-gray-700 dark:text-neutral-300"
        >
          Contraseña
        </label>

        <input
          id="password-register"
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
          placeholder="••••••••"
        />
      </div>

      {/* Mensajes de estado */}
      {error && <p className="text-sm text-red-600 animate-pulse">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      {/* BOTÓN ESTÁNDAR (Igual que en Login) */}
      <button
        type="submit"
        className="mt-10 w-full flex justify-center rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="scale-75">
            <LoaderOne />
          </div>
        ) : (
          "Registrarse" 
        )}
      </button>
    </form>
  );
};

export default RegisterForm;