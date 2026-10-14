import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Mostra a foto da evidência. Se não houver foto ou o arquivo não puder ser
// carregado (apagado, caminho inválido), mostra um placeholder.
export default function EvidenciaFoto({ uri, style, mostrarTexto }) {
  const [falhou, setFalhou] = useState(false);

  useEffect(() => {
    setFalhou(false);
  }, [uri]);

  if (!uri || falhou) {
    return (
      <View style={[styles.placeholder, style]}>
        <Ionicons name="image-outline" size={mostrarTexto ? 40 : 26} color="#8A8A8A" />
        {mostrarTexto && (
          <Text style={styles.texto}>Foto indisponível</Text>
        )}
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={style}
      resizeMode="cover"
      onError={() => setFalhou(true)}
    />
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: "#E5E7FF",
    alignItems: "center",
    justifyContent: "center",
  },

  texto: {
    fontSize: 14,
    color: "#4E4E4E",
    marginTop: 6,
  },
});
