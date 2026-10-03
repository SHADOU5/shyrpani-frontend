"use client";

type Conversacion = {
  id: string;
  titulo: string | null;
  creadoEn: string;
};

type Props = {
  conversaciones: Conversacion[];
  conversacionActualId: string | null;
  onSeleccionar: (id: string) => void;
  onNueva: () => void;
};

export default function Barra({ conversaciones, conversacionActualId, onSeleccionar, onNueva }: Props) {
  return (
    <aside className="hidden w-72 flex-shrink-0 flex-col border-r border-borde bg-superficie sm:flex">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ambar text-noche font-display text-sm font-bold">
          S
        </div>
        <span className="font-display text-lg font-bold text-texto">Shyrpani</span>
      </div>

      <div className="px-3">
        <button
          onClick={onNueva}
          className="flex w-full items-center gap-2 rounded-lg border border-borde px-3 py-2.5 text-sm text-texto transition-colors hover:border-ambar hover:text-ambar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Nueva conversación
        </button>
      </div>

      <nav className="mt-4 flex-1 overflow-y-auto px-3 pb-4">
        {conversaciones.length === 0 && (
          <p className="px-2 py-4 text-sm text-texto-tenue">Aún no tienes conversaciones.</p>
        )}
        <ul className="flex flex-col gap-1">
          {conversaciones.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => onSeleccionar(c.id)}
                className={`w-full truncate rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  c.id === conversacionActualId
                    ? "bg-superficie-alta text-texto"
                    : "text-texto-tenue hover:bg-superficie-alta/60 hover:text-texto"
                }`}
              >
                {c.titulo || "Nueva conversación"}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}