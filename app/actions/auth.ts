"use server";

import { redirect } from "next/navigation";
import { llamarBackend, ErrorBackend } from "../lib/backend";
import { crearSesion, cerrarSesion } from "../lib/sesion";

type Resultado = { ok: true } | { ok: false; error: string };

function mensajeDeError(error: unknown, porDefecto: string): string {
  if (error instanceof ErrorBackend) return error.message;
  console.error(porDefecto, error);
  return porDefecto;
}

export async function loginAction(datos: { email: string; password: string }): Promise<Resultado> {
  try {
    const r = await llamarBackend("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: String(datos?.email ?? ""),
        password: String(datos?.password ?? ""),
      }),
    });
    await crearSesion(r.usuarioId, r.nombre ?? "Usuario");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: mensajeDeError(error, "No se pudo iniciar sesión. Intenta de nuevo.") };
  }
}

export async function registrarAction(datos: {
  nombre: string;
  email: string;
  password: string;
  codigoInvitacion: string;
}): Promise<Resultado> {
  try {
    const r = await llamarBackend("/api/auth/registro", {
      method: "POST",
      body: JSON.stringify({
        nombre: String(datos?.nombre ?? ""),
        email: String(datos?.email ?? ""),
        password: String(datos?.password ?? ""),
        codigoInvitacion: String(datos?.codigoInvitacion ?? ""),
      }),
    });
    await crearSesion(r.usuarioId, r.nombre ?? "Usuario");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: mensajeDeError(error, "No se pudo crear la cuenta. Intenta de nuevo.") };
  }
}

export async function cerrarSesionAction() {
  await cerrarSesion();
  redirect("/acceso");
}