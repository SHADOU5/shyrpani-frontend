"use client";

import { useEffect, useId, useState, type FormEvent, type CSSProperties } from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  Code2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRound,
  KeyRound,
  type LucideIcon,
} from "lucide-react";
import { loginAction, registrarAction } from "../actions/auth";

type Modo = "entrar" | "crear";

type CampoProps = {
  etiqueta: string;
  valor: string;
  onCambio: (valor: string) => void;
  icono: LucideIcon;
  tipo?: string;
  placeholder?: string;
  autoComplete?: string;
  minLength?: number;
  maxLength?: number;
  esOscuro: boolean;
};

function Campo({
  etiqueta,
  valor,
  onCambio,
  icono: Icono,
  tipo = "text",
  placeholder,
  autoComplete,
  minLength,
  maxLength,
  esOscuro,
}: CampoProps) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  const esContrasena = tipo === "password";

  return (
    <div className="block space-y-2">
      <label htmlFor={id} className="block text-[14px] font-medium">{etiqueta}</label>
      <div
        className={`relative flex h-[56px] items-center overflow-hidden rounded-xl border transition-colors focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-400/20 ${
          esOscuro
            ? "border-[#42628f] bg-[#081630] hover:border-[#6586b3]"
            : "border-[#b7cce9] bg-white hover:border-[#6b9ad3]"
        }`}
      >
        <Icono aria-hidden="true" size={21} className="pointer-events-none absolute left-4 text-[#88a1c5]" />
        <input
          id={id}
          type={esContrasena ? (visible ? "text" : "password") : tipo}
          value={valor}
          onChange={(e) => onCambio(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={minLength}
          maxLength={maxLength}
          required
          className={`h-full w-full bg-transparent py-3 pl-12 text-[15px] outline-none placeholder:text-[#869bbc] ${
            esContrasena ? "pr-12" : "pr-4"
          }`}
        />
        {esContrasena && (
          <button
            type="button"
            onClick={() => setVisible((anterior) => !anterior)}
            aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
            title={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute right-3.5 rounded-lg p-1.5 text-[#adc3e5] transition hover:text-[#fbbf48] focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400"
          >
            {visible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
}

const capacidades = [
  {
    titulo: "Análisis empresarial",
    descripcion: "Transforma información en mejores decisiones.",
    icono: BarChart3,
  },
  {
    titulo: "Generación de código",
    descripcion: "Desarrolla soluciones con ayuda de IA.",
    icono: Code2,
  },
  {
    titulo: "Seguridad",
    descripcion: "Revisión de código y buenas prácticas.",
    icono: ShieldCheck,
  },
  {
    titulo: "Respuestas claras",
    descripcion: "Información útil, precisa y organizada.",
    icono: Sparkles,
  },
];

export default function FormularioAcceso() {
  const [modo, setModo] = useState<Modo>("entrar");
  const [temaClaro, setTemaClaro] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [codigo, setCodigo] = useState("");
  const [recordarme, setRecordarme] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const esOscuro = !temaClaro;

  useEffect(() => {
    // Solo se recuerda el correo; nunca se guarda la contraseña.
    const correoGuardado = window.localStorage.getItem("shyrpani_correo_recordado");
    if (correoGuardado) {
      setEmail(correoGuardado);
      setRecordarme(true);
    }
  }, []);

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (cargando) return;

    setError(null);
    setCargando(true);

    try {
      const resultado =
        modo === "entrar"
          ? await loginAction({ email: email.trim(), password })
          : await registrarAction({
              nombre: nombre.trim(),
              email: email.trim(),
              password,
              codigoInvitacion: codigo,
            });

      if (resultado.ok) {
        if (recordarme) {
          window.localStorage.setItem("shyrpani_correo_recordado", email.trim());
        } else {
          window.localStorage.removeItem("shyrpani_correo_recordado");
        }
        window.location.assign("/");
        return;
      }

      setError(resultado.error || "No se pudo completar la solicitud.");
    } catch {
      setError("Ocurrió un error de conexión. Inténtalo nuevamente.");
    } finally {
      setCargando(false);
    }
  }

  function cambiarModo() {
    setModo((anterior) => (anterior === "entrar" ? "crear" : "entrar"));
    setError(null);
    setPassword("");
    setCodigo("");
  }

  const decoracionEstrellas: CSSProperties = {
    backgroundImage: [
      "radial-gradient(2px 2px at 26px 38px, #ffffffaa 98%, transparent)",
      "radial-gradient(2px 2px at 160px 110px, #fbbf24 98%, transparent)",
      "radial-gradient(1px 1px at 80px 170px, #60a5fa 98%, transparent)",
      "radial-gradient(1px 1px at 238px 212px, #ffffffbb 98%, transparent)",
    ].join(", "),
    backgroundSize: "295px 260px",
  };

  return (
    <main className="relative isolate flex min-h-dvh w-full items-center justify-center overflow-hidden bg-[#020817] px-4 py-7 text-white sm:px-6 lg:py-10">
      {/* Fondo espacial recreado con CSS, sin imágenes externas. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_25%,#0b2f66_0%,#05132c_44%,#010612_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-60" style={decoracionEstrellas} />
      <div className="pointer-events-none absolute -left-[34rem] -top-[55rem] h-[76rem] w-[76rem] rounded-full border-[7px] border-[#297fff] bg-[radial-gradient(circle_at_65%_70%,#1557ba_0%,#0b2662_40%,#02081b_78%)] shadow-[0_0_65px_#1484ff,0_0_160px_#1260cc66]" />
      <div className="pointer-events-none absolute -bottom-[57rem] -left-[19rem] h-[75rem] w-[100rem] rounded-[50%] border-[6px] border-[#257bff]/80 bg-[radial-gradient(ellipse_at_48%_2%,#1e6bcb_0%,#0a3778_15%,#071a3a_37%,#010613_70%)] shadow-[0_-12px_80px_#0068ff99,0_-30px_190px_#144cb555]" />
      <div className="pointer-events-none absolute -right-[29rem] top-[12rem] h-[42rem] w-[42rem] rounded-full border-[4px] border-[#1f78ff] bg-[radial-gradient(circle_at_20%_24%,#1453a8_0%,#051a45_40%,#010816_75%)] shadow-[0_0_80px_#006eff66]" />
      <div className="pointer-events-none absolute -left-[16%] top-[34%] h-[24rem] w-[135%] -rotate-[17deg] rounded-[50%] border-t-2 border-[#ffca63]/80 shadow-[0_-4px_20px_#fbbf2477]" />
      <div className="pointer-events-none absolute -right-[12%] bottom-[7%] h-[17rem] w-[86%] rotate-[13deg] rounded-[50%] border-t border-[#f7b744]/70" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#000a1c20,#000a1c45_60%,#000a1c20)]" />

      <div className="relative z-10 grid w-full max-w-[1330px] grid-cols-1 overflow-hidden rounded-[32px] border border-[#72a7ed]/55 bg-[#05132b]/80 shadow-[0_24px_100px_#000b25bb,0_0_48px_#2877dc33] backdrop-blur-xl lg:grid-cols-[1.04fr_0.96fr]">
        {/* Presentación de Shyrpani */}
        <section className="hidden flex-col items-center justify-center px-7 py-14 text-center lg:flex xl:px-10">
          <div className="flex h-[98px] w-[98px] items-center justify-center rounded-[23px] border border-yellow-200/70 bg-gradient-to-br from-[#ffe783] via-[#ffc64d] to-[#f1a526] text-[52px] font-extrabold text-[#081732] shadow-[0_0_32px_#ffbd4460]">
            S
          </div>
          <h1 className="mt-5 text-[clamp(2.8rem,4.5vw,4.1rem)] font-extrabold leading-tight tracking-tight">Shyrpani</h1>
          <p className="mt-1 text-[clamp(1.1rem,1.65vw,1.45rem)] font-bold text-[#ffc74e]">
            Asistente personal inteligente
          </p>
          <p className="mt-5 max-w-[525px] text-[17px] leading-[1.65] text-[#c9d9f5]">
            Tu copiloto de inteligencia artificial para{" "}
            <span className="font-semibold text-[#ffcb68]">análisis empresarial, generación de código, seguridad</span>{" "}
            y respuestas claras.
          </p>

          <div className="mt-8 grid w-full max-w-[550px] grid-cols-2 gap-3.5 text-left">
            {capacidades.map(({ titulo, descripcion, icono: Icono }) => (
              <div
                key={titulo}
                className="flex min-h-[126px] items-start gap-3 rounded-2xl border border-[#3275c7]/65 bg-[#071c3a]/80 p-4 shadow-[inset_0_1px_0_#ffffff0d]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#597cb5]/35 bg-[#1b3155] text-[#ffc74e]">
                  <Icono aria-hidden="true" size={27} strokeWidth={2.4} />
                </div>
                <div>
                  <h2 className="text-[14px] font-semibold leading-snug text-white">{titulo}</h2>
                  <p className="mt-1.5 text-[12.5px] leading-[1.48] text-[#b6c9e8]">{descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Acceso y registro: se mantienen las Server Actions existentes. */}
        <section
          className={`relative m-3 flex flex-col justify-center rounded-[27px] border p-6 shadow-[inset_0_1px_0_#ffffff1a] sm:m-5 sm:p-9 lg:my-5 lg:mr-5 lg:ml-0 xl:p-11 ${
            esOscuro
              ? "border-[#496795] bg-[linear-gradient(145deg,#162c50f5_0%,#0b1a36f5_48%,#0a172ff5_100%)] text-white"
              : "border-[#a6c4e7] bg-[linear-gradient(145deg,#fffffffa_0%,#eaf3fffa_100%)] text-[#11213f]"
          }`}
        >
          <div className="mb-8 flex justify-end">
            <div className={`flex items-center gap-1 rounded-full border p-1 ${esOscuro ? "border-[#516c98] bg-[#1b3052]" : "border-[#b8cae5] bg-[#dce9fa]"}`}>
              <button
                type="button"
                aria-label="Activar tema claro"
                aria-pressed={temaClaro}
                onClick={() => setTemaClaro(true)}
                className={`flex h-8 w-8 items-center justify-center rounded-full transition ${temaClaro ? "bg-[#2768c3] text-white" : "text-[#a8bbd7] hover:text-white"}`}
              >
                <Sun size={19} />
              </button>
              <button
                type="button"
                aria-label="Activar tema oscuro"
                aria-pressed={esOscuro}
                onClick={() => setTemaClaro(false)}
                className={`flex h-8 w-8 items-center justify-center rounded-full transition ${esOscuro ? "bg-[#1d63d1] text-white shadow-[0_0_12px_#3482ff44]" : "text-[#52749d] hover:text-[#10254a]"}`}
              >
                <Moon size={19} />
              </button>
            </div>
          </div>

          <div className="mb-8 lg:hidden">
            <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ffe27b] to-[#f2a323] text-2xl font-extrabold text-[#061329]">S</div>
            <div className="text-2xl font-bold">Shyrpani</div>
            <div className={`text-sm ${esOscuro ? "text-[#a9bde0]" : "text-[#577299]"}`}>Tu asistente personal inteligente</div>
          </div>

          <h2 className="text-[clamp(2rem,3vw,3.2rem)] font-extrabold leading-[1.12] tracking-tight">
            {modo === "entrar" ? "Inicia sesión" : "Crear cuenta"}
          </h2>
          <p className={`mb-9 mt-2 text-[16px] ${esOscuro ? "text-[#aec2e4]" : "text-[#59749c]"}`}>
            {modo === "entrar" ? "Accede a tu cuenta para continuar" : "Regístrate con tu código de invitación"}
          </p>

          <form onSubmit={enviar} className="flex flex-col gap-[22px]">
            {modo === "crear" && (
              <Campo etiqueta="Nombre" valor={nombre} onCambio={setNombre} icono={UserRound} placeholder="Tu nombre completo" autoComplete="name" maxLength={60} esOscuro={esOscuro} />
            )}

            <Campo
              etiqueta="Correo electrónico"
              tipo="email"
              valor={email}
              onCambio={setEmail}
              icono={Mail}
              placeholder="tu@correo.com"
              autoComplete="email"
              esOscuro={esOscuro}
            />
            <Campo
              etiqueta="Contraseña"
              tipo="password"
              valor={password}
              onCambio={setPassword}
              icono={LockKeyhole}
              placeholder="Ingresa tu contraseña"
              autoComplete={modo === "entrar" ? "current-password" : "new-password"}
              minLength={modo === "crear" ? 8 : undefined}
              maxLength={72}
              esOscuro={esOscuro}
            />
            {modo === "crear" && (
              <Campo
                etiqueta="Código de invitación"
                tipo="password"
                valor={codigo}
                onCambio={setCodigo}
                icono={KeyRound}
                placeholder="Código de invitación"
                autoComplete="off"
                esOscuro={esOscuro}
              />
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 text-[13.5px] sm:text-[14px]">
              <label className="inline-flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={recordarme}
                  onChange={(e) => setRecordarme(e.target.checked)}
                  className="peer sr-only"
                />
                <span className="flex h-5 w-5 items-center justify-center rounded-[5px] border border-[#7990ac] bg-[#0b1a36] text-transparent peer-checked:border-[#f5b841] peer-checked:bg-[#f5b841] peer-checked:text-[#08152b] peer-focus-visible:ring-2 peer-focus-visible:ring-sky-400">
                  <Check size={15} strokeWidth={3} />
                </span>
                Recordarme
              </label>
              {modo === "entrar" && (
                <a href="/recuperar" className="font-medium text-[#ffc44d] transition hover:text-[#ffe19b] hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              )}
            </div>

            {error && (
              <div role="alert" className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-[13.5px] text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="group flex h-[58px] w-full items-center justify-center gap-2 rounded-xl border border-[#ffe58c] bg-gradient-to-b from-[#ffdb74] via-[#ffc44b] to-[#efa324] text-[17px] font-extrabold text-[#07152d] shadow-[0_4px_25px_#f9af2950] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffcf5a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cargando ? "Un momento..." : modo === "entrar" ? "Entrar" : "Crear cuenta"}
              {!cargando && <ArrowRight aria-hidden="true" size={21} className="transition-transform group-hover:translate-x-1" />}
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <span className={`h-px flex-1 ${esOscuro ? "bg-[#50658a]" : "bg-[#bbcee7]"}`} />
            <span className={`text-xs ${esOscuro ? "text-[#9db4d7]" : "text-[#6980a1]"}`}>o</span>
            <span className={`h-px flex-1 ${esOscuro ? "bg-[#50658a]" : "bg-[#bbcee7]"}`} />
          </div>

          <button type="button" onClick={cambiarModo} className="w-full rounded-xl py-1 text-center text-[14px] transition hover:text-[#ffcd5c]">
            {modo === "entrar" ? (
              <>¿No tienes cuenta? <span className="font-bold text-[#ffc44d]">Crear una</span></>
            ) : (
              <>¿Ya tienes cuenta? <span className="font-bold text-[#ffc44d]">Inicia sesión</span></>
            )}
          </button>

          <div className={`mt-7 flex items-center justify-center gap-2 rounded-xl border px-3 py-4 text-center text-xs sm:text-[13px] ${
            esOscuro ? "border-[#39557e] bg-[#152949] text-[#a6bcde]" : "border-[#b7cce7] bg-[#e1edfb] text-[#577397]"
          }`}>
            <LockKeyhole aria-hidden="true" size={17} className="shrink-0" />
            <span>Acceso protegido. Nunca compartas tu contraseña.</span>
          </div>
        </section>
      </div>
    </main>
  );
}
