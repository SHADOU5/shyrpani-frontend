"use client";

import { useState, KeyboardEvent } from "react";

type Props = {
  onEnviar: (texto: string) => void;
  deshabilitado: boolean;
};

export default function CajaEntrada({ onEnviar, deshabilitado }: Props) {
  const [texto, setTexto] = useState("");

  function manejarEnvio() {
    const limpio = texto.trim();
    if (!limpio || deshabilitado) return;
    onEnviar(limpio);
    setTexto("");
  }

  function manejarTecla(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      manejarEnvio();
    }
  }

  return (
    <div className="border-t border-borde bg-noche px-4 py-4 sm:px-8">
      <div className="mx-auto flex max-w-3xl items-end gap-3">
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={manejarTecla}
          placeholder="Escribe un mensaje a Shyrpani..."
          rows={1}
          className="flex-1 resize-none rounded-xl border border-borde bg-superficie px-4 py-3 text-[15px] text-texto placeholder:text-texto-tenue outline-none focus:border-ambar focus:ring-2 focus:ring-ambar/20"
        />
        <button
          onClick={manejarEnvio}
          disabled={deshabilitado || !texto.trim()}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-ambar text-noche transition-opacity disabled:opacity-30 enabled:hover:opacity-90"
          aria-label="Enviar mensaje"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}