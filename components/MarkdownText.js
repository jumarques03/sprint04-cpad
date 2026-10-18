import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { parseBlocos, parseInline } from "../utils/markdown";

function TextoInline({ texto, style }) {
  return (
    <Text style={style}>
      {parseInline(texto).map((parte, indice) => (
        <Text
          key={indice}
          style={[
            parte.negrito && styles.negrito,
            parte.italico && styles.italico,
            parte.codigo && styles.codigo,
          ]}
        >
          {parte.texto}
        </Text>
      ))}
    </Text>
  );
}

// Mostra texto em Markdown (respostas do assistente) com a formatação aplicada
export default function MarkdownText({ children, style }) {
  const blocos = parseBlocos(String(children ?? ""));

  return (
    <View>
      {blocos.map((bloco, indice) => {
        const espaco = indice > 0 && styles.espaco;

        if (bloco.tipo === "titulo") {
          return (
            <TextoInline
              key={indice}
              texto={bloco.texto}
              style={[style, styles.titulo, espaco]}
            />
          );
        }

        if (bloco.tipo === "item" || bloco.tipo === "numerado") {
          return (
            <View key={indice} style={[styles.item, espaco]}>
              <Text style={[style, styles.marcador]}>
                {bloco.tipo === "item" ? "•" : `${bloco.numero}.`}
              </Text>
              <TextoInline texto={bloco.texto} style={[style, styles.textoItem]} />
            </View>
          );
        }

        return (
          <TextoInline key={indice} texto={bloco.texto} style={[style, espaco]} />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  espaco: {
    marginTop: 8,
  },

  titulo: {
    fontWeight: "bold",
    fontSize: 16,
  },

  item: {
    flexDirection: "row",
    gap: 8,
  },

  marcador: {
    minWidth: 18,
  },

  textoItem: {
    flex: 1,
  },

  negrito: {
    fontWeight: "bold",
  },

  italico: {
    fontStyle: "italic",
  },

  codigo: {
    fontFamily: "monospace",
    backgroundColor: "rgba(0,0,0,0.08)",
  },
});
