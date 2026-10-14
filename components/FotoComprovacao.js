import React from "react";
import { View, Text, Image, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

import BorderButton from "./BorderButton";

export default function FotoComprovacao({ uri, onChange, erro }) {
  const tirarFoto = async () => {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissao.granted) {
      Alert.alert(
        "Permissão necessária",
        "Permita o acesso à câmera para registrar a foto da roçada."
      );
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({ quality: 0.7 });

    if (!resultado.canceled) {
      onChange(resultado.assets[0].uri);
    }
  };

  const escolherDaGaleria = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });

    if (!resultado.canceled) {
      onChange(resultado.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Foto comprovando a roçada</Text>

      {uri && <Image source={{ uri }} style={styles.preview} resizeMode="cover" />}

      <View style={styles.botoes}>
        <View style={styles.botaoArea}>
          <BorderButton
            title={uri ? "Refazer foto" : "Tirar foto"}
            onPress={tirarFoto}
            style={styles.botao}
          />
        </View>

        <View style={styles.botaoArea}>
          <BorderButton
            title="Galeria"
            onPress={escolherDaGaleria}
            style={styles.botao}
          />
        </View>
      </View>

      {erro && <Text style={styles.erro}>{erro}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    marginTop: 10,
  },

  label: {
    color: "#6A6A6A",
    fontSize: 14,
    marginBottom: 4,
  },

  preview: {
    width: "100%",
    height: 190,
    borderRadius: 12,
    marginTop: 6,
    backgroundColor: "#E5E7FF",
  },

  botoes: {
    flexDirection: "row",
    gap: 12,
  },

  botaoArea: {
    flex: 1,
  },

  botao: {
    marginTop: 10,
  },

  erro: {
    color: "#EC4040",
    marginTop: 4,
    marginLeft: 4,
    fontSize: 14,
  },
});
