import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const TIPOS_REGISTRO = [
  {
    id: "Impedimento",
    icon: "rainy-outline",
    descricao: "Algo impediu a execução hoje (chuva, acesso bloqueado...).",
  },
  {
    id: "Cancelamento",
    icon: "close-circle-outline",
    descricao: "A ordem de serviço não será mais executada.",
  },
];

export default function TipoRegistroSelector({ onSelecionar }) {
  return (
    <View style={styles.container}>
      {TIPOS_REGISTRO.map((tipo) => (
        <TouchableOpacity
          key={tipo.id}
          style={styles.opcao}
          onPress={() => onSelecionar(tipo.id)}
          activeOpacity={0.8}
        >
          <Ionicons name={tipo.icon} size={26} color="#081EAD" />

          <View style={styles.texto}>
            <Text style={styles.titulo}>{tipo.id}</Text>
            <Text style={styles.descricao}>{tipo.descricao}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    marginBottom: 12,
  },

  opcao: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#081EAD",
    backgroundColor: "#FFFFFF",
  },

  texto: {
    flex: 1,
  },

  titulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#081EAD",
  },

  descricao: {
    fontSize: 13,
    color: "#4E4E4E",
    marginTop: 2,
  },
});
