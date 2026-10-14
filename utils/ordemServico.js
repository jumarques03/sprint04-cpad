import {
  STATUS_AGUARDANDO,
  classificarAltura,
  gerarRecomendacaoIA,
} from "./vegetationStatus";

export const STATUS_ORDEM = {
  PENDENTE: "Pendente",
  EM_ANDAMENTO: "Em andamento",
  CONCLUIDA: "Concluída",
  IMPEDIDA: "Impedida",
  CANCELADA: "Cancelada",
};

export const STATUS_ORDEM_COR = {
  [STATUS_ORDEM.PENDENTE]: "#B7791F",
  [STATUS_ORDEM.EM_ANDAMENTO]: "#081EAD",
  [STATUS_ORDEM.CONCLUIDA]: "#00A152",
  [STATUS_ORDEM.IMPEDIDA]: "#E65100",
  [STATUS_ORDEM.CANCELADA]: "#C62828",
};

export const NUMERO_INICIAL_ORDEM = 1025;

export function ordemEstaAberta(ordem) {
  return (
    !!ordem &&
    (ordem.status === STATUS_ORDEM.PENDENTE ||
      ordem.status === STATUS_ORDEM.EM_ANDAMENTO)
  );
}

// Data em que a ordem saiu do fluxo ativo (conclusão, impedimento ou cancelamento)
export function dataFinalizacao(ordem) {
  return ordem.concluidaEm ?? ordem.impedimento?.registradoEm ?? null;
}

// Converte os dados salvos em versões anteriores (@eco_ordem_servico_v2 e
// @eco_ordens_concluidas) para o formato atual (lista de ordens com id).
export function migrarOrdensAntigas(ordemAntiga, concluidasAntigas) {
  const normalizar = (ordem) => ({ ...ordem, id: ordem.id ?? String(ordem.numero) });
  const valida = (ordem) => !!ordem && !!ordem.numero && !!ordem.trechoId;

  return {
    ordens: valida(ordemAntiga) ? [normalizar(ordemAntiga)] : [],
    historico: (concluidasAntigas ?? []).filter(valida).map(normalizar),
  };
}

export function formatarDataHora(iso) {
  if (!iso) return "";

  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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

// Pontos críticos separados por no máximo esta distância entram na mesma faixa
const DISTANCIA_MAX_ENTRE_CRITICOS_KM = 4;

export function chaveSugestao(sugestao) {
  return `${sugestao.trechoId}:${sugestao.kmInicial}:${sugestao.kmFinal}`;
}

// RF03: a partir dos pontos críticos (vermelhos) do mapa, agrupa os pontos
// próximos de cada trecho em faixas de km e devolve sugestões de ordem de
// serviço, da mais para a menos crítica. Ignora pontos aguardando escaneamento
// e faixas já cobertas por uma ordem aberta (pendente ou em andamento).
export function sugerirOrdens(mapData, ordensAbertas = [], limite = 5) {
  const sugestoes = [];

  Object.values(mapData.trechos).forEach((trecho) => {
    const criticos = trecho.pontos
      .filter(
        (ponto) =>
          ponto.status !== STATUS_AGUARDANDO &&
          classificarAltura(ponto.alturaVegetacao) === "vermelho"
      )
      .sort((a, b) => a.km - b.km);

    let grupo = [];

    const fecharGrupo = () => {
      if (grupo.length === 0) return;

      const sugestao = {
        trechoId: trecho.id,
        trechoNome: trecho.nome,
        kmInicial: grupo[0].km,
        kmFinal: grupo[grupo.length - 1].km,
        quantidade: grupo.length,
        alturaMaxima: Math.max(...grupo.map((ponto) => ponto.alturaVegetacao)),
      };

      sugestoes.push({ ...sugestao, chave: chaveSugestao(sugestao) });
      grupo = [];
    };

    criticos.forEach((ponto) => {
      const ultimo = grupo[grupo.length - 1];

      if (ultimo && ponto.km - ultimo.km > DISTANCIA_MAX_ENTRE_CRITICOS_KM) {
        fecharGrupo();
      }

      grupo.push(ponto);
    });

    fecharGrupo();
  });

  return sugestoes
    .filter(
      (sugestao) =>
        !ordensAbertas.some(
          (ordem) =>
            ordem.trechoId === sugestao.trechoId &&
            !(sugestao.kmFinal < ordem.kmInicial || sugestao.kmInicial > ordem.kmFinal)
        )
    )
    .sort(
      (a, b) =>
        b.quantidade - a.quantidade ||
        b.alturaMaxima - a.alturaMaxima ||
        a.kmInicial - b.kmInicial
    )
    .slice(0, limite);
}

// Aplica sobre os trechos as roçadas concluídas (da mais antiga para a mais
// nova): os pontos já escaneados dentro da faixa recebem a altura final e são
// reclassificados. Pontos aguardando escaneamento continuam sem leitura.
export function aplicarRocadas(trechos, rocadas) {
  const resultado = { ...trechos };

  [...rocadas].reverse().forEach((rocada) => {
    // Impedimentos e cancelamentos não alteram a vegetação do mapa
    if (rocada.status !== STATUS_ORDEM.CONCLUIDA) return;

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
