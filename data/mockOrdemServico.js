// Ordem de serviço usada como valor inicial do app. Depois da primeira carga
// o valor passa a ser guardado no AsyncStorage (@eco_ordem_servico).
// Troque por `null` para iniciar sem nenhuma ordem de serviço.
export const mockOrdemServico = {
  numero: "1024",
  tipo: "Roçada de vegetação",
  endereco: "Rodovia BR111 KM 121",
  km: "121",
  horario: "09:00 - 16:00",
  descricao:
    "Roçada da faixa lateral com foco nos pontos classificados como críticos pela visão computacional.",
  status: "Pendente",
};
