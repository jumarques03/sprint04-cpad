import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Opções de resposta do assistente, no estilo dos botões de resposta rápida do
// WhatsApp: ficam alinhadas à direita, abaixo da pergunta do bot.
export default function RespostasRapidas({ opcoes, onSelecionar }) {
  return (
    <View style={styles.container}>
      {opcoes.map((opcao) => (
        <TouchableOpacity
          key={opcao.id}
          style={styles.opcao}
          onPress={() => onSelecionar(opcao.id)}
          activeOpacity={0.7}
        >
          {!!opcao.icon && <Ionicons name={opcao.icon} size={18} color="#081EAD" />}
          <Text style={styles.texto}>{opcao.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
    gap: 10,
    marginTop: -6,
    marginBottom: 18,
  },

  opcao: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#081EAD",
    backgroundColor: "#FFFFFF",
  },

  texto: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#081EAD",
  },
});
