// Opção para demonstrações: com USAR_ORDEM_INICIAL = true, a primeira abertura
// do app já traz esta ordem de serviço pendente. Por padrão o app começa sem
// ordem ativa e o operador cria uma (ou usa uma sugestão automática da IA).
// A ordem aponta para uma faixa real do mapa (trecho + km).
export const USAR_ORDEM_INICIAL = false;

export const mockOrdemServico = {
  id: "1024",
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
