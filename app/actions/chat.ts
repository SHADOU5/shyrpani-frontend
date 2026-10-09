"use server";

const URL_BASE = process.env.SHYRPANI_API_URL!.replace("/api/chat", "");
const CLAVE_API = process.env.SHYRPANI_API_KEY!;

async function llamarBackend(ruta: string, opciones: RequestInit = {}) {
  const resp = await fetch(`${URL_BASE}${ruta}`, {
    ...opciones,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CLAVE_API,
      ...(opciones.headers ?? {}),
    },
    cache: "no-store",
  });

  const datos = await resp.json();
  if (!resp.ok) {
    throw new Error(datos.error ?? "Error del servidor");
  }
  return datos;
}

export async function crearUsuarioAnonimo(): Promise<string> {
  const datos = await llamarBackend("/api/usuarios", { method: "POST" });
  return datos.usuarioId;
}

export async function listarConversaciones(usuarioId: string) {
  const datos = await llamarBackend(`/api/conversaciones?usuarioId=${usuarioId}`);
  return datos.conversaciones as { id: string; titulo: string | null; creadoEn: string }[];
}

export async function crearConversacion(usuarioId: string): Promise<string> {
  const datos = await llamarBackend("/api/conversaciones", {
    method: "POST",
    body: JSON.stringify({ usuarioId }),
  });
  return datos.conversacionId;
}

export async function listarMensajes(conversacionId: string) {
  const datos = await llamarBackend(`/api/conversaciones/${conversacionId}/mensajes`);
  return datos.mensajes as { id: string; rol: string; contenido: string; creadoEn: string }[];
}

export async function enviarMensajeAction(params: {
  usuarioId: string;
  conversacionId: string;
  contenido: string;
}) {
  try {
    const datos = await llamarBackend("/api/chat", {
      method: "POST",
      body: JSON.stringify(params),
    });
    return { ok: true as const, ...datos };
  } catch (error) {
    return { ok: false as const, error: error instanceof Error ? error.message : "Error desconocido" };
  }
}


export async function listarProyectos(usuarioId: string) {
  const datos = await llamarBackend(`/api/proyectos?usuarioId=${usuarioId}`);
  return datos.proyectos as {
    id: string;
    nombre: string;
    stack: string;
    creadoEn: string;
    _count: { archivos: number };
  }[];
}