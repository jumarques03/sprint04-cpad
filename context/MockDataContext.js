import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { mockUser } from "../data/mockUser";
import { mockMap } from "../data/mockMap";
import { mockMonitoring } from "../data/mockMonitoring";
import { mockNotifications } from "../data/mockNotifications";
import { mockOrdemServico, USAR_ORDEM_INICIAL } from "../data/mockOrdemServico";
import {
  STATUS_ORDEM,
  NUMERO_INICIAL_ORDEM,
  aplicarRocadas,
  descreverLocalizacao,
  migrarOrdensAntigas,
} from "../utils/ordemServico";
import { STATUS_AGUARDANDO } from "../utils/vegetationStatus";

const MockDataContext = createContext();

const CHAVE_ORDENS = "@eco_ordens_v3";
const CHAVE_HISTORICO = "@eco_ordens_historico_v3";
const CHAVE_CONTADOR = "@eco_ordem_contador";
// Chaves de versões anteriores, lidas apenas para migrar os dados
const CHAVE_ORDEM_V2 = "@eco_ordem_servico_v2";
const CHAVE_CONCLUIDAS_V2 = "@eco_ordens_concluidas";

export function MockDataProvider({ children }) {
  const [user, setUser] = useState(mockUser);
  const [mapData, setMapData] = useState(mockMap);
  const [monitoring, setMonitoring] = useState(mockMonitoring);
  const [notifications, setNotifications] = useState([]);

  // Ordens pendentes/em andamento (ordens) e histórico de ordens finalizadas
  // (concluídas, impedidas e canceladas). ordemServico é a ordem "ativa".
  const [ordens, setOrdens] = useState([]);
  const [ordemAtivaId, setOrdemAtivaId] = useState(null);
  const [ordensConcluidas, setOrdensConcluidas] = useState([]);
  const [dadosCarregados, setDadosCarregados] = useState(false);

  const ordemServico =
    ordens.find((ordem) => ordem.status === STATUS_ORDEM.EM_ANDAMENTO) ??
    ordens.find((ordem) => ordem.id === ordemAtivaId) ??
    ordens[0] ??
    null;

  // 1. Carrega os dados persistidos ao iniciar a aplicação
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    await carregarNotificacoes();
    await carregarOrdens();
    setDadosCarregados(true);
  };

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

  const salvarOrdens = async (novasOrdens, ativaId) => {
    try {
      await AsyncStorage.setItem(
        CHAVE_ORDENS,
        JSON.stringify({ ordens: novasOrdens, ativaId })
      );
    } catch (error) {
      console.error("Erro ao salvar ordens de serviço", error);
    }
  };

  const salvarHistorico = async (historico) => {
    try {
      await AsyncStorage.setItem(CHAVE_HISTORICO, JSON.stringify(historico));
    } catch (error) {
      console.error("Erro ao salvar histórico de ordens", error);
    }
  };

  // Garante que o contador nunca repita um número já usado por uma ordem existente
  const garantirContador = async (todasAsOrdens) => {
    const maiorNumero = Math.max(
      0,
      ...todasAsOrdens.map((ordem) => parseInt(ordem.numero, 10) || 0)
    );
    const stored = await AsyncStorage.getItem(CHAVE_CONTADOR);
    const atual = stored !== null ? parseInt(stored, 10) : 0;
    const minimo = Math.max(NUMERO_INICIAL_ORDEM, maiorNumero + 1);

    if (atual < minimo) {
      await AsyncStorage.setItem(CHAVE_CONTADOR, String(minimo));
    }
  };

  const gerarNumeroOrdem = async () => {
    const stored = await AsyncStorage.getItem(CHAVE_CONTADOR);
    const atual = stored !== null ? parseInt(stored, 10) : NUMERO_INICIAL_ORDEM;
    await AsyncStorage.setItem(CHAVE_CONTADOR, String(atual + 1));
    return String(atual);
  };

  // Carrega ordens e histórico (formato v3). Se ainda não existirem, migra os
  // dados antigos (v2) e, só se USAR_ORDEM_INICIAL estiver ligado, usa o mock.
  const carregarOrdens = async () => {
    try {
      const [storedOrdens, storedHistorico] = await Promise.all([
        AsyncStorage.getItem(CHAVE_ORDENS),
        AsyncStorage.getItem(CHAVE_HISTORICO),
      ]);

      let lista = [];
      let ativaId = null;
      let historico = [];

      if (storedOrdens !== null) {
        const dados = JSON.parse(storedOrdens);
        lista = dados.ordens ?? [];
        ativaId = dados.ativaId ?? null;
        historico = storedHistorico !== null ? JSON.parse(storedHistorico) : [];
      } else {
        const [storedV2, storedConcluidasV2] = await Promise.all([
          AsyncStorage.getItem(CHAVE_ORDEM_V2),
          AsyncStorage.getItem(CHAVE_CONCLUIDAS_V2),
        ]);

        const migrado = migrarOrdensAntigas(
          storedV2 !== null ? JSON.parse(storedV2) : null,
          storedConcluidasV2 !== null ? JSON.parse(storedConcluidasV2) : []
        );

        lista = migrado.ordens;
        historico = migrado.historico;

        if (USAR_ORDEM_INICIAL && storedV2 === null && storedConcluidasV2 === null) {
          lista = [mockOrdemServico];
        }

        ativaId = lista[0]?.id ?? null;

        await salvarOrdens(lista, ativaId);
        await salvarHistorico(historico);
      }

      setOrdens(lista);
      setOrdemAtivaId(ativaId);
      setOrdensConcluidas(historico);
      setMapData((prev) => ({
        ...prev,
        trechos: aplicarRocadas(prev.trechos, historico),
      }));

      await garantirContador([...lista, ...historico]);
    } catch (error) {
      console.error("Erro ao carregar ordens de serviço", error);
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
    const numero = await gerarNumeroOrdem();

    const novaOrdem = {
      id: numero,
      numero,
      tipo,
      trechoId,
      kmInicial,
      kmFinal,
      endereco: descreverLocalizacao(mapData, trechoId, kmInicial, kmFinal),
      horario,
      descricao,
      status: STATUS_ORDEM.PENDENTE,
      criadaEm: new Date().toISOString(),
    };

    const atualizadas = [...ordens, novaOrdem];

    setOrdens(atualizadas);
    setOrdemAtivaId(novaOrdem.id);
    await salvarOrdens(atualizadas, novaOrdem.id);

    adicionarAviso({
      title: "Ordem de serviço criada",
      message: `A ordem de serviço #${novaOrdem.numero} foi criada para a ${user.equipe}.`,
    });

    return novaOrdem;
  };

  const selecionarOrdem = async (id) => {
    setOrdemAtivaId(id);
    await salvarOrdens(ordens, id);
  };

  // Pendente -> Em andamento. Só uma ordem pode ficar em andamento por vez.
  const iniciarOrdemServico = async (id = ordemServico?.id) => {
    const ordem = ordens.find((item) => item.id === id);

    if (!ordem) {
      return { sucesso: false, mensagem: "Nenhuma ordem de serviço para iniciar." };
    }

    if (ordem.status !== STATUS_ORDEM.PENDENTE) {
      return { sucesso: false, mensagem: "Esta ordem de serviço já foi iniciada." };
    }

    if (ordens.some((item) => item.status === STATUS_ORDEM.EM_ANDAMENTO)) {
      return {
        sucesso: false,
        mensagem:
          "Já existe uma ordem em andamento. Conclua-a ou registre um impedimento antes de iniciar outra.",
      };
    }

    const iniciada = {
      ...ordem,
      status: STATUS_ORDEM.EM_ANDAMENTO,
      iniciadaEm: new Date().toISOString(),
    };

    const atualizadas = ordens.map((item) => (item.id === id ? iniciada : item));

    setOrdens(atualizadas);
    setOrdemAtivaId(id);
    await salvarOrdens(atualizadas, id);

    adicionarAviso({
      title: "Ordem de serviço iniciada",
      message: `A ordem #${iniciada.numero} está em andamento (${iniciada.endereco}).`,
    });

    return { sucesso: true };
  };

  // Conclui a ordem ativa: atualiza os pontos do mapa dentro da faixa da ordem
  // com a altura final, guarda no histórico e remove a ordem da lista ativa.
  const concluirOrdemServico = async ({
    alturaInicial,
    alturaFinal,
    observacoes,
    fotoUri,
    evidenciaPermanente = true,
  }) => {
    if (!ordemServico) return null;

    const registro = {
      ...ordemServico,
      status: STATUS_ORDEM.CONCLUIDA,
      alturaInicial,
      alturaFinal,
      observacoes,
      fotoUri,
      evidenciaPermanente,
      concluidaEm: new Date().toISOString(),
    };

    const restantes = ordens.filter((ordem) => ordem.id !== registro.id);
    const historico = [registro, ...ordensConcluidas];

    setOrdens(restantes);
    setOrdemAtivaId(restantes[0]?.id ?? null);
    setOrdensConcluidas(historico);
    setMapData((prev) => ({
      ...prev,
      trechos: aplicarRocadas(prev.trechos, [registro]),
    }));

    await salvarOrdens(restantes, restantes[0]?.id ?? null);
    await salvarHistorico(historico);

    adicionarAviso({
      title: "Ordem de serviço concluída",
      message: `A ordem #${registro.numero} foi concluída. A vegetação do Km ${registro.kmInicial} ao Km ${registro.kmFinal} foi atualizada no mapa.`,
    });

    return registro;
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
    ordens,
    ordemServico,
    ordensConcluidas,
    dadosCarregados,

    setUser,
    setMapData,
    setMonitoring,
    setNotifications,

    iniciarMonitoramento,
    encerrarMonitoramento,
    adicionarAviso,
    marcarComoLida,
    criarOrdemServico,
    selecionarOrdem,
    iniciarOrdemServico,
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
