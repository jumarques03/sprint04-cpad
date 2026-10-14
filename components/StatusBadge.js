import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { STATUS_ORDEM_COR } from "../utils/ordemServico";

export default function StatusBadge({ status, style }) {
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: STATUS_ORDEM_COR[status] ?? "#6A6A6A" },
        style,
      ]}
    >
      <Text style={styles.texto}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },

  texto: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});
