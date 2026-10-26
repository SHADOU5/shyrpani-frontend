import "server-only";

const URL_BASE = process.env.SHYRPANI_API_URL!.replace("/api/chat", "");
const CLAVE_API = process.env.SHYRPANI_API_KEY!;

export class ErrorBackend extends Error {
  estado: number;
  constructor(mensaje: string, estado: number) {
    super(mensaje);
    this.estado = estado;
  }
}

export async function llamarBackend(ruta: string, opciones: RequestInit = {}) {
  const resp = await fetch(`${URL_BASE}${ruta}`, {
    ...opciones,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CLAVE_API,
      ...(opciones.headers ?? {}),
    },
    cache: "no-store",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let datos: any = null;
  try {
    datos = await resp.json();
  } catch {
    // respuesta sin JSON
  }

  if (!resp.ok) {
    throw new ErrorBackend(datos?.error ?? "Error del servidor", resp.status);
  }
  return datos;
}

// Para respuestas que no son JSON (la descarga del ZIP)
export async function pedirAlBackend(ruta: string): Promise<Response> {
  return fetch(`${URL_BASE}${ruta}`, {
    headers: { "x-api-key": CLAVE_API },
    cache: "no-store",
  });
}