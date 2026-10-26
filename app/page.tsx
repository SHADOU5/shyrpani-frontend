import { redirect } from "next/navigation";
import { obtenerSesion } from "./lib/sesion";
import Chat from "./components/Chat";

export default async function Home() {
  const sesion = await obtenerSesion();
  if (!sesion) redirect("/acceso");
  return <Chat nombre={sesion.nombre} />;
}