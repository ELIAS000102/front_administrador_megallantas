"use client";

import { IconSearch } from "@tabler/icons-react";

interface ProductSearchProps {
  onSearch: (term: string) => void;
}

export function ProductSearch({ onSearch }: ProductSearchProps) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-500">
        <IconSearch size={18} />
      </div>
      <input
        type="text"
        className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-200 rounded-xl bg-white focus:ring-black focus:border-black dark:bg-neutral-800 dark:border-neutral-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white dark:focus:border-white shadow-sm outline-none transition-all"
        placeholder="Buscar por marca, modelo o SKU..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}