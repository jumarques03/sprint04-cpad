import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import Header from "../../components/Header";
import TrechoSelector from "../../components/TrechoSelector";
import EmptyState from "../../components/EmptyState";
import OrdemServicoInfo from "../../components/OrdemServicoInfo";
import { CustomInput, TimeInput } from "../../components/Input";
import BlueButton from "../../components/BlueButton";
import { useMockData } from "../../context/MockDataContext";
import { converterNumero, formatarKm } from "../../utils/ordemServico";

const HORARIO_VALIDO = /^([01]\d|2[0-3]):[0-5]\d$/;

export default function OrdemServico() {
  const { user, ordemServico, mapData, criarOrdemServico } = useMockData();

  const [tipo, setTipo] = useState("");
  const [trechoId, setTrechoId] = useState(null);
  const [kmInicial, setKmInicial] = useState("");
  const [kmFinal, setKmFinal] = useState("");
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioFim, setHorarioFim] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erros, setErros] = useState({});

  const validar = () => {
    const novosErros = {};

    if (!tipo.trim()) {
      novosErros.tipo = "Campo obrigatório";
    }

    const trecho = trechoId ? mapData.trechos[trechoId] : null;
    const kmIni = converterNumero(kmInicial);
    const kmFim = converterNumero(kmFinal);

    if (!trecho) {
      novosErros.trecho = "Selecione o trecho";
    }

    if (!kmInicial.trim()) {
      novosErros.kmInicial = "Campo obrigatório";
    } else if (Number.isNaN(kmIni)) {
      novosErros.kmInicial = "Km inválido";
    } else if (trecho && (kmIni < trecho.kmInicial || kmIni > trecho.kmFinal)) {
      novosErros.kmInicial = `Fora do trecho (${formatarKm(trecho.kmInicial)} a ${formatarKm(trecho.kmFinal)})`;
    }

    if (!kmFinal.trim()) {
      novosErros.kmFinal = "Campo obrigatório";
    } else if (Number.isNaN(kmFim)) {
      novosErros.kmFinal = "Km inválido";
    } else if (trecho && (kmFim < trecho.kmInicial || kmFim > trecho.kmFinal)) {
      novosErros.kmFinal = `Fora do trecho (${formatarKm(trecho.kmInicial)} a ${formatarKm(trecho.kmFinal)})`;
    } else if (!novosErros.kmInicial && kmFim <= kmIni) {
      novosErros.kmFinal = "Deve ser maior que o km inicial";
    }

    if (!horarioInicio) {
      novosErros.horarioInicio = "Campo obrigatório";
    } else if (!HORARIO_VALIDO.test(horarioInicio)) {
      novosErros.horarioInicio = "Horário inválido";
    }

    if (!horarioFim) {
      novosErros.horarioFim = "Campo obrigatório";
    } else if (!HORARIO_VALIDO.test(horarioFim)) {
      novosErros.horarioFim = "Horário inválido";
    } else if (HORARIO_VALIDO.test(horarioInicio) && horarioFim <= horarioInicio) {
      novosErros.horarioFim = "Deve ser depois do início";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleCriar = () => {
    if (!validar()) return;

    criarOrdemServico({
      tipo: tipo.trim(),
      trechoId,
      kmInicial: converterNumero(kmInicial),
      kmFinal: converterNumero(kmFinal),
      horario: `${horarioInicio} - ${horarioFim}`,
      descricao: descricao.trim(),
    });
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
          {ordemServico ? (
            <OrdemServicoInfo ordem={ordemServico} team={user.equipe} />
          ) : (
            <>
              <EmptyState
                icon="clipboard-outline"
                title="Nenhuma ordem de serviço"
                message="Você ainda não possui uma ordem de serviço para hoje. Preencha os campos abaixo para criar uma."
              />

              <Text style={styles.sectionTitle}>Criar ordem de serviço</Text>

              <CustomInput
                label="Tipo de serviço"
                placeholder="Ex: Roçada de vegetação"
                value={tipo}
                onChangeText={setTipo}
                erro={erros.tipo}
              />

              <Text style={styles.label}>Rodovia</Text>
              <Text style={styles.rodovia}>{mapData.rodovia}</Text>

              <Text style={styles.label}>Trecho</Text>
              <View style={styles.trechos}>
                <TrechoSelector
                  trechos={Object.values(mapData.trechos)}
                  trechoSelecionado={trechoId}
                  onSelecionar={setTrechoId}
                />
              </View>
              {trechoId && (
                <Text style={styles.dica}>
                  Km do trecho: {formatarKm(mapData.trechos[trechoId].kmInicial)} a{" "}
                  {formatarKm(mapData.trechos[trechoId].kmFinal)}
                </Text>
              )}
              {erros.trecho && <Text style={styles.erro}>{erros.trecho}</Text>}

              <View style={styles.horarios}>
                <View style={styles.horarioCampo}>
                  <CustomInput
                    label="Km inicial"
                    placeholder="Ex: 120"
                    value={kmInicial}
                    onChangeText={setKmInicial}
                    keyboardType="numeric"
                    erro={erros.kmInicial}
                  />
                </View>

                <View style={styles.horarioCampo}>
                  <CustomInput
                    label="Km final"
                    placeholder="Ex: 123"
                    value={kmFinal}
                    onChangeText={setKmFinal}
                    keyboardType="numeric"
                    erro={erros.kmFinal}
                  />
                </View>
              </View>

              <View style={styles.horarios}>
                <View style={styles.horarioCampo}>
                  <TimeInput
                    label="Início"
                    placeholder="09:00"
                    value={horarioInicio}
                    onChangeText={setHorarioInicio}
                    erro={erros.horarioInicio}
                  />
                </View>

                <View style={styles.horarioCampo}>
                  <TimeInput
                    label="Fim"
                    placeholder="16:00"
                    value={horarioFim}
                    onChangeText={setHorarioFim}
                    erro={erros.horarioFim}
                  />
                </View>
              </View>

              <CustomInput
                label="Observações (opcional)"
                placeholder="Descreva o serviço a ser realizado"
                value={descricao}
                onChangeText={setDescricao}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              <BlueButton title="Criar ordem de serviço" onPress={handleCriar} />
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
    marginBottom: 7,
    marginTop: 5,
  },

  label: {
    color: "#6A6A6A",
    fontSize: 14,
    marginBottom: 4,
    marginTop: 10,
  },

  rodovia: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#081EAD",
  },

  trechos: {
    marginHorizontal: -24,
  },

  dica: {
    color: "#6A6A6A",
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
  },

  erro: {
    color: "#EC4040",
    marginTop: 4,
    marginLeft: 4,
    fontSize: 14,
  },

  horarios: {
    flexDirection: "row",
    gap: 12,
  },

  horarioCampo: {
    flex: 1,
  },
});
