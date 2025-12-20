"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as authService from "@/service/authService";
import { LoaderOne } from "@/components/ui/loader";
// Importamos iconos para mejorar la UX visual de los inputs
import { IconMail, IconLock, IconAlertCircle, IconEye, IconEyeOff } from "@tabler/icons-react";

const LoginForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para controlar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await authService.login(email, password);

      if (result.success) {
        console.log("Inicio de sesión exitoso:", result.data);
        router.push("/dashboard");
      } else {
        setError(result.error || "Credenciales incorrectas");
      }
    } catch (err) {
      setError("Error de conexión. Inténtalo de nuevo.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Clases comunes para mantener consistencia
  const inputWrapperClass = "relative group";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-600 transition-colors duration-200";
  // Ajustamos padding derecho (pr-10) para que el texto no choque con el ojo
  const inputClass = "w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 block pl-10 pr-10 p-3 outline-none transition-all duration-200 placeholder:text-gray-400";
  const labelClass = "block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1";

  return (
    <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
      
      {/* Input Email */}
      <div className={inputWrapperClass}>
        <label htmlFor="email-login" className={labelClass}>
          Correo Electrónico
        </label>
        <div className="relative">
            <div className={iconClass}>
                <IconMail size={18} />
            </div>
            <input
            id="email-login"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className={inputClass}
            placeholder="admin@megallantas.com"
            />
        </div>
      </div>

      {/* Input Password */}
      <div className={inputWrapperClass}>
        <label htmlFor="password-login" className={labelClass}>
          Contraseña
        </label>
        <div className="relative">
            <div className={iconClass}>
                <IconLock size={18} />
            </div>
            <input
            id="password-login"
            name="password"
            // Cambiamos dinámicamente el tipo de input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className={inputClass}
            placeholder="••••••••"
            />
            
            {/* Botón para mostrar/ocultar contraseña */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-600 transition-colors focus:outline-none"
              tabIndex={-1} // Evita que se enfoque al tabulard
            >
              {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </button>
        </div>
      </div>

      {/* Mensaje de Error con Animación y Diseño */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-1">
            <IconAlertCircle size={18} className="shrink-0" />
            <p>{error}</p>
        </div>
      )}

      {/* Botón de Acción */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 transform active:scale-[0.98]"
      >
        {isLoading ? (
          <div className="scale-75">
            <LoaderOne />
          </div>
        ) : (
          "Iniciar Sesión"
        )}
      </button>
      
      {/* Footer del formulario (Opcional) */}
      <div className="text-center mt-4">
        <p className="text-xs text-gray-400 dark:text-gray-500">
            ¿Olvidaste tu contraseña? Contacta a soporte.
        </p>
      </div>
    </form>
  );
};

export default LoginForm;