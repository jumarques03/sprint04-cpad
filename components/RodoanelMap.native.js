import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { STATUS_INFO, STATUS_AGUARDANDO } from "../utils/vegetationStatus";
import RodoanelLeafletMap from "./RodoanelLeafletMap";

const PRIORIDADE_STATUS = {
  vermelho: 3,
  amarelo: 2,
  verde: 1,
  [STATUS_AGUARDANDO]: 0,
};

function calcularRegiao(pontos) {
  const latitudes = pontos.map((p) => p.latitude);
  const longitudes = pontos.map((p) => p.longitude);

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max(maxLat - minLat, 0.05) * 1.6,
    longitudeDelta: Math.max(maxLng - minLng, 0.05) * 1.6,
  };
}

// No Android o mapa do Google exige chave de API (sem ela só aparece uma grade
// cinza), então usamos um mapa Leaflet/OpenStreetMap dentro de uma WebView.
// No iOS o react-native-maps usa o Apple Maps, que não precisa de chave.
export default function RodoanelMap(props) {
  if (Platform.OS === "android") {
    return <RodoanelLeafletMap {...props} />;
  }

  return <RodoanelMapNativo {...props} />;
}

function RodoanelMapNativo({
  trechos,
  trechoSelecionado,
  regiaoInicial,
  onSelecionarPonto,
}) {
  const mapRef = useRef(null);
  const [marcadoresProntos, setMarcadoresProntos] = useState(false);

  const chavesTrechos =
    trechoSelecionado === "todos" ? Object.keys(trechos) : [trechoSelecionado];

  const pontosVisiveis = chavesTrechos.flatMap((chave) => trechos[chave].pontos);

  useEffect(() => {
    if (!mapRef.current || pontosVisiveis.length === 0) return;

    const regiao = calcularRegiao(pontosVisiveis);
    mapRef.current.animateToRegion(regiao, 450);
  }, [trechoSelecionado]);

  useEffect(() => {
    // Marcadores customizados precisam de tracksViewChanges=true no primeiro
    // desenho, senão a bolinha fica invisível (o mapa "fotografa" a view
    // antes dela terminar de renderizar). Depois de desenhar, congelamos
    // para não pesar o app com tantos pontos na tela.
    setMarcadoresProntos(false);
    const temporizador = setTimeout(() => setMarcadoresProntos(true), 500);
    return () => clearTimeout(temporizador);
  }, [trechoSelecionado]);

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={regiaoInicial}
    >
      {pontosVisiveis.map((ponto) => (
        <Marker
          key={ponto.id}
          coordinate={{ latitude: ponto.latitude, longitude: ponto.longitude }}
          anchor={{ x: 0.5, y: 0.5 }}
          tracksViewChanges={!marcadoresProntos}
          zIndex={PRIORIDADE_STATUS[ponto.status]}
          onPress={() => onSelecionarPonto(ponto)}
        >
          <View
            style={[
              styles.bolinha,
              { backgroundColor: STATUS_INFO[ponto.status].color },
            ]}
          />
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: 340,
  },

  bolinha: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    elevation: 3,
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
});
