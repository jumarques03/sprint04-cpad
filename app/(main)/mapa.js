import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import InfoResume from "../../components/InfoResume";
import IAResumeBox from "../../components/IAResumeBox";
import ChatHeader from "../../components/Header";
import TrechoSelector from "../../components/TrechoSelector";
import RodoanelMap from "../../components/RodoanelMap";
import PontoDetailModal from "../../components/PontoDetailModal";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import BorderButton from "../../components/BorderButton";
import { useMockData } from "../../context/MockDataContext";
import { STATUS_INFO, STATUS_AGUARDANDO } from "../../utils/vegetationStatus";

function gerarResumo(nome, pontos) {
  if (!pontos.length) {
    return `Nenhum ponto escaneado ainda no ${nome}.`;
  }

  const criticos = pontos.filter((p) => p.status === "vermelho").length;
  const atencao = pontos.filter((p) => p.status === "amarelo").length;
  const pendentes = pontos.filter((p) => p.status === STATUS_AGUARDANDO).length;

  let texto = `${nome}: ${pontos.length} pontos monitorados.`;

  if (criticos > 0) {
    texto += ` ${criticos} em estado crítico (vermelho), priorize a inspeção.`;
  }
  if (atencao > 0) {
    texto += ` ${atencao} em atenção (amarelo).`;
  }
  if (pendentes > 0) {
    texto += ` ${pendentes} pontos aguardando escaneamento, trecho ainda em obras.`;
  }
  if (criticos === 0 && atencao === 0 && pendentes === 0) {
    texto += " Vegetação dentro do padrão em todo o trecho.";
  }

  return texto;
}

export default function Mapa() {
  const { user, ordemServico, mapData, atualizarPontosTrecho } = useMockData();

  const [trechoSelecionado, setTrechoSelecionado] = useState("todos");
  const [pontoSelecionado, setPontoSelecionado] = useState(null);
  const [statusCarregamento, setStatusCarregamento] = useState({});
  const [mapaEmUso, setMapaEmUso] = useState(false);

  const trechosParaSelector = useMemo(
    () => [
      { id: "todos", nome: "Todos", cobertura: "operacional" },
      ...Object.values(mapData.trechos),
    ],
    [mapData.trechos]
  );

  const trechoAtual =
    trechoSelecionado !== "todos" ? mapData.trechos[trechoSelecionado] : null;

  const erroAtual = statusCarregamento[trechoSelecionado] === "erro";

  const textoResumo =
    trechoSelecionado === "todos"
      ? gerarResumo(
          "Rodoanel Mário Covas",
          Object.values(mapData.trechos).flatMap((trecho) => trecho.pontos)
        )
      : gerarResumo(trechoAtual.nome, trechoAtual.pontos);

  const handleAtualizar = () => {
    const resultado = atualizarPontosTrecho(trechoSelecionado);
    setStatusCarregamento((prev) => ({ ...prev, [trechoSelecionado]: resultado.status }));
  };

  const handleSelecionarTrecho = (id) => {
    setTrechoSelecionado(id);
  };

  return (
    <View style={styles.container}>
      <ChatHeader title="Mapeamento" />

      <ScrollView
        scrollEnabled={!mapaEmUso}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoPadding}>
          <InfoResume
            team={user.equipe}
            serviceOrder={ordemServico?.numero}
            address={ordemServico?.endereco}
            schedule={ordemServico?.horario}
            status={ordemServico?.status}
          />
        </View>

        <TrechoSelector
          trechos={trechosParaSelector}
          trechoSelecionado={trechoSelecionado}
          onSelecionar={handleSelecionarTrecho}
        />

        <View style={styles.legenda}>
          {Object.entries(STATUS_INFO).map(([chave, info]) => (
            <View style={styles.legendaItem} key={chave}>
              <View style={[styles.legendaDot, { backgroundColor: info.color }]} />
              <Text style={styles.legendaTexto}>{info.label}</Text>
            </View>
          ))}
        </View>

        {erroAtual ? (
          <ErrorState
            message="Não foi possível carregar os pontos deste trecho. Verifique a conexão do dispositivo embarcado e tente novamente."
            onRetry={handleAtualizar}
          />
        ) : trechoAtual && trechoAtual.pontos.length === 0 ? (
          <EmptyState
            title="Nenhum trecho escaneado ainda"
            message={`O ${trechoAtual.nome} ainda não possui pontos monitorados. Inicie o monitoramento para começar a coleta.`}
          />
        ) : (
          <RodoanelMap
            trechos={mapData.trechos}
            trechoSelecionado={trechoSelecionado}
            regiaoInicial={mapData.regiaoInicial}
            onSelecionarPonto={setPontoSelecionado}
            onInteracaoMapa={setMapaEmUso}
          />
        )}

        {trechoSelecionado !== "todos" && !erroAtual && (
          <View style={styles.botaoAtualizarArea}>
            <BorderButton
              title="Atualizar pontos do trecho"
              onPress={handleAtualizar}
              style={styles.botaoAtualizar}
            />
          </View>
        )}

        <IAResumeBox text={textoResumo} />
      </ScrollView>

      <PontoDetailModal
        ponto={pontoSelecionado}
        nomeTrecho={
          pontoSelecionado ? mapData.trechos[pontoSelecionado.trecho].nome : ""
        }
        visible={!!pontoSelecionado}
        onClose={() => setPontoSelecionado(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContainer: {
    paddingBottom: 40,
  },

  infoPadding: {
    paddingLeft: 24,
  },

  legenda: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 14,
  },

  legendaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  legendaDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  legendaTexto: {
    fontSize: 13,
    color: "#4E4E4E",
    fontWeight: "600",
  },

  botaoAtualizarArea: {
    paddingHorizontal: 24,
  },

  botaoAtualizar: {
    height: 48,
    marginTop: 14,
  },
});
