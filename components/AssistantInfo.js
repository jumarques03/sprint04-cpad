import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AssistantInfo({ title, description }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="chatbox-ellipses-outline" size={28} color="#081EAD" />
      </View>

      <View style={styles.textos}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    marginBottom: 28,
  },

  textos: {
    flex: 1,
  },

    iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#E5E7FF",
    justifyContent: "center",
    alignItems: "center",
    },

    title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#081EAD",
    },

  description: {
    fontSize: 14,
    color: "#5C5C5C",
    lineHeight: 22,
    maxWidth: 240,
  },
});