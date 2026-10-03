import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  rol: string;
  contenido: string;
};

export default function MensajeBurbuja({ rol, contenido }: Props) {
  const esUsuario = rol === "usuario";

  return (
    <div className={`flex ${esUsuario ? "justify-end" : "justify-start"} animate-[aparecer_0.35s_ease-out]`}>
      <div className={`flex gap-3 max-w-[75%] ${esUsuario ? "flex-row-reverse" : "flex-row"}`}>
        {!esUsuario && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-ambar-suave border border-borde flex items-center justify-center text-ambar font-display text-sm font-bold">
            S
          </div>
        )}
        <div
          className={`rounded-2xl px-4 py-3 text-[15px] leading-relaxed overflow-x-auto ${
            esUsuario
              ? "bg-ambar text-noche rounded-br-sm whitespace-pre-wrap"
              : "bg-superficie border border-borde text-texto rounded-bl-sm"
          }`}
        >
          {esUsuario ? (
            contenido
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold text-texto">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                ul: ({ children }) => <ul className="mb-2 ml-5 list-disc space-y-1 last:mb-0">{children}</ul>,
                ol: ({ children }) => <ol className="mb-2 ml-5 list-decimal space-y-1 last:mb-0">{children}</ol>,
                a: ({ children, href }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-ambar underline underline-offset-2">
                    {children}
                  </a>
                ),
                code: ({ children }) => (
                  <code className="rounded bg-superficie-alta px-1.5 py-0.5 font-mono text-[13px]">{children}</code>
                ),
                table: ({ children }) => (
                  <div className="mb-2 overflow-x-auto last:mb-0">
                    <table className="w-full border-collapse text-sm">{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-borde bg-superficie-alta px-2 py-1.5 text-left font-semibold">{children}</th>
                ),
                td: ({ children }) => <td className="border border-borde px-2 py-1.5">{children}</td>,
              }}
            >
              {contenido}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}