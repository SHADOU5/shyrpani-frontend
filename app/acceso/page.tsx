import { redirect } from "next/navigation";
import { obtenerSesion } from "../lib/sesion";
import FormularioAcceso from "./FormularioAcceso";

export default async function PaginaAcceso() {
  const sesion = await obtenerSesion();
  if (sesion) redirect("/");
  return <FormularioAcceso />;
}