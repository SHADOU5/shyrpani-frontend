"use server";

import { llamarBackend } from "../lib/backend";
import { exigirUsuario } from "../lib/sesion";

export async function listarConversaciones() {
  const usuarioId = await exigirUsuario();
  const datos = await llamarBackend(`/api/conversaciones?usuarioId=${encodeURIComponent(usuarioId)}`);
  return datos.conversaciones as { id: string; titulo: string | null; creadoEn: string }[];
}

export async function crearConversacion(): Promise<string> {
  const usuarioId = await exigirUsuario();
  const datos = await llamarBackend("/api/conversaciones", {
    method: "POST",
    body: JSON.stringify({ usuarioId }),
  });
  return datos.conversacionId;
}

export async function listarMensajes(conversacionId: string) {
  const usuarioId = await exigirUsuario();
  const datos = await llamarBackend(
    `/api/conversaciones/${encodeURIComponent(conversacionId)}/mensajes?usuarioId=${encodeURIComponent(usuarioId)}`
  );
  return datos.mensajes as { id: string; rol: string; contenido: string; creadoEn: string }[];
}

export async function listarProyectos() {
  const usuarioId = await exigirUsuario();
  const datos = await llamarBackend(`/api/proyectos?usuarioId=${encodeURIComponent(usuarioId)}`);
  return datos.proyectos as {
    id: string;
    nombre: string;
    stack: string;
    creadoEn: string;
    _count: { archivos: number };
  }[];
}

export async function enviarMensajeAction(params: { conversacionId: string; contenido: string }) {
  const usuarioId = await exigirUsuario();
  try {
    const datos = await llamarBackend("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        usuarioId,
        conversacionId: params.conversacionId,
        contenido: params.contenido,
      }),
    });
    return { ok: true as const, ...datos };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}