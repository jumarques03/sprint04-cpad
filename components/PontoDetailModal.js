import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { STATUS_INFO, STATUS_AGUARDANDO } from "../utils/vegetationStatus";

function formatarHorario(timestamp) {
  if (!timestamp) return null;

  return new Date(timestamp).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PontoDetailModal({ ponto, nomeTrecho, visible, onClose }) {
  if (!ponto) return null;

  const info = STATUS_INFO[ponto.status];
  const pendente = ponto.status === STATUS_AGUARDANDO;
  const horario = formatarHorario(ponto.timestamp);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.trecho}>{nomeTrecho}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={26} color="#081EAD" />
            </TouchableOpacity>
          </View>

          <Text style={styles.km}>Km {ponto.km}</Text>

          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: info.color }]} />
            <Text style={styles.statusTexto}>{info.label}</Text>
          </View>

          {pendente ? (
            <Text style={styles.pendenteTexto}>
              Este ponto ainda não foi escaneado pelo veículo de monitoramento.
              Aguardando leitura da visão computacional.
            </Text>
          ) : (
            <>
              <View style={styles.linha}>
                <Text style={styles.label}>Altura da vegetação:</Text>
                <Text style={styles.valor}>{ponto.alturaVegetacao} cm</Text>
              </View>

              <View style={styles.linha}>
                <Text style={styles.label}>Última leitura:</Text>
                <Text style={styles.valor}>{horario}</Text>
              </View>

              {ponto.rocadaEm && (
                <View style={styles.linha}>
                  <Text style={styles.label}>Roçada concluída em:</Text>
                  <Text style={styles.valor}>{formatarHorario(ponto.rocadaEm)}</Text>
                </View>
              )}

              <View style={styles.recomendacaoBox}>
                <Text style={styles.recomendacaoLabel}>Recomendação EcoTrackAI:</Text>
                <Text style={styles.recomendacaoTexto}>{ponto.recomendacaoIA}</Text>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 22,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  trecho: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#081EAD",
  },

  km: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#202020",
    marginTop: 6,
    marginBottom: 14,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },

  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },

  statusTexto: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#202020",
  },

  pendenteTexto: {
    fontSize: 15,
    color: "#4E4E4E",
    lineHeight: 22,
  },

  linha: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  label: {
    fontSize: 15,
    color: "#4E4E4E",
  },

  valor: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#202020",
  },

  recomendacaoBox: {
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: "#081EAD",
    borderRadius: 14,
    padding: 14,
  },

  recomendacaoLabel: {
    fontSize: 13,
    color: "#081EAD",
    fontWeight: "bold",
    marginBottom: 6,
  },

  recomendacaoTexto: {
    fontSize: 14,
    color: "#081EAD",
    lineHeight: 20,
  },
});
