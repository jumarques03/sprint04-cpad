import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";

import Header from "../../components/Header";
import EmptyState from "../../components/EmptyState";
import OrdemServicoInfo from "../../components/OrdemServicoInfo";
import OrdemServicoForm from "../../components/OrdemServicoForm";
import OrdemResumoItem from "../../components/OrdemResumoItem";
import BlueButton from "../../components/BlueButton";
import BorderButton from "../../components/BorderButton";
import { useMockData } from "../../context/MockDataContext";
import { STATUS_ORDEM } from "../../utils/ordemServico";

export default function OrdemServico() {
  const router = useRouter();
  const {
    user,
    ordens,
    ordemServico,
    mapData,
    criarOrdemServico,
    selecionarOrdem,
    iniciarOrdemServico,
  } = useMockData();

  const [criando, setCriando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  const mostrarFormulario = criando || !ordemServico;
  const outrasOrdens = ordens.filter((ordem) => ordem.id !== ordemServico?.id);
  const emAndamento = ordemServico?.status === STATUS_ORDEM.EM_ANDAMENTO;

  const handleCriar = async (dados) => {
    await criarOrdemServico(dados);
    setCriando(false);
  };

  const handleIniciar = async () => {
    const resultado = await iniciarOrdemServico(ordemServico.id);
    setMensagemErro(resultado.sucesso ? "" : resultado.mensagem);
  };

  const handleSelecionar = (id) => {
    setMensagemErro("");
    selecionarOrdem(id);
  };

  return (
    <View style={styles.container}>
      <Header title="Ordem de Serviço" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {mostrarFormulario ? (
            <>
              {!ordemServico && (
                <EmptyState
                  icon="clipboard-outline"
                  title="Nenhuma ordem de serviço"
                  message="Você ainda não possui uma ordem de serviço para hoje. Preencha os campos abaixo para criar uma."
                />
              )}

              <OrdemServicoForm
                mapData={mapData}
                onCriar={handleCriar}
                onCancelar={ordemServico ? () => setCriando(false) : undefined}
              />
            </>
          ) : (
            <>
              <OrdemServicoInfo ordem={ordemServico} team={user.equipe} />

              {ordemServico.status === STATUS_ORDEM.PENDENTE && (
                <>
                  <BlueButton title="Iniciar execução" onPress={handleIniciar} />

                  <BorderButton
                    title="Cancelar ordem"
                    onPress={() => router.push("/(main)/cancelamento")}
                  />
                </>
              )}

              {ordemServico.status === STATUS_ORDEM.EM_ANDAMENTO && (
                <>
                  <BlueButton
                    title="Concluir"
                    onPress={() => router.push("/(main)/concluir-ordem")}
                  />

                  <BorderButton
                    title="Registrar impedimento"
                    onPress={() => router.push("/(main)/cancelamento")}
                  />
                </>
              )}

              {!!mensagemErro && <Text style={styles.erro}>{mensagemErro}</Text>}

              {outrasOrdens.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Outras ordens</Text>

                  {emAndamento && (
                    <Text style={styles.dica}>
                      Conclua a ordem em andamento antes de iniciar outra.
                    </Text>
                  )}

                  {outrasOrdens.map((ordem) => (
                    <OrdemResumoItem
                      key={ordem.id}
                      ordem={ordem}
                      onPress={emAndamento ? undefined : () => handleSelecionar(ordem.id)}
                    />
                  ))}
                </>
              )}

              <BorderButton
                title="Criar nova ordem"
                onPress={() => setCriando(true)}
              />
            </>
          )}
        </ScrollView>
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
    padding: 24,
    paddingBottom: 40,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#202020",
    marginTop: 24,
  },

  dica: {
    color: "#6A6A6A",
    fontSize: 13,
    marginTop: 4,
  },

  erro: {
    color: "#EC4040",
    marginTop: 10,
    fontSize: 14,
  },
});
