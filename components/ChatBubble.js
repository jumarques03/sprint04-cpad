import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MarkdownText from "./MarkdownText";

export default function ChatBubble({ message, time, type = "bot" }) {
  const isUser = type === "user";

  return (
    <View style={[styles.wrapper, isUser ? styles.userWrapper : styles.botWrapper]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
        {isUser ? (
          <Text style={[styles.message, styles.userText]}>{message}</Text>
        ) : (
          // As respostas do assistente chegam em Markdown (negrito, listas...)
          <MarkdownText style={[styles.message, styles.botText]}>{message}</MarkdownText>
        )}

        <Text style={[styles.time, isUser ? styles.userTime : styles.botTime]}>
          {time}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginBottom: 18,
  },

  botWrapper: {
    alignItems: "flex-start",
  },

  userWrapper: {
    alignItems: "flex-end",
  },

  bubble: {
    maxWidth: "82%",
    borderRadius: 16,
    padding: 16,
  },

  botBubble: {
    backgroundColor: "#F4F4F4",
  },

    userBubble: {
    backgroundColor: "#081EAD",
    },

  message: {
    fontSize: 14,
    lineHeight: 22,
  },

  botText: {
    color: "#202020",
  },

  userText: {
    color: "#FFFFFF",
  },

  time: {
    fontSize: 11,
    alignSelf: "flex-end",
    marginTop: 6,
  },

  botTime: {
    color: "#8A8A8A",
  },

    userTime: {
    color: "#DDE4FF",
    },
});