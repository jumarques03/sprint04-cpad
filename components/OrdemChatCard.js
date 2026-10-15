import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import StatusBadge from "./StatusBadge";
import { formatarKm } from "../utils/ordemServico";

function Detalhe({ icon, principal, secundario }) {
  return (
    <View style={styles.detalhe}>
      <Ionicons name={icon} size={18} color="#081EAD" style={styles.detalheIcone} />

      <View style={styles.detalheTexto}>
        <Text style={styles.principal}>{principal}</Text>
        {!!secundario && <Text style={styles.secundario}>{secundario}</Text>}
      </View>
    </View>
  );
}

// Resumo da ordem de serviço exibido no topo da conversa do assistente
export default function OrdemChatCard({ ordem, rodovia, trechoNome }) {
  return (
    <View style={styles.card}>
      <View style={styles.topo}>
        <View style={styles.tituloArea}>
          <View style={styles.iconeCirculo}>
            <Ionicons name="clipboard-outline" size={20} color="#FFFFFF" />
          </View>

          <View>
            <Text style={styles.legenda}>ORDEM DE SERVIÇO</Text>
            <Text style={styles.numero}>#{ordem.numero}</Text>
          </View>
        </View>

        <StatusBadge status={ordem.status} />
      </View>

      <Text style={styles.tipo}>{ordem.tipo}</Text>

      <View style={styles.divisor} />

      <Detalhe
        icon="location-outline"
        principal={rodovia}
        secundario={`${trechoNome} · Km ${formatarKm(ordem.kmInicial)}–${formatarKm(ordem.kmFinal)}`}
      />

      <Detalhe icon="time-outline" principal={ordem.horario} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#E5E7FF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 22,
  },

  topo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  tituloArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconeCirculo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#081EAD",
    alignItems: "center",
    justifyContent: "center",
  },

  legenda: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#5C5C5C",
    letterSpacing: 0.5,
  },

  numero: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#081EAD",
  },

  tipo: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#202020",
    marginTop: 14,
  },

  divisor: {
    height: 1,
    backgroundColor: "#C9CDFA",
    marginVertical: 14,
  },

  detalhe: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
  },

  detalheIcone: {
    marginTop: 1,
  },

  detalheTexto: {
    flex: 1,
  },

  principal: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#081EAD",
  },

  secundario: {
    fontSize: 14,
    color: "#4E4E4E",
    marginTop: 2,
  },
});
