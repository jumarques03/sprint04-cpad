import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import StatusBadge from "./StatusBadge";

export default function OrdemResumoItem({ ordem, selecionada, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.item, selecionada && styles.itemSelecionado]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.texto}>
        <Text style={styles.numero}>Ordem #{ordem.numero}</Text>
        <Text style={styles.detalhe}>{ordem.tipo}</Text>
        <Text style={styles.detalhe}>{ordem.endereco}</Text>
      </View>

      <StatusBadge status={ordem.status} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: 14,
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#E5E7FF",
  },

  itemSelecionado: {
    borderColor: "#081EAD",
  },

  texto: {
    flex: 1,
  },

  numero: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#081EAD",
  },

  detalhe: {
    fontSize: 13,
    color: "#4E4E4E",
    marginTop: 2,
  },
});
