"use client";

import { useState, FormEvent } from "react";
import { loginAction, registrarAction } from "../actions/auth";

type CampoProps = {
  etiqueta: string;
  valor: string;
  onCambio: (v: string) => void;
  tipo?: string;
  autoComplete?: string;
  minLength?: number;
  maxLength?: number;
};

function Campo({ etiqueta, valor, onCambio, tipo = "text", autoComplete, minLength, maxLength }: CampoProps) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-texto-tenue">
      {etiqueta}
      <input
        type={tipo}
        value={valor}
        onChange={(e) => onCambio(e.target.value)}
        autoComplete={autoComplete}
        minLength={minLength}
        maxLength={maxLength}
        required
        className="rounded-xl border border-borde bg-noche px-4 py-3 text-[15px] text-texto outline-none focus:border-ambar focus:ring-2 focus:ring-ambar/20"
      />
    </label>
  );
}

export default function FormularioAcceso() {
  const [modo, setModo] = useState<"entrar" | "crear">("entrar");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (cargando) return;
    setError(null);
    setCargando(true);

    const resultado =
      modo === "entrar"
        ? await loginAction({ email, password })
        : await registrarAction({ nombre, email, password, codigoInvitacion: codigo });

    if (resultado.ok) {
      window.location.assign("/");
      return;
    }

    setError(resultado.error);
    setCargando(false);
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ambar font-display text-2xl font-bold text-noche">
            S
          </div>
          <h1 className="font-display text-2xl font-bold text-texto">Shyrpani</h1>
          <p className="mt-1 text-sm text-texto-tenue">
            {modo === "entrar" ? "Inicia sesión para continuar" : "Crea tu cuenta con tu código de invitación"}
          </p>
        </div>

        <form onSubmit={enviar} className="flex flex-col gap-4 rounded-2xl border border-borde bg-superficie p-6">
          {modo === "crear" && (
            <Campo etiqueta="Nombre" valor={nombre} onCambio={setNombre} autoComplete="name" maxLength={60} />
          )}
          <Campo etiqueta="Correo" tipo="email" valor={email} onCambio={setEmail} autoComplete="email" />
          <Campo
            etiqueta="Contraseña"
            tipo="password"
            valor={password}
            onCambio={setPassword}
            autoComplete={modo === "entrar" ? "current-password" : "new-password"}
            minLength={modo === "crear" ? 8 : undefined}
            maxLength={72}
          />
          {modo === "crear" && (
            <Campo
              etiqueta="Código de invitación"
              tipo="password"
              valor={codigo}
              onCambio={setCodigo}
              autoComplete="off"
            />
          )}

          {error && (
            <div className="rounded-xl border border-ambar/40 bg-ambar-suave px-4 py-3 text-sm text-ambar">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="rounded-xl bg-ambar px-4 py-3 text-[15px] font-medium text-noche transition-opacity disabled:opacity-50 enabled:hover:opacity-90"
          >
            {cargando ? "Un momento..." : modo === "entrar" ? "Entrar" : "Crear cuenta"}
          </button>
        </form>

        <button
          onClick={() => {
            setModo(modo === "entrar" ? "crear" : "entrar");
            setError(null);
          }}
          className="mt-4 w-full text-center text-sm text-texto-tenue transition-colors hover:text-ambar"
        >
          {modo === "entrar" ? "¿No tienes cuenta? Crear una" : "¿Ya tienes cuenta? Entrar"}
        </button>
      </div>
    </main>
  );
}