import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function EmptyState({ title, message, icon = "map-outline" }) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={40} color="#8A8A8A" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#202020",
    marginTop: 12,
    textAlign: "center",
  },

  message: {
    fontSize: 14,
    color: "#4E4E4E",
    marginTop: 6,
    textAlign: "center",
    lineHeight: 20,
  },
});
