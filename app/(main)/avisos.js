import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";

import Header from "../../components/Header";
import Warning from "../../components/Warning";

import { useMockData } from "../../context/MockDataContext";

export default function Avisos() {
  // Agora puxamos também a função marcarComoLida do contexto
  const { notifications, marcarComoLida } = useMockData();

  return (
    <View style={styles.container}>
      <Header title="Avisos Gerais" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Fique atento aos avisos da operação.
        </Text>

        {notifications.length === 0 ? (
          <Warning
            title="Sem avisos"
            message="Nenhum aviso anunciado."
            date=""
            hour=""
          />
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              activeOpacity={0.7}
              onPress={() => marcarComoLida(notification.id)}
              // Reduz a opacidade caso o aviso já tenha sido lido para dar feedback visual
              style={{ opacity: notification.read ? 0.6 : 1, marginBottom: 12 }} 
            >
              <Warning
                title={notification.title}
                message={notification.message}
                date={notification.date}
                hour={notification.hour}
              />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 40,
  },

  subtitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#081EAD",
    textAlign: "center",
    marginBottom: 18,
  },
});