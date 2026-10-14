import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import EvidenciaFoto from "./EvidenciaFoto";
import StatusBadge from "./StatusBadge";
import {
  STATUS_ORDEM,
  STATUS_ORDEM_COR,
  dataFinalizacao,
  formatarDataHora,
  formatarKm,
} from "../utils/ordemServico";

export default function OrdemHistoricoCard({ ordem, onPress }) {
  const concluida = ordem.status === STATUS_ORDEM.CONCLUIDA;
  const data = formatarDataHora(dataFinalizacao(ordem));

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {concluida ? (
        <EvidenciaFoto uri={ordem.fotoUri} style={styles.thumbnail} />
      ) : (
        <View
          style={[
            styles.thumbnail,
            styles.iconeStatus,
            { backgroundColor: STATUS_ORDEM_COR[ordem.status] },
          ]}
        >
          <Ionicons name="alert-circle-outline" size={32} color="#FFFFFF" />
        </View>
      )}

      <View style={styles.conteudo}>
        <View style={styles.topo}>
          <Text style={styles.numero}>Ordem #{ordem.numero}</Text>
          <StatusBadge status={ordem.status} />
        </View>

        <Text style={styles.tipo}>{ordem.tipo}</Text>
        <Text style={styles.detalhe}>{ordem.endereco}</Text>

        {concluida ? (
          <Text style={styles.destaque}>
            {formatarKm(ordem.alturaInicial)} cm → {formatarKm(ordem.alturaFinal)} cm
          </Text>
        ) : (
          <Text style={styles.detalhe} numberOfLines={2}>
            Motivo: {ordem.impedimento?.motivo}
          </Text>
        )}

        {!!data && <Text style={styles.data}>{data}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
    marginTop: 12,
    borderRadius: 16,
    backgroundColor: "#E5E7FF",
  },

  thumbnail: {
    width: 84,
    height: 84,
    borderRadius: 12,
    overflow: "hidden",
  },

  iconeStatus: {
    alignItems: "center",
    justifyContent: "center",
  },

  conteudo: {
    flex: 1,
  },

  topo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    marginBottom: 2,
  },

  numero: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#081EAD",
  },

  tipo: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#202020",
  },

  detalhe: {
    fontSize: 13,
    color: "#4E4E4E",
    marginTop: 2,
  },

  destaque: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#00A152",
    marginTop: 4,
  },

  data: {
    fontSize: 12,
    color: "#6A6A6A",
    marginTop: 4,
  },
});
