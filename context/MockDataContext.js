import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { mockUser } from "../data/mockUser";
import { mockMap } from "../data/mockMap";
import { mockMonitoring } from "../data/mockMonitoring";
import { mockNotifications } from "../data/mockNotifications";
import { STATUS_AGUARDANDO } from "../utils/vegetationStatus";

const MockDataContext = createContext();

export function MockDataProvider({ children }) {
  const [user, setUser] = useState(mockUser);
  const [mapData, setMapData] = useState(mockMap);
  const [monitoring, setMonitoring] = useState(mockMonitoring);
  const [notifications, setNotifications] = useState([]);

  // 1. Carrega as notificações persistidas ao iniciar a aplicação
  useEffect(() => {
    carregarNotificacoes();
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

      return {
        ...prev,
        trechos: {
          ...prev.trechos,
          [trechoKey]: { ...trechoAtual, pontos: novosPontos },
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

    setUser,
    setMapData,
    setMonitoring,
    setNotifications,

    iniciarMonitoramento,
    encerrarMonitoramento,
    adicionarAviso,
    marcarComoLida,
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