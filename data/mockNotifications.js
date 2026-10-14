export const mockNotifications = [
  {
    id: 1,
    title: "Monitoramento iniciado",
    message: "A visão computacional foi ativada para a Equipe Alpha 6766.",
    date: new Date().toLocaleDateString("pt-BR"),
    hour: new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    read: false,
  },
  {
    id: 2,
    title: "Trecho em atenção",
    message: "O Km 121,5 do Trecho Leste está com vegetação crítica (vermelho).",
    date: new Date().toLocaleDateString("pt-BR"),
    hour: new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    read: false,
  },
];