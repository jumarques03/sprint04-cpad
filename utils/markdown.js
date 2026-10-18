// Interpretador de Markdown simples para as respostas do assistente de IA.
// Suporta: títulos (#), listas (-, * e 1.), **negrito**, *itálico* e `código`.

const REGEX_INLINE = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*\s][^*]*\*|_[^_\s][^_]*_|`[^`]+`)/g;

// Divide uma linha em pedaços com o estilo de cada um
export function parseInline(texto) {
  return texto
    .split(REGEX_INLINE)
    .filter((parte) => parte !== "")
    .map((parte) => {
      if (/^\*\*[^*]+\*\*$/.test(parte) || /^__[^_]+__$/.test(parte)) {
        return { texto: parte.slice(2, -2), negrito: true };
      }

      if (/^\*[^*\s][^*]*\*$/.test(parte) || /^_[^_\s][^_]*_$/.test(parte)) {
        return { texto: parte.slice(1, -1), italico: true };
      }

      if (/^`[^`]+`$/.test(parte)) {
        return { texto: parte.slice(1, -1), codigo: true };
      }

      return { texto: parte };
    });
}

// Divide a mensagem em blocos: título, item de lista, item numerado ou parágrafo
export function parseBlocos(texto) {
  return texto
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((linha) => linha.trimEnd())
    .filter((linha) => linha.trim() !== "")
    .map((linha) => {
      const titulo = linha.match(/^\s*#{1,6}\s+(.*)$/);
      if (titulo) return { tipo: "titulo", texto: titulo[1] };

      const item = linha.match(/^\s*[-*•]\s+(.*)$/);
      if (item) return { tipo: "item", texto: item[1] };

      const numerado = linha.match(/^\s*(\d+)[.)]\s+(.*)$/);
      if (numerado) return { tipo: "numerado", numero: numerado[1], texto: numerado[2] };

      return { tipo: "paragrafo", texto: linha.trim() };
    });
}
