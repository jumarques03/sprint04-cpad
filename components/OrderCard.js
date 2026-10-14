import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function OrderCard({ title, icon, color, onPress, style }) {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: color }, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconBadge}>
        <Ionicons name={icon} size={18} color="#FFFFFF" />
      </View>

      <Ionicons
        name={icon}
        size={110}
        color="rgba(255,255,255,0.22)"
        style={styles.bigIcon}
      />

      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    height: 150,
    borderRadius: 16,
    overflow: "hidden",
    padding: 16,
    justifyContent: "space-between",
  },

  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.28)",
    alignItems: "center",
    justifyContent: "center",
  },

  bigIcon: {
    position: "absolute",
    right: -14,
    bottom: -12,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
