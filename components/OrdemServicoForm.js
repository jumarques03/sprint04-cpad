import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import TrechoSelector from "./TrechoSelector";
import { CustomInput, TimeInput } from "./Input";
import BlueButton from "./BlueButton";
import BorderButton from "./BorderButton";
import { converterNumero, formatarKm } from "../utils/ordemServico";

const HORARIO_VALIDO = /^([01]\d|2[0-3]):[0-5]\d$/;

// preenchimento: valores sugeridos (ex.: sugestão automática da IA). Cada novo
// objeto recebido substitui os campos correspondentes do formulário.
export default function OrdemServicoForm({ mapData, preenchimento, onCriar, onCancelar }) {
  const [tipo, setTipo] = useState("");
  const [trechoId, setTrechoId] = useState(null);
  const [kmInicial, setKmInicial] = useState("");
  const [kmFinal, setKmFinal] = useState("");
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioFim, setHorarioFim] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erros, setErros] = useState({});

  useEffect(() => {
    if (!preenchimento) return;

    setTipo(preenchimento.tipo);
    setTrechoId(preenchimento.trechoId);
    setKmInicial(formatarKm(preenchimento.kmInicial));
    setKmFinal(formatarKm(preenchimento.kmFinal));
    setErros({});
  }, [preenchimento]);

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
    } else if (!novosErros.kmInicial && kmFim < kmIni) {
      novosErros.kmFinal = "Não pode ser menor que o km inicial";
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

  const limpar = () => {
    setTipo("");
    setTrechoId(null);
    setKmInicial("");
    setKmFinal("");
    setHorarioInicio("");
    setHorarioFim("");
    setDescricao("");
    setErros({});
  };

  const handleCriar = async () => {
    if (!validar()) return;

    await onCriar({
      tipo: tipo.trim(),
      trechoId,
      kmInicial: converterNumero(kmInicial),
      kmFinal: converterNumero(kmFinal),
      horario: `${horarioInicio} - ${horarioFim}`,
      descricao: descricao.trim(),
    });

    limpar();
  };

  return (
    <View>
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

      <View style={styles.linha}>
        <View style={styles.campo}>
          <CustomInput
            label="Km inicial"
            placeholder="Ex: 120"
            value={kmInicial}
            onChangeText={setKmInicial}
            keyboardType="numeric"
            erro={erros.kmInicial}
          />
        </View>

        <View style={styles.campo}>
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

      <View style={styles.linha}>
        <View style={styles.campo}>
          <TimeInput
            label="Início"
            placeholder="09:00"
            value={horarioInicio}
            onChangeText={setHorarioInicio}
            erro={erros.horarioInicio}
          />
        </View>

        <View style={styles.campo}>
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

      {onCancelar && <BorderButton title="Cancelar" onPress={onCancelar} />}
    </View>
  );
}

const styles = StyleSheet.create({
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

  linha: {
    flexDirection: "row",
    gap: 12,
  },

  campo: {
    flex: 1,
  },
});
