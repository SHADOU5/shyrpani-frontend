"use client";

import { useEffect, useRef, useState } from "react";
import {
  crearUsuarioAnonimo,
  listarConversaciones,
  crearConversacion,
  listarMensajes,
  enviarMensajeAction,
} from "./actions/chat";
import Barra from "./components/Barra";
import MensajeBurbuja from "./components/MensajeBurbuja";
import CajaEntrada from "./components/CajaEntrada";

type Conversacion = { id: string; titulo: string | null; creadoEn: string };
type Mensaje = { id: string; rol: string; contenido: string; creadoEn: string };

const CLAVE_LOCAL = "shyrpani-usuario-id";

export default function Home() {
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [conversacionId, setConversacionId] = useState<string | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const finRef = useRef<HTMLDivElement>(null);

  // Inicializa usuario (desde localStorage o lo crea)
  useEffect(() => {
    async function iniciar() {
      let id = localStorage.getItem(CLAVE_LOCAL);
      if (!id) {
        id = await crearUsuarioAnonimo();
        localStorage.setItem(CLAVE_LOCAL, id);
      }
      setUsuarioId(id);

      const lista = await listarConversaciones(id);
      setConversaciones(lista);

      if (lista.length > 0) {
        setConversacionId(lista[0].id);
      }
    }
    iniciar().catch((e) => setError(e.message));
  }, []);

  // Carga los mensajes cuando cambia la conversación activa
  useEffect(() => {
    if (!conversacionId) {
      setMensajes([]);
      return;
    }
    listarMensajes(conversacionId)
      .then(setMensajes)
      .catch((e) => setError(e.message));
  }, [conversacionId]);

  // Auto-scroll al último mensaje
  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  async function manejarNuevaConversacion() {
    if (!usuarioId) return;
    const id = await crearConversacion(usuarioId);
    setConversaciones((prev) => [{ id, titulo: null, creadoEn: new Date().toISOString() }, ...prev]);
    setConversacionId(id);
  }

  async function manejarEnviar(texto: string) {
    if (!usuarioId) return;
    setError(null);

    let idConversacionActiva = conversacionId;
    if (!idConversacionActiva) {
      idConversacionActiva = await crearConversacion(usuarioId);
      setConversacionId(idConversacionActiva);
      setConversaciones((prev) => [
        { id: idConversacionActiva!, titulo: null, creadoEn: new Date().toISOString() },
        ...prev,
      ]);
    }

    // Optimista: muestra el mensaje del usuario de inmediato
    const mensajeTemporal: Mensaje = {
      id: `temp-${Date.now()}`,
      rol: "usuario",
      contenido: texto,
      creadoEn: new Date().toISOString(),
    };
    setMensajes((prev) => [...prev, mensajeTemporal]);
    setCargando(true);

    const resultado = await enviarMensajeAction({
      usuarioId,
      conversacionId: idConversacionActiva,
      contenido: texto,
    });

    setCargando(false);

    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }

    setMensajes((prev) => [
      ...prev.filter((m) => m.id !== mensajeTemporal.id),
      resultado.mensajeUsuario,
      resultado.mensajeAsistente,
    ]);

    // Si era una conversación nueva, refresca el título
    if (conversaciones.find((c) => c.id === idConversacionActiva)?.titulo === null) {
      const lista = await listarConversaciones(usuarioId);
      setConversaciones(lista);
    }
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <Barra
        conversaciones={conversaciones}
        conversacionActualId={conversacionId}
        onSeleccionar={setConversacionId}
        onNueva={manejarNuevaConversacion}
      />

      <main className="flex flex-1 flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            {mensajes.length === 0 && (
              <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ambar-suave text-ambar font-display text-2xl font-bold">
                  S
                </div>
                <h1 className="font-display text-xl font-bold text-texto">¿En qué te ayudo hoy?</h1>
                <p className="mt-1 text-sm text-texto-tenue">
                  Pregúntame por el clima, pídeme que busque algo en internet, o dime qué quieres recordar.
                </p>
              </div>
            )}

            {mensajes.map((m) => (
              <MensajeBurbuja key={m.id} rol={m.rol} contenido={m.contenido} />
            ))}

            {cargando && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl border border-borde bg-superficie px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-texto-tenue" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-texto-tenue [animation-delay:0.15s]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-texto-tenue [animation-delay:0.3s]" />
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-ambar/40 bg-ambar-suave px-4 py-3 text-sm text-ambar">
                {error}
              </div>
            )}

            <div ref={finRef} />
          </div>
        </div>

        <CajaEntrada onEnviar={manejarEnviar} deshabilitado={cargando || !usuarioId} />
      </main>
    </div>
  );
}