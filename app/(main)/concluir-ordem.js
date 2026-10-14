import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

import Header from "../../components/Header";
import EmptyState from "../../components/EmptyState";
import OrdemServicoInfo from "../../components/OrdemServicoInfo";
import FotoComprovacao from "../../components/FotoComprovacao";
import { CustomInput } from "../../components/Input";
import BlueButton from "../../components/BlueButton";
import { useMockData } from "../../context/MockDataContext";
import {
  STATUS_ORDEM,
  alturaMaximaDosPontos,
  converterNumero,
  pontosDaOrdem,
} from "../../utils/ordemServico";

export default function ConcluirOrdem() {
  const router = useRouter();
  const { user, ordemServico, mapData, concluirOrdemServico } = useMockData();

  const [alturaInicial, setAlturaInicial] = useState("");
  const [alturaFinal, setAlturaFinal] = useState("");
  const [fotoUri, setFotoUri] = useState(null);
  const [observacoes, setObservacoes] = useState("");
  const [erros, setErros] = useState({});

  const emAndamento = ordemServico?.status === STATUS_ORDEM.EM_ANDAMENTO;

  const pontos = ordemServico ? pontosDaOrdem(mapData, ordemServico) : [];
  const alturaMapa = alturaMaximaDosPontos(pontos);

  // A altura inicial sugerida é a maior leitura do mapa dentro da faixa da ordem
  useEffect(() => {
    if (alturaMapa !== null && alturaInicial === "") {
      setAlturaInicial(String(alturaMapa));
    }
  }, [ordemServico?.numero, alturaMapa]);

  const validar = () => {
    const novosErros = {};
    const inicial = converterNumero(alturaInicial);
    const final = converterNumero(alturaFinal);

    if (!alturaInicial.trim()) {
      novosErros.alturaInicial = "Campo obrigatório";
    } else if (Number.isNaN(inicial) || inicial <= 0) {
      novosErros.alturaInicial = "Informe uma altura válida em cm";
    }

    if (!alturaFinal.trim()) {
      novosErros.alturaFinal = "Campo obrigatório";
    } else if (Number.isNaN(final) || final < 0) {
      novosErros.alturaFinal = "Informe uma altura válida em cm";
    } else if (!novosErros.alturaInicial && final >= inicial) {
      novosErros.alturaFinal = "Deve ser menor que a altura inicial";
    }

    if (!fotoUri) {
      novosErros.foto = "Anexe a foto que comprova a roçada";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleConcluir = () => {
    if (!validar()) return;

    concluirOrdemServico({
      alturaInicial: converterNumero(alturaInicial),
      alturaFinal: converterNumero(alturaFinal),
      observacoes: observacoes.trim(),
      fotoUri,
    });

    Alert.alert(
      "Ordem concluída",
      "A roçada foi registrada e os pontos do mapa foram atualizados."
    );
    router.back();
  };

  return (
    <View style={styles.container}>
      <Header title="Concluir Ordem" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {ordemServico && !emAndamento ? (
            <>
              <EmptyState
                icon="play-circle-outline"
                title="Inicie a ordem primeiro"
                message={`A ordem #${ordemServico.numero} ainda não foi iniciada. Inicie a execução para poder registrar a roçada.`}
              />

              <BlueButton
                title="Ir para a ordem de serviço"
                onPress={() => router.replace("/(main)/ordem-servico")}
              />
            </>
          ) : ordemServico ? (
            <>
              <OrdemServicoInfo ordem={ordemServico} team={user.equipe} />

              <Text style={styles.dica}>
                {pontos.length > 0
                  ? `${pontos.length} pontos do mapa estão nesta faixa e serão atualizados.`
                  : "Nenhum ponto escaneado do mapa nesta faixa."}
              </Text>

              <Text style={styles.sectionTitle}>Registro da roçada</Text>

              <View style={styles.alturas}>
                <View style={styles.alturaCampo}>
                  <CustomInput
                    label="Altura inicial (cm)"
                    placeholder="Ex: 38"
                    value={alturaInicial}
                    onChangeText={setAlturaInicial}
                    keyboardType="numeric"
                    erro={erros.alturaInicial}
                  />
                </View>

                <View style={styles.alturaCampo}>
                  <CustomInput
                    label="Altura final (cm)"
                    placeholder="Ex: 5"
                    value={alturaFinal}
                    onChangeText={setAlturaFinal}
                    keyboardType="numeric"
                    erro={erros.alturaFinal}
                  />
                </View>
              </View>

              <FotoComprovacao
                uri={fotoUri}
                onChange={setFotoUri}
                erro={erros.foto}
              />

              <CustomInput
                label="Observações (opcional)"
                placeholder="Descreva como foi a execução da roçada"
                value={observacoes}
                onChangeText={setObservacoes}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              <BlueButton title="Concluir ordem de serviço" onPress={handleConcluir} />
            </>
          ) : (
            <>
              <EmptyState
                icon="checkmark-done-outline"
                title="Nenhuma ordem para concluir"
                message="Você não possui uma ordem de serviço ativa. Crie uma ordem para poder registrar a roçada."
              />

              <BlueButton
                title="Criar ordem de serviço"
                onPress={() => router.replace("/(main)/ordem-servico")}
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

  dica: {
    color: "#6A6A6A",
    fontSize: 13,
    marginTop: 10,
    marginLeft: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#202020",
    marginTop: 20,
    marginBottom: 2,
  },

  alturas: {
    flexDirection: "row",
    gap: 12,
  },

  alturaCampo: {
    flex: 1,
  },
});
