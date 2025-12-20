// src/components/products/ProductForm.tsx
"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "../ui/animated-modal";
import { FileUpload } from "../ui/file-upload";
import { IconPackage } from "@tabler/icons-react";
import * as productService from "@/service/productService";

export function ProductForm({
  onProductCreated,
}: {
  onProductCreated?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  // Estado inicial del formulario
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

  const handleSubmit = async () => {
    // Validaciones básicas
    if (!formData.nombre || !formData.precio || !formData.sku) {
      alert("Por favor completa los campos obligatorios (Nombre, SKU, Precio)");
      return;
    }

    setLoading(true);
    try {
      const result = await productService.createProduct(formData, files[0]);

      if (result.success) {
        alert("¡Producto creado exitosamente!");
        if (onProductCreated) onProductCreated();
        setFiles([]);
        setFormData({
          nombre: "", marca: "", modelo: "", sku: "", ancho: "", perfil: "", aro: "",
          indiceCarga: "", indiceVelocidad: "", tipoVehiculo: "Auto", precio: "", stock: "", descripcion: "",
        });
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error inesperado al crear el producto");
    } finally {
      setLoading(false);
    }
  };

  // Clases comunes para inputs para mantener consistencia
  const inputClass = "w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-2.5 outline-none transition-all dark:bg-neutral-800 dark:border-neutral-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white dark:focus:border-white";
  const labelClass = "block mb-1 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400";

  return (
    <div className="flex items-center justify-center">
      <Modal>
        {/* BOTÓN TRIGGER */}
        <ModalTrigger className="bg-black dark:bg-white dark:text-black text-white flex justify-center group/modal-btn px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all">
          <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500 flex items-center gap-2 font-medium">
            Agregar Producto
          </span>
          <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
            <IconPackage />
          </div>
        </ModalTrigger>

        {/* CUERPO DEL MODAL */}
        <ModalBody>
          <ModalContent className="overflow-y-auto max-h-[85vh] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            
            <h4 className="text-xl md:text-3xl text-neutral-800 dark:text-neutral-100 font-bold text-center mb-8">
              Registrar Nuevo{" "}
              <span className="px-2 py-1 rounded-lg bg-black text-white dark:bg-white dark:text-black border border-gray-200 dark:border-neutral-700">
                Producto
              </span>
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* --- COLUMNA IZQUIERDA: INFORMACIÓN GENERAL --- */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-neutral-800 text-xs font-bold">1</span>
                    <h5 className="font-semibold text-gray-900 dark:text-white">Información General</h5>
                </div>

                <div>
                  <label className={labelClass}>Nombre Comercial *</label>
                  <input
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="Ej: Michelin Pilot Sport 4"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Marca *</label>
                    <input
                      name="marca"
                      value={formData.marca}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="Michelin"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Modelo *</label>
                    <input
                      name="modelo"
                      value={formData.modelo}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="Pilot Sport"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>SKU (Código Único) *</label>
                  <input
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className={`${inputClass} font-mono`}
                    placeholder="MICH-2055516"
                  />
                </div>
              </div>

              {/* --- COLUMNA DERECHA: ESPECIFICACIONES --- */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-neutral-800 text-xs font-bold">2</span>
                    <h5 className="font-semibold text-gray-900 dark:text-white">Especificaciones Técnicas</h5>
                </div>

                {/* Medidas Principales */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Ancho</label>
                    <input
                      type="number"
                      name="ancho"
                      value={formData.ancho}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="205"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Perfil</label>
                    <input
                      type="number"
                      name="perfil"
                      value={formData.perfil}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="55"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Aro (R)</label>
                    <input
                      type="number"
                      name="aro"
                      value={formData.aro}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="16"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Índice Carga</label>
                    <input
                      type="number"
                      name="indiceCarga"
                      value={formData.indiceCarga}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="91"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Índice Velocidad</label>
                    <input
                      name="indiceVelocidad"
                      value={formData.indiceVelocidad}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="V"
                    />
                  </div>
                </div>
                
                <div>
                    <label className={labelClass}>Tipo Vehículo</label>
                    <select 
                        name="tipoVehiculo" 
                        value={formData.tipoVehiculo} 
                        onChange={handleInputChange}
                        className={inputClass}
                    >
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
                    <div className="space-y-1">
                        <label className={labelClass}>Precio Venta (S/)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500"></span>
                            <input
                                type="number"
                                step="0.01"
                                name="precio"
                                value={formData.precio}
                                onChange={handleInputChange}
                                className={`${inputClass} pl-7 font-bold text-lg`}
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className={labelClass}>Stock Inicial *</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            className={inputClass}
                            placeholder="0"
                        />
                    </div>
                </div>
            </div>

            {/* --- SECCIÓN 4: IMAGEN (Ancho completo) --- */}
            <div className="mt-8 pt-4 border-t border-gray-100 dark:border-neutral-800">
                <div className="flex items-center gap-2 mb-4">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-neutral-800 text-xs font-bold">4</span>
                    <h5 className="font-semibold text-gray-900 dark:text-white">Fotografía del Producto</h5>
                </div>
                
                <div className="w-full mt-1 border border-dashed bg-white dark:bg-black border-neutral-300 dark:border-neutral-700 rounded-xl overflow-hidden hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors">
                    <div className="min-h-[200px]"> {/* Altura mínima para que el FileUpload se vea bien */}
                        <FileUpload onChange={handleFileUpload} />
                    </div>
                </div>
            </div>

          </ModalContent>
          
          <ModalFooter className="gap-4 bg-gray-50/50 dark:bg-neutral-900/50 border-t border-gray-100 dark:border-neutral-800 mt-6 pt-4">
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors w-28 dark:bg-black dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-900">
              Cancelar
            </button>
            <button 
                onClick={handleSubmit}
                disabled={loading}
                className="bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-sm px-4 py-2 rounded-lg font-medium w-28 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
}