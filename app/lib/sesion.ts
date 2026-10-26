import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const NOMBRE_COOKIE = "shyrpani_sesion";
const DIAS = 7;
const SEGUNDOS = DIAS * 24 * 60 * 60;

export type Sesion = { usuarioId: string; nombre: string };

function clave(): Uint8Array {
  const secreto = process.env.SESION_SECRETO;
  if (!secreto || secreto.length < 32) {
    throw new Error("SESION_SECRETO no está configurado (mínimo 32 caracteres)");
  }
  return new TextEncoder().encode(secreto);
}

export async function crearSesion(usuarioId: string, nombre: string) {
  const token = await new SignJWT({ usuarioId, nombre })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DIAS}d`)
    .sign(clave());

  const almacen = await cookies();
  almacen.set(NOMBRE_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SEGUNDOS,
  });
}

export async function obtenerSesion(): Promise<Sesion | null> {
  const almacen = await cookies();
  const token = almacen.get(NOMBRE_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, clave(), { algorithms: ["HS256"] });
    if (typeof payload.usuarioId !== "string") return null;
    return {
      usuarioId: payload.usuarioId,
      nombre: typeof payload.nombre === "string" ? payload.nombre : "Usuario",
    };
  } catch {
    return null;
  }
}

// Para las acciones del servidor: sin sesión válida, manda a la pantalla de acceso
export async function exigirUsuario(): Promise<string> {
  const sesion = await obtenerSesion();
  if (!sesion) redirect("/acceso");
  return sesion.usuarioId;
}

export async function cerrarSesion() {
  const almacen = await cookies();
  almacen.delete(NOMBRE_COOKIE);
}