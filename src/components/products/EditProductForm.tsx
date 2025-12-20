"use client";
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "../ui/animated-modal";
import { FileUpload } from "../ui/file-upload";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import * as productService from "@/service/productService";

// Interfaz del producto
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

export function EditProductForm({
  product,
  onProductUpdated,
}: {
  product: ProductData;
  onProductUpdated?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]); 

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    marca: "",
    modelo: "",
    sku: "",
    ancho: "",
    perfil: "",
    aro: "",
    indiceCarga: "",
    indiceVelocidad: "",
    tipoVehiculo: "Auto",
    precio: "",
    stock: "",
    descripcion: "",
  });

  // Rellenar datos al abrir
  useEffect(() => {
    if (product) {
      setFormData({
        nombre: product.nombre,
        marca: product.marca,
        modelo: product.modelo,
        sku: product.sku,
        ancho: String(product.ancho),
        perfil: String(product.perfil),
        aro: String(product.aro),
        indiceCarga: product.indiceCarga || "",
        indiceVelocidad: product.indiceVelocidad || "",
        tipoVehiculo: product.tipoVehiculo || "Auto",
        precio: String(product.precio),
        stock: String(product.stock),
        descripcion: product.descripcion || "",
      });
    }
  }, [product]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (files: File[]) => {
    setFiles(files);
  };

  // ACTUALIZAR
  const handleUpdate = async () => {
    if (!formData.nombre || !formData.precio || !formData.sku) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    setLoading(true);
    try {
      const result = await productService.updateProduct(
        product.id,
        formData,
        files[0] 
      );

      if (result.success) {
        alert("¡Producto actualizado correctamente!");
        if (onProductUpdated) onProductUpdated();
        setFiles([]); 
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  // ELIMINAR
  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de eliminar "${product.nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setLoading(true);
    try {
      const result = await productService.deleteProduct(product.id);
      if (result.success) {
        alert("Producto eliminado.");
        if (onProductUpdated) onProductUpdated();
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert("Error al eliminar");
    } finally {
      setLoading(false);
    }
  };

  // Clases de estilo consistentes (Iguales al ProductForm)
  const inputClass = "w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-2.5 outline-none transition-all dark:bg-neutral-800 dark:border-neutral-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white dark:focus:border-white";
  const labelClass = "block mb-1 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400";

  return (
    <div className="flex items-center justify-center">
      <Modal>
        {/* TRIGGER: Botón de editar discreto */}
        <ModalTrigger className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-full transition-colors text-neutral-600 dark:text-neutral-300 shadow-sm">
          <IconEdit size={18} />
        </ModalTrigger>

        <ModalBody>
          <ModalContent className="overflow-y-auto max-h-[85vh] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            
            <h4 className="text-xl md:text-3xl text-neutral-800 dark:text-neutral-100 font-bold text-center mb-8">
              Editar{" "}
              <span className="px-2 py-1 rounded-lg bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400">
                Producto
              </span>
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* --- COLUMNA 1: INFORMACIÓN GENERAL --- */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-neutral-800 text-xs font-bold">1</span>
                    <h5 className="font-semibold text-gray-900 dark:text-white">Identificación</h5>
                </div>

                <div>
                  <label className={labelClass}>Nombre Comercial</label>
                  <input name="nombre" value={formData.nombre} onChange={handleInputChange} className={inputClass} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Marca</label>
                    <input name="marca" value={formData.marca} onChange={handleInputChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Modelo</label>
                    <input name="modelo" value={formData.modelo} onChange={handleInputChange} className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>SKU (Código)</label>
                  <input name="sku" value={formData.sku} onChange={handleInputChange} className={`${inputClass} font-mono`} />
                </div>
              </div>

              {/* --- COLUMNA 2: ESPECIFICACIONES --- */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-neutral-800 text-xs font-bold">2</span>
                    <h5 className="font-semibold text-gray-900 dark:text-white">Ficha Técnica</h5>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Ancho</label>
                    <input type="number" name="ancho" value={formData.ancho} onChange={handleInputChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Perfil</label>
                    <input type="number" name="perfil" value={formData.perfil} onChange={handleInputChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Aro</label>
                    <input type="number" name="aro" value={formData.aro} onChange={handleInputChange} className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Carga</label>
                    <input type="number" name="indiceCarga" value={formData.indiceCarga} onChange={handleInputChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Velocidad</label>
                    <input name="indiceVelocidad" value={formData.indiceVelocidad} onChange={handleInputChange} className={inputClass} />
                  </div>
                </div>

                <div>
                    <label className={labelClass}>Tipo Vehículo</label>
                    <select name="tipoVehiculo" value={formData.tipoVehiculo} onChange={handleInputChange} className={inputClass}>
                        <option value="Auto">Auto</option>
                        <option value="Camioneta">Camioneta / SUV</option>
                        <option value="Camión">Camión</option>
                    </select>
                </div>
              </div>
            </div>

            {/* --- SECCIÓN 3: INVENTARIO (Ancho completo) --- */}
            <div className="mt-8 pt-4 border-t border-gray-100 dark:border-neutral-800">
                <div className="flex items-center gap-2 mb-4">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-neutral-800 text-xs font-bold">3</span>
                    <h5 className="font-semibold text-gray-900 dark:text-white">Inventario y Precios</h5>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Precio y Stock */}
                    <div className="space-y-1">
                        <label className={labelClass}>Precio Venta (S/)</label>
                        <div className="relative">
                            <input 
                                type="number" step="0.01" name="precio" 
                                value={formData.precio} onChange={handleInputChange} 
                                className={`${inputClass} pl-7 font-bold text-lg`} 
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className={labelClass}>Stock Disponible</label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className={inputClass} />
                    </div>
                </div>
            </div>

            {/* --- SECCIÓN 4: IMAGEN (Ancho completo) --- */}
            <div className="mt-8 pt-4 border-t border-gray-100 dark:border-neutral-800">
                <div className="flex items-center gap-2 mb-4">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-neutral-800 text-xs font-bold">4</span>
                    <h5 className="font-semibold text-gray-900 dark:text-white">Actualizar Foto (Opcional)</h5>
                </div>

                <p className="text-[10px] text-gray-400 mb-2 ml-1">Si no subes nada, se mantiene la foto actual.</p>
                <div className="w-full mt-1 border border-dashed bg-white dark:bg-black border-neutral-300 dark:border-neutral-700 rounded-xl overflow-hidden hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors">
                    <div className="min-h-[200px]">
                        <FileUpload onChange={handleFileUpload} />
                    </div>
                </div>
            </div>

          </ModalContent>
          
          <ModalFooter className="gap-4 bg-gray-50/50 dark:bg-neutral-900/50 border-t border-gray-100 dark:border-neutral-800 mt-6 pt-4 flex justify-between">
            
            {/* BOTÓN ELIMINAR (Izquierda) */}
            <button 
                onClick={handleDelete}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
                <IconTrash size={16} /> Eliminar
            </button>

            {/* BOTONES ACCIÓN (Derecha) */}
            <div className="flex gap-4">
                <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors w-24 dark:bg-black dark:text-white dark:border-neutral-700">
                Cancelar
                </button>
                <button 
                    onClick={handleUpdate}
                    disabled={loading}
                    className="bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-sm px-4 py-2 rounded-lg font-medium w-28 disabled:opacity-50 transition-colors shadow-sm"
                >
                {loading ? "..." : "Guardar"}
                </button>
            </div>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
}