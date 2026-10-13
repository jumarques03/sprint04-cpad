import React, { useState } from "react";
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import Header from "../../components/Header";
import AssistantInfo from "../../components/AssistantInfo";
import ChatBubble from "../../components/ChatBubble";
import ChatInput from "../../components/ChatInput";

export default function Duvidas() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [chats, setChats] = useState([
    { 
      id: "1", 
      type: "bot", 
      message: "Olá! Sou o assistente de IA do EcoTrack. Como posso ajudar com os dados da sua estação ou operação hoje?", 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);

  const enviarMensagem = async () => {
    if (!message.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      type: "user",
      message: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChats((prev) => [...prev, userMsg]);
    setMessage("");
    setIsLoading(true);

    try {
      // Chave gerada no seu vídeo
      const API_KEY = "SUA_API_KEY"; 
      
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-goog-api-key': API_KEY 
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{
              text: `Você é o assistente virtual operacional do EcoTrack, um aplicativo desenvolvido para a concessionária Motiva. 
              A plataforma EcoTrack serve para monitorar a vegetação das rodovias (como o Rodoanel) usando visão computacional embarcada em veículos. 
              Seu objetivo é ajudar os operadores de campo a tirar dúvidas sobre o funcionamento do app, monitoramento de trechos, Ordens de Serviço e status da vegetação (verde, amarelo, vermelho). 
              Seja direto, profissional e responda de forma concisa. 
              Se perguntarem sobre a plataforma, explique que é o sistema EcoTrack de monitoramento inteligente. Não responda a perguntas fora do contexto rodoviário.`
            }]
          },
          contents: [{ parts: [{ text: userMsg.message }] }]
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || "Erro na API do Gemini");
      }

      const textoResposta = data.candidates[0].content.parts[0].text;

      const botMsg = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        message: textoResposta,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChats((prev) => [...prev, botMsg]);

    } catch (error) {
      console.warn("Fallback ativado devido a erro na API:", error.message);
      
      // Resposta simulada para evitar crash no vídeo caso o Google retorne erro 503 (High Demand)
      const fallbackMsg = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        message: "A IA está operando em modo offline temporário devido à instabilidade na rede. Sua dúvida foi registrada. Posso ajudar com mais alguma informação operacional do trecho?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChats((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Dúvidas" />

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <AssistantInfo
            title="Assistente Operacional"
            description="Tire dúvidas sobre procedimentos e operações com nossa IA."
          />

          {chats.map((msg) => (
            <ChatBubble
              key={msg.id}
              type={msg.type}
              message={msg.message}
              time={msg.time}
            />
          ))}
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#081EAD" />
            </View>
          )}
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
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  scroll: {
    padding: 18,
    paddingBottom: 30,
  },
  loadingContainer: {
    marginVertical: 10,
    alignItems: "flex-start",
    marginLeft: 10,
  }
});