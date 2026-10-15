import React, { useState } from "react";
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import Header from "../../components/Header";
import AssistantInfo from "../../components/AssistantInfo";
import ChatBubble from "../../components/ChatBubble";
import ChatInput from "../../components/ChatInput";
import EmptyState from "../../components/EmptyState";
import OrdemChatCard from "../../components/OrdemChatCard";
import RespostasRapidas from "../../components/RespostasRapidas";
import BlueButton from "../../components/BlueButton";
import { useMockData } from "../../context/MockDataContext";

const OPCOES_REGISTRO = [
  { id: "Impedimento", label: "Impedimento", icon: "rainy-outline" },
  { id: "Cancelamento", label: "Cancelamento", icon: "close-circle-outline" },
];

const horaAtual = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function Cancelamento() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [tipo, setTipo] = useState(null);
  const [registrado, setRegistrado] = useState(false);
  const { ordemServico, mapData, registrarImpedimento } = useMockData();

  const [chats, setChats] = useState([
    {
      id: "1",
      type: "bot",
      message:
        "Olá! O que você precisa registrar na ordem de serviço?\n\nImpedimento: algo impediu a execução hoje (chuva, acesso bloqueado...).\n\nCancelamento: a ordem não será mais executada.",
      time: horaAtual(),
    },
  ]);

  const adicionarMensagens = (...novas) => setChats((prev) => [...prev, ...novas]);

  const handleSelecionarTipo = (tipoEscolhido) => {
    setTipo(tipoEscolhido);

    adicionarMensagens(
      { id: `tipo-${Date.now()}`, type: "user", message: tipoEscolhido, time: horaAtual() },
      {
        id: `motivo-${Date.now()}`,
        type: "bot",
        message: `Certo. Informe o motivo do ${tipoEscolhido.toLowerCase()} da ordem #${ordemServico.numero}.`,
        time: horaAtual(),
      }
    );
  };

  const enviarMensagem = async () => {
    if (!message.trim() || !tipo) return;

    const motivo = message.trim();
    setMessage("");

    adicionarMensagens({
      id: `usuario-${Date.now()}`,
      type: "user",
      message: motivo,
      time: horaAtual(),
    });

    // Grava na ordem ativa: muda o status, vai para o histórico e avisa o sistema central
    const resultado = await registrarImpedimento({ tipo, motivo });

    adicionarMensagens({
      id: `bot-${Date.now()}`,
      type: "bot",
      message: resultado.sucesso
        ? `${tipo} registrado na ordem #${resultado.registro.numero}. O status foi enviado para análise da equipe responsável e você já pode criar uma nova ordem.`
        : resultado.mensagem,
      time: horaAtual(),
    });

    setRegistrado(resultado.sucesso);
  };

  return (
    <View style={styles.container}>
      <Header title="Impedimento / Cancelamento" />

      {!ordemServico && !registrado ? (
        <View style={styles.vazio}>
          <EmptyState
            icon="clipboard-outline"
            title="Nenhuma ordem ativa"
            message="Não há uma ordem de serviço para registrar impedimento ou cancelamento. Crie uma ordem primeiro."
          />

          <BlueButton
            title="Criar ordem de serviço"
            onPress={() => router.replace("/(main)/ordem-servico")}
          />
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.content}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView contentContainerStyle={styles.scroll}>
            <AssistantInfo
              title="Assistente de Impedimento e Cancelamento"
              description="Registre na ordem de serviço o que impediu ou cancelou a execução."
            />

            {ordemServico && (
              <OrdemChatCard
                ordem={ordemServico}
                rodovia={mapData.rodovia}
                trechoNome={mapData.trechos[ordemServico.trechoId]?.nome ?? ""}
              />
            )}

            {chats.map((msg) => (
              <ChatBubble
                key={msg.id}
                type={msg.type}
                message={msg.message}
                time={msg.time}
              />
            ))}

            {!tipo && !registrado && (
              <RespostasRapidas
                opcoes={OPCOES_REGISTRO}
                onSelecionar={handleSelecionarTipo}
              />
            )}

            {registrado && (
              <BlueButton
                title="Ver histórico de ordens"
                onPress={() => router.replace("/(main)/historico-ordens")}
              />
            )}
          </ScrollView>

          {tipo && !registrado && (
            <ChatInput
              value={message}
              onChangeText={setMessage}
              onSend={enviarMensagem}
            />
          )}
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { flex: 1 },
  vazio: { padding: 24 },
  scroll: { padding: 18, paddingBottom: 30 },
});
