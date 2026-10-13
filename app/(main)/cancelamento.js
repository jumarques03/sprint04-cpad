import React, { useState } from "react";
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import Header from "../../components/Header";
import AssistantInfo from "../../components/AssistantInfo";
import ChatBubble from "../../components/ChatBubble";
import ChatInput from "../../components/ChatInput";
import { useMockData } from "../../context/MockDataContext";

export default function Cancelamento() {
  const [message, setMessage] = useState("");
  const { adicionarAviso } = useMockData();
  
  const [chats, setChats] = useState([
    {
      id: "1",
      type: "bot",
      message: "Olá! Indique o motivo para a solicitação de cancelamento.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const enviarMensagem = () => {
    if (!message.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      type: "user",
      message: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChats((prev) => [...prev, userMsg]);
    setMessage("");

    // Simula o tempo de resposta e regista o aviso globalmente
    setTimeout(() => {
      adicionarAviso({
        title: "Solicitação de cancelamento enviada",
        message: "O motivo informado foi registado e enviado para análise.",
      });

      const botMsg = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        message: "Cancelamento registado com sucesso. O estado foi enviado para análise da equipa responsável.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChats((prev) => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Header title="Cancelamento" />

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <AssistantInfo
            title="Assistente de Cancelamento"
            description="Registe o motivo da interrupção da operação."
          />

          {chats.map((msg) => (
            <ChatBubble
              key={msg.id}
              type={msg.type}
              message={msg.message}
              time={msg.time}
            />
          ))}
        </ScrollView>

        <ChatInput
          value={message}
          onChangeText={setMessage}
          onSend={enviarMensagem}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { flex: 1 },
  scroll: { padding: 18, paddingBottom: 30 }
});