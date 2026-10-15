import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { useRouter } from "expo-router";
import HomeCards from "../../components/HomeCards";
import OrderCard from "../../components/OrderCard";
import EnableMonitoring from "../../components/EnableMonitoring";
import InfoResume from "../../components/InfoResume";
import { Ionicons } from "@expo/vector-icons";
import { useMockData } from "../../context/MockDataContext";
import { STATUS_ORDEM } from "../../utils/ordemServico";

export default function Inicio() {
  const router = useRouter();

  const {
    user,
    ordemServico,
    monitoring,
    iniciarMonitoramento,
  } = useMockData();

  const emAndamento = ordemServico?.status === STATUS_ORDEM.EM_ANDAMENTO;

  const subtituloIniciar = !ordemServico
    ? "Criar ordem"
    : emAndamento
      ? "Em andamento"
      : "Iniciar execução";

  const handleMonitoring = () => {
    iniciarMonitoramento();
    router.push("/(main)/monitoramento");
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundAzul} />
      <View style={styles.backgroundBranco} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.cards}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => router.push("/(main)/perfil")}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="person-circle-outline"
                  size={34}
                  color="#081EAD"
                />
              </TouchableOpacity>

              <Text style={styles.name}>
                Olá, {user.nome}
              </Text>
            </View>

            <InfoResume
              team={user.equipe}
              serviceOrder={ordemServico?.numero}
              address={ordemServico?.endereco}
              schedule={ordemServico?.horario}
              status={ordemServico?.status}
            />

            <EnableMonitoring
              onPress={handleMonitoring}
              status={monitoring.ativo ? "ativo" : "inativo"}
            />

            <Text style={styles.sectionTitle}>Ordem de Serviço</Text>

            <View style={styles.cardsContainer}>
              <OrderCard
                title="INICIAR"
                subtitle={subtituloIniciar}
                image={require("../../assets/iconeIniciar.png")}
                color="#0A3D91"
                dimmed={emAndamento}
                onPress={() => router.push("/(main)/ordem-servico")}
              />

              <OrderCard
                title="CONCLUIR"
                subtitle={emAndamento ? "Registrar roçada" : "Inicie uma ordem"}
                image={require("../../assets/iconeConcluido.png")}
                color="#0F6B3A"
                dimmed={!emAndamento}
                onPress={() => router.push("/(main)/concluir-ordem")}
              />
            </View>

            <View style={styles.cardsContainer}>
              <OrderCard
                title="HISTÓRICO"
                subtitle="Ordens finalizadas e evidências"
                image={require("../../assets/iconeHistorico.png")}
                color="#2F3040"
                horizontal
                onPress={() => router.push("/(main)/historico-ordens")}
              />
            </View>

            <Text style={styles.sectionTitle}>Monitoramento</Text>

            <View style={styles.cardsContainer}>
              <HomeCards
                image={require("../../assets/botaoMapa.png")}
                onPress={() => router.push("/(main)/mapa")}
              />

              <HomeCards
                image={require("../../assets/avisos.png")}
                onPress={() => router.push("/(main)/avisos")}
              />
            </View>

            <Text style={styles.sectionTitle}>Agentes</Text>

            <View style={styles.cardsContainer}>
              <HomeCards
                image={require("../../assets/duvidas.png")}
                onPress={() => router.push("/(main)/duvidas")}
              />

              <HomeCards
                image={require("../../assets/cancelar.png")}
                onPress={() => router.push("/(main)/cancelamento")}
              />
            </View>
          </View>
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
  backgroundAzul: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "45%",
    backgroundColor: "#E5E7FF",
  },
  backgroundBranco: {
    position: "absolute",
    top: "45%",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#202020",
    marginBottom: 7,
    marginTop: 15,
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 10,
  },
  cards: {
    flex: 1,
    justifyContent: "center",
    marginTop: -10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
    gap: 12,
  },

  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#081EAD",
  },
});