import {
  STATUS_AGUARDANDO,
  classificarAltura,
  gerarRecomendacaoIA,
} from "./vegetationStatus";

export function formatarKm(km) {
  return String(km).replace(".", ",");
}

export function converterNumero(texto) {
  return parseFloat(String(texto).replace(",", "."));
}

export function descreverLocalizacao(mapData, trechoId, kmInicial, kmFinal) {
  const trecho = mapData.trechos[trechoId];

  return `${mapData.rodovia} – ${trecho.nome}, Km ${formatarKm(kmInicial)}–${formatarKm(kmFinal)}`;
}

// Pontos do mapa que pertencem à faixa de km da ordem de serviço.
export function pontosDaOrdem(mapData, ordem) {
  const trecho = mapData.trechos[ordem.trechoId];
  if (!trecho) return [];

  return trecho.pontos.filter(
    (ponto) => ponto.km >= ordem.kmInicial && ponto.km <= ordem.kmFinal
  );
}

export function alturaMaximaDosPontos(pontos) {
  const alturas = pontos
    .map((ponto) => ponto.alturaVegetacao)
    .filter((altura) => typeof altura === "number");

  return alturas.length > 0 ? Math.max(...alturas) : null;
}

// Aplica sobre os trechos as roçadas concluídas (da mais antiga para a mais
// nova): os pontos já escaneados dentro da faixa recebem a altura final e são
// reclassificados. Pontos aguardando escaneamento continuam sem leitura.
export function aplicarRocadas(trechos, rocadas) {
  const resultado = { ...trechos };

  [...rocadas].reverse().forEach((rocada) => {
    const trecho = resultado[rocada.trechoId];
    if (!trecho) return;

    const status = classificarAltura(rocada.alturaFinal);

    resultado[rocada.trechoId] = {
      ...trecho,
      pontos: trecho.pontos.map((ponto) => {
        const dentroDaFaixa =
          ponto.km >= rocada.kmInicial && ponto.km <= rocada.kmFinal;

        if (!dentroDaFaixa || ponto.status === STATUS_AGUARDANDO) return ponto;

        return {
          ...ponto,
          alturaVegetacao: rocada.alturaFinal,
          status,
          recomendacaoIA: gerarRecomendacaoIA(status),
          timestamp: rocada.concluidaEm,
          rocadaEm: rocada.concluidaEm,
        };
      }),
    };
  });

  return resultado;
}
