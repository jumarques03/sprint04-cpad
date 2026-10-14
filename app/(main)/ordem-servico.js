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
import EmptyState from "../../components/EmptyState";
import OrdemServicoInfo from "../../components/OrdemServicoInfo";
import { CustomInput, TimeInput } from "../../components/Input";
import BlueButton from "../../components/BlueButton";
import { useMockData } from "../../context/MockDataContext";

const HORARIO_VALIDO = /^([01]\d|2[0-3]):[0-5]\d$/;

export default function OrdemServico() {
  const { user, ordemServico, criarOrdemServico } = useMockData();

  const [tipo, setTipo] = useState("");
  const [endereco, setEndereco] = useState("");
  const [km, setKm] = useState("");
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioFim, setHorarioFim] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erros, setErros] = useState({});

  const validar = () => {
    const novosErros = {};

    if (!tipo.trim()) {
      novosErros.tipo = "Campo obrigatório";
    }

    if (!endereco.trim()) {
      novosErros.endereco = "Campo obrigatório";
    }

    if (!km.trim()) {
      novosErros.km = "Campo obrigatório";
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
      endereco: endereco.trim(),
      km: km.trim(),
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

              <CustomInput
                label="Rodovia / Endereço"
                placeholder="Ex: Rodovia BR111"
                value={endereco}
                onChangeText={setEndereco}
                erro={erros.endereco}
              />

              <CustomInput
                label="Km"
                placeholder="Ex: 121"
                value={km}
                onChangeText={setKm}
                keyboardType="numeric"
                erro={erros.km}
              />

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

  horarios: {
    flexDirection: "row",
    gap: 12,
  },

  horarioCampo: {
    flex: 1,
  },
});
