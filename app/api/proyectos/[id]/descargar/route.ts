import { NextRequest, NextResponse } from "next/server";

const URL_BASE = process.env.SHYRPANI_API_URL!.replace("/api/chat", "");
const CLAVE_API = process.env.SHYRPANI_API_KEY!;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const usuarioId = req.nextUrl.searchParams.get("usuarioId");
  if (!usuarioId) {
    return NextResponse.json({ error: "Falta usuarioId" }, { status: 400 });
  }

  const resp = await fetch(
    `${URL_BASE}/api/proyectos/${encodeURIComponent(id)}/descargar?usuarioId=${encodeURIComponent(usuarioId)}`,
    { headers: { "x-api-key": CLAVE_API }, cache: "no-store" }
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