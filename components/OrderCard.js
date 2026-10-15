import React from "react";
import { TouchableOpacity, Text, Image, View, StyleSheet } from "react-native";

export default function OrderCard({
  title,
  subtitle,
  image,
  color,
  onPress,
  dimmed,
  horizontal,
  style,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        horizontal && styles.cardHorizontal,
        { backgroundColor: color },
        dimmed && styles.dimmed,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={image}
        style={horizontal ? styles.imageHorizontal : styles.image}
        resizeMode="contain"
      />

      <View style={horizontal && styles.textos}>
        <Text style={styles.title}>{title}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
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

  cardHorizontal: {
    width: "100%",
    height: 90,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 16,
  },

  dimmed: {
    opacity: 0.6,
  },

  image: {
    width: 64,
    height: 64,
  },

  imageHorizontal: {
    width: 60,
    height: 60,
  },

  textos: {
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  subtitle: {
    fontSize: 12,
    color: "#FFFFFF",
    marginTop: 2,
  },
});
