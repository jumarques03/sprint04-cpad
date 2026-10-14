// Ordem de serviço usada como valor inicial do app. Ela aponta para uma faixa
// real do mapa (trecho + km), então os pontos do Rodoanel nesse intervalo são
// os pontos da ordem. Depois da primeira carga o valor passa a ser guardado no
// AsyncStorage (@eco_ordem_servico_v2). Troque por `null` para iniciar sem ordem.
export const mockOrdemServico = {
  numero: "1024",
  tipo: "Roçada de vegetação",
  trechoId: "leste",
  kmInicial: 120,
  kmFinal: 123,
  endereco: "Rodoanel Mário Covas (SP-021) – Trecho Leste, Km 120–123",
  horario: "09:00 - 16:00",
  descricao:
    "Roçada da faixa lateral com foco nos pontos classificados como críticos pela visão computacional.",
  status: "Pendente",
};
