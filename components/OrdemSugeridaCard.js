import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import BlueButton from "./BlueButton";
import { formatarKm } from "../utils/ordemServico";

export default function OrdemSugeridaCard({ sugestao, onUsar }) {
  return (
    <View style={styles.card}>
      <View style={styles.topo}>
        <Ionicons name="sparkles" size={18} color="#081EAD" />
        <Text style={styles.titulo}>OS sugerida pela IA</Text>
      </View>

      <Text style={styles.local}>
        {sugestao.trechoNome} · Km {formatarKm(sugestao.kmInicial)}–{formatarKm(sugestao.kmFinal)}
      </Text>

      <Text style={styles.detalhe}>
        {sugestao.quantidade}{" "}
        {sugestao.quantidade === 1 ? "ponto crítico" : "pontos críticos"} · vegetação de
        até {formatarKm(sugestao.alturaMaxima)} cm
      </Text>

      <BlueButton
        title="Usar esta sugestão"
        onPress={() => onUsar(sugestao)}
        style={styles.botao}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    marginTop: 10,
    borderRadius: 14,
    backgroundColor: "#E5E7FF",
  },

  topo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  titulo: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#081EAD",
  },

  local: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#202020",
    marginTop: 6,
  },

  detalhe: {
    fontSize: 13,
    color: "#4E4E4E",
    marginTop: 2,
  },

  botao: {
    height: 44,
    marginTop: 12,
  },
});
