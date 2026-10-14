import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { mockUser } from "../data/mockUser";
import { mockMap } from "../data/mockMap";
import { mockMonitoring } from "../data/mockMonitoring";
import { mockNotifications } from "../data/mockNotifications";
import { mockOrdemServico } from "../data/mockOrdemServico";
import { aplicarRocadas, descreverLocalizacao } from "../utils/ordemServico";
import { STATUS_AGUARDANDO } from "../utils/vegetationStatus";

const MockDataContext = createContext();

export function MockDataProvider({ children }) {
  const [user, setUser] = useState(mockUser);
  const [mapData, setMapData] = useState(mockMap);
  const [monitoring, setMonitoring] = useState(mockMonitoring);
  const [notifications, setNotifications] = useState([]);
  const [ordemServico, setOrdemServico] = useState(null);
  const [ordensConcluidas, setOrdensConcluidas] = useState([]);

  // 1. Carrega as notificações persistidas ao iniciar a aplicação
  useEffect(() => {
    carregarNotificacoes();
    carregarOrdemServico();
    carregarOrdensConcluidas();
  }, []);

  const carregarNotificacoes = async () => {
    try {
      const stored = await AsyncStorage.getItem("@eco_notifications");
      if (stored !== null) {
        setNotifications(JSON.parse(stored));
      } else {
        setNotifications(mockNotifications);
        await AsyncStorage.setItem("@eco_notifications", JSON.stringify(mockNotifications));
      }
    } catch (error) {
      console.error("Erro ao carregar notificações", error);
    }
  };

  const carregarOrdemServico = async () => {
    try {
      const stored = await AsyncStorage.getItem("@eco_ordem_servico_v2");
      if (stored !== null) {
        setOrdemServico(JSON.parse(stored));
      } else {
        setOrdemServico(mockOrdemServico);
        await AsyncStorage.setItem("@eco_ordem_servico_v2", JSON.stringify(mockOrdemServico));
      }
    } catch (error) {
      console.error("Erro ao carregar ordem de serviço", error);
    }
  };

  // Roçadas concluídas são reaplicadas sobre o mock do mapa a cada abertura do app
  const carregarOrdensConcluidas = async () => {
    try {
      const stored = await AsyncStorage.getItem("@eco_ordens_concluidas");
      if (stored !== null) {
        const concluidas = JSON.parse(stored);
        setOrdensConcluidas(concluidas);
        setMapData((prev) => ({
          ...prev,
          trechos: aplicarRocadas(prev.trechos, concluidas),
        }));
      }
    } catch (error) {
      console.error("Erro ao carregar ordens concluídas", error);
    }
  };

  const iniciarMonitoramento = () => {
    setMonitoring((prev) => ({
      ...prev,
      ativo: true,
      cameraStatus: "ativa",
      tempoMonitoramento: "00:32:15",
    }));

    adicionarAviso({
      title: "Monitoramento iniciado",
      message: `A visão computacional foi ativada para ${user.equipe}.`,
    });
  };

  const encerrarMonitoramento = () => {
    setMonitoring((prev) => ({
      ...prev,
      ativo: false,
      cameraStatus: "desligada",
      tempoMonitoramento: "00:00:00",
    }));

    adicionarAviso({
      title: "Monitoramento encerrado",
      message: `O monitoramento da ${user.equipe} foi encerrado.`,
    });
  };

  // 2. Atualiza a função para guardar o novo aviso no AsyncStorage
  const adicionarAviso = async ({ title, message }) => {
    const novoAviso = {
        id: Date.now(),
        title,
        message,
        date: new Date().toLocaleDateString("pt-BR"),
        hour: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        }),
        read: false,
    };

    setNotifications((prev) => {
      const atualizadas = [novoAviso, ...prev];
      AsyncStorage.setItem("@eco_notifications", JSON.stringify(atualizadas));
      return atualizadas;
    });
  };

  // 3. Nova função exposta para os ecrãs marcarem notificações como lidas
  const marcarComoLida = async (id) => {
    setNotifications((prev) => {
      const atualizadas = prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      );
      AsyncStorage.setItem("@eco_notifications", JSON.stringify(atualizadas));
      return atualizadas;
    });
  };

  const criarOrdemServico = async ({ tipo, trechoId, kmInicial, kmFinal, horario, descricao }) => {
    const novaOrdem = {
      numero: Date.now().toString().slice(-4),
      tipo,
      trechoId,
      kmInicial,
      kmFinal,
      endereco: descreverLocalizacao(mapData, trechoId, kmInicial, kmFinal),
      horario,
      descricao,
      status: "Pendente",
    };

    setOrdemServico(novaOrdem);

    try {
      await AsyncStorage.setItem("@eco_ordem_servico_v2", JSON.stringify(novaOrdem));
    } catch (error) {
      console.error("Erro ao salvar ordem de serviço", error);
    }

    adicionarAviso({
      title: "Ordem de serviço criada",
      message: `A ordem de serviço #${novaOrdem.numero} foi criada para a ${user.equipe}.`,
    });
  };

  // Conclui a ordem ativa: atualiza os pontos do mapa dentro da faixa da ordem
  // com a altura final, guarda no histórico e deixa a ordem ativa vazia.
  const concluirOrdemServico = async ({ alturaInicial, alturaFinal, observacoes, fotoUri }) => {
    if (!ordemServico) return;

    const registro = {
      ...ordemServico,
      status: "Concluída",
      alturaInicial,
      alturaFinal,
      observacoes,
      fotoUri,
      concluidaEm: new Date().toISOString(),
    };

    const concluidas = [registro, ...ordensConcluidas];

    setOrdensConcluidas(concluidas);
    setMapData((prev) => ({
      ...prev,
      trechos: aplicarRocadas(prev.trechos, [registro]),
    }));
    setOrdemServico(null);

    try {
      await AsyncStorage.setItem("@eco_ordens_concluidas", JSON.stringify(concluidas));
      await AsyncStorage.setItem("@eco_ordem_servico_v2", JSON.stringify(null));
    } catch (error) {
      console.error("Erro ao salvar ordem concluída", error);
    }

    adicionarAviso({
      title: "Ordem de serviço concluída",
      message: `A ordem #${registro.numero} foi concluída. A vegetação do Km ${registro.kmInicial} ao Km ${registro.kmFinal} foi atualizada no mapa.`,
    });
  };

  const atualizarPontosTrecho = (trechoKey) => {
    const sorteio = Math.random();
    const resultado = sorteio < 0.7 ? "sucesso" : sorteio < 0.85 ? "vazio" : "erro";

    if (resultado === "erro") {
      return { status: "erro" };
    }

    setMapData((prev) => {
      const trechoAtual = prev.trechos[trechoKey];
      const trechoOriginal = mockMap.trechos[trechoKey];
      if (!trechoAtual || !trechoOriginal) return prev;

      const agora = new Date().toISOString();

      const novosPontos =
        resultado === "vazio"
          ? []
          : trechoOriginal.pontos.map((ponto) =>
              ponto.status === STATUS_AGUARDANDO
                ? ponto
                : { ...ponto, timestamp: agora }
            );

      // Pontos já roçados continuam com a leitura pós-roçada
      const trechoAtualizado = aplicarRocadas(
        { [trechoKey]: { ...trechoAtual, pontos: novosPontos } },
        ordensConcluidas
      )[trechoKey];

      return {
        ...prev,
        trechos: {
          ...prev.trechos,
          [trechoKey]: trechoAtualizado,
        },
      };
    });

    return { status: resultado };
  };

  const value = {
    user,
    mapData,
    monitoring,
    notifications,
    ordemServico,
    ordensConcluidas,

    setUser,
    setMapData,
    setMonitoring,
    setNotifications,

    iniciarMonitoramento,
    encerrarMonitoramento,
    adicionarAviso,
    marcarComoLida,
    criarOrdemServico,
    concluirOrdemServico,
    atualizarPontosTrecho,
  };

  return (
    <MockDataContext.Provider value={value}>
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  const context = useContext(MockDataContext);

  if (!context) {
    throw new Error("useMockData deve ser usado dentro de um MockDataProvider");
  }

  return context;
}