import React from "react";
import { Modal, View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import EvidenciaFoto from "./EvidenciaFoto";
import StatusBadge from "./StatusBadge";
import {
  STATUS_ORDEM,
  dataFinalizacao,
  formatarDataHora,
  formatarKm,
} from "../utils/ordemServico";

function Linha({ label, value }) {
  return (
    <View style={styles.linha}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.valor}>{value}</Text>
    </View>
  );
}

export default function EvidenciaDetalhe({ ordem, visible, onClose }) {
  if (!ordem) return null;

  const concluida = ordem.status === STATUS_ORDEM.CONCLUIDA;

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
            <Text style={styles.titulo}>Ordem #{ordem.numero}</Text>

            <TouchableOpacity onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={26} color="#081EAD" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <StatusBadge status={ordem.status} style={styles.badge} />

            {concluida && (
              <>
                <Text style={styles.secao}>Evidência da roçada</Text>
                <EvidenciaFoto uri={ordem.fotoUri} style={styles.foto} mostrarTexto />

                {ordem.evidenciaPermanente === false && (
                  <Text style={styles.aviso}>
                    Esta foto foi guardada de forma temporária e pode deixar de
                    estar disponível.
                  </Text>
                )}
              </>
            )}

            <Linha label="Tipo de serviço" value={ordem.tipo} />
            <Linha label="Localização" value={ordem.endereco} />
            <Linha label="Horário previsto" value={ordem.horario} />

            {!!ordem.iniciadaEm && (
              <Linha label="Iniciada em" value={formatarDataHora(ordem.iniciadaEm)} />
            )}

            {concluida ? (
              <>
                <Linha label="Concluída em" value={formatarDataHora(ordem.concluidaEm)} />
                <Linha
                  label="Altura da grama"
                  value={`${formatarKm(ordem.alturaInicial)} cm → ${formatarKm(ordem.alturaFinal)} cm`}
                />
                <Linha
                  label="Observações"
                  value={ordem.observacoes || "Sem observações"}
                />
              </>
            ) : (
              <>
                <Linha
                  label={`${ordem.status} em`}
                  value={formatarDataHora(dataFinalizacao(ordem))}
                />
                <Linha label="Motivo" value={ordem.impedimento?.motivo ?? "Não informado"} />
              </>
            )}
          </ScrollView>
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
    maxHeight: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 22,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#081EAD",
  },

  badge: {
    marginBottom: 6,
  },

  secao: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#202020",
    marginTop: 12,
    marginBottom: 8,
  },

  foto: {
    width: "100%",
    height: 260,
    borderRadius: 14,
    overflow: "hidden",
  },

  aviso: {
    fontSize: 12,
    color: "#B7791F",
    marginTop: 6,
  },

  linha: {
    marginTop: 12,
  },

  label: {
    fontSize: 13,
    color: "#6A6A6A",
  },

  valor: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#081EAD",
    marginTop: 2,
  },
});
