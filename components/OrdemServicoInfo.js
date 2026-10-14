import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StatusBadge from "./StatusBadge";

function InfoLinha({ icon, label, value }) {
  return (
    <View style={styles.linha}>
      <Ionicons name={icon} size={20} color="#081EAD" />

      <View style={styles.linhaTexto}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

export default function OrdemServicoInfo({ ordem, team }) {
  return (
    <View style={styles.card}>
      <View style={styles.topo}>
        <Text style={styles.numero}>Ordem de Serviço #{ordem.numero}</Text>

        <StatusBadge status={ordem.status} />
      </View>

      <InfoLinha icon="construct-outline" label="Tipo de serviço" value={ordem.tipo} />
      <InfoLinha icon="location-outline" label="Localização" value={ordem.endereco} />
      <InfoLinha icon="time-outline" label="Horário" value={ordem.horario} />
      <InfoLinha icon="people-outline" label="Equipe" value={team} />

      {!!ordem.descricao && (
        <InfoLinha
          icon="document-text-outline"
          label="Observações"
          value={ordem.descricao}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#E5E7FF",
    borderRadius: 16,
    padding: 20,
  },

  topo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    gap: 8,
  },

  numero: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#081EAD",
  },

  linha: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 14,
  },

  linhaTexto: {
    flex: 1,
  },

  label: {
    fontSize: 13,
    color: "#6A6A6A",
  },

  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#081EAD",
    marginTop: 2,
  },
});
