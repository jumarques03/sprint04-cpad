import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

import Header from "../../components/Header";
import EmptyState from "../../components/EmptyState";
import OrdemHistoricoCard from "../../components/OrdemHistoricoCard";
import EvidenciaDetalhe from "../../components/EvidenciaDetalhe";
import { useMockData } from "../../context/MockDataContext";
import { dataFinalizacao } from "../../utils/ordemServico";

export default function HistoricoOrdens() {
  const { abrir } = useLocalSearchParams();
  const { ordensConcluidas } = useMockData();

  const [ordemSelecionada, setOrdemSelecionada] = useState(null);

  // Da mais recente para a mais antiga
  const ordensOrdenadas = useMemo(
    () =>
      [...ordensConcluidas].sort(
        (a, b) =>
          new Date(dataFinalizacao(b) ?? 0) - new Date(dataFinalizacao(a) ?? 0)
      ),
    [ordensConcluidas]
  );

  // Ao chegar da conclusão de uma ordem, já abre o registro dela
  useEffect(() => {
    if (!abrir) return;

    const ordem = ordensConcluidas.find((item) => item.numero === String(abrir));
    if (ordem) setOrdemSelecionada(ordem);
  }, [abrir, ordensConcluidas]);

  return (
    <View style={styles.container}>
      <Header title="Histórico de Ordens" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {ordensOrdenadas.length === 0 ? (
          <EmptyState
            icon="time-outline"
            title="Nenhuma ordem no histórico"
            message="As ordens concluídas, impedidas ou canceladas aparecem aqui, com a evidência da roçada."
          />
        ) : (
          <>
            <Text style={styles.resumo}>
              {ordensOrdenadas.length}{" "}
              {ordensOrdenadas.length === 1 ? "ordem finalizada" : "ordens finalizadas"}
            </Text>

            {ordensOrdenadas.map((ordem) => (
              <OrdemHistoricoCard
                key={ordem.id}
                ordem={ordem}
                onPress={() => setOrdemSelecionada(ordem)}
              />
            ))}
          </>
        )}
      </ScrollView>

      <EvidenciaDetalhe
        ordem={ordemSelecionada}
        visible={!!ordemSelecionada}
        onClose={() => setOrdemSelecionada(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    padding: 24,
    paddingBottom: 40,
  },

  resumo: {
    fontSize: 14,
    color: "#6A6A6A",
  },
});
