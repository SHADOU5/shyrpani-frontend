import { NextRequest, NextResponse } from "next/server";
import { obtenerSesion } from "../../../../lib/sesion";
import { pedirAlBackend } from "../../../../lib/backend";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sesion = await obtenerSesion();
  if (!sesion) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;

  const resp = await pedirAlBackend(
    `/api/proyectos/${encodeURIComponent(id)}/descargar?usuarioId=${encodeURIComponent(sesion.usuarioId)}`
  );

  if (!resp.ok) {
    return NextResponse.json({ error: "No se pudo descargar el proyecto" }, { status: resp.status });
  }

  return new NextResponse(resp.body, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition":
        resp.headers.get("Content-Disposition") ?? 'attachment; filename="proyecto.zip"',
    },
  });
}