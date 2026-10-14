import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { STATUS_INFO, STATUS_AGUARDANDO } from "../utils/vegetationStatus";

const PRIORIDADE_STATUS = {
  vermelho: 3,
  amarelo: 2,
  verde: 1,
  [STATUS_AGUARDANDO]: 0,
};

const HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map { margin: 0; padding: 0; height: 100%; width: 100%; background: #E5E3DF; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map = L.map("map", { zoomControl: true, attributionControl: true })
      .setView([-23.58, -46.63], 9);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    var camada = L.layerGroup().addTo(map);

    window.setPontos = function (pontos, ajustar) {
      camada.clearLayers();
      var limites = [];

      pontos.forEach(function (p) {
        L.circleMarker([p.lat, p.lng], {
          radius: 6,
          color: "#FFFFFF",
          weight: 1.5,
          fillColor: p.cor,
          fillOpacity: 1
        })
          .on("click", function () {
            window.ReactNativeWebView.postMessage(String(p.id));
          })
          .addTo(camada);
        limites.push([p.lat, p.lng]);
      });

      if (ajustar && limites.length > 0) {
        map.fitBounds(limites, { padding: [20, 20], animate: true });
      }
    };

    window.ReactNativeWebView.postMessage("pronto");
  </script>
</body>
</html>`;

export default function RodoanelLeafletMap({
  trechos,
  trechoSelecionado,
  onSelecionarPonto,
  onInteracaoMapa,
}) {
  const webViewRef = useRef(null);
  const [pronto, setPronto] = useState(false);

  const pontosVisiveis = useMemo(() => {
    const chaves =
      trechoSelecionado === "todos" ? Object.keys(trechos) : [trechoSelecionado];

    return chaves.flatMap((chave) => trechos[chave].pontos);
  }, [trechos, trechoSelecionado]);

  useEffect(() => {
    if (!pronto || !webViewRef.current) return;

    // Pontos mais críticos por último, para ficarem desenhados por cima.
    const dados = [...pontosVisiveis]
      .sort((a, b) => PRIORIDADE_STATUS[a.status] - PRIORIDADE_STATUS[b.status])
      .map((ponto) => ({
        id: ponto.id,
        lat: ponto.latitude,
        lng: ponto.longitude,
        cor: STATUS_INFO[ponto.status].color,
      }));

    webViewRef.current.injectJavaScript(
      `window.setPontos(${JSON.stringify(dados)}, true); true;`
    );
  }, [pronto, pontosVisiveis]);

  const handleMessage = (event) => {
    const mensagem = event.nativeEvent.data;

    if (mensagem === "pronto") {
      setPronto(true);
      return;
    }

    const ponto = pontosVisiveis.find((p) => String(p.id) === mensagem);
    if (ponto) onSelecionarPonto(ponto);
  };

  return (
    <View
      style={styles.container}
      // Enquanto o dedo está no mapa, a ScrollView da tela fica travada para
      // não roubar os gestos de arrastar e de pinça (zoom) da WebView.
      onTouchStart={() => onInteracaoMapa && onInteracaoMapa(true)}
      onTouchEnd={() => onInteracaoMapa && onInteracaoMapa(false)}
      onTouchCancel={() => onInteracaoMapa && onInteracaoMapa(false)}
    >
      <WebView
        ref={webViewRef}
        // baseUrl dá uma origem http válida às requisições de tiles do OpenStreetMap
        source={{ html: HTML, baseUrl: "https://ecotrack.app" }}
        originWhitelist={["*"]}
        javaScriptEnabled
        nestedScrollEnabled
        scrollEnabled={false}
        overScrollMode="never"
        domStorageEnabled
        onMessage={handleMessage}
        style={styles.web}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#00C853" />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 340,
  },

  web: {
    flex: 1,
    backgroundColor: "#E5E3DF",
  },

  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E5E3DF",
  },
});
