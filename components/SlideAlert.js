import React from "react";
import { Text, StyleSheet, Animated, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SlideAlert({ slideAnim, message, backgroundColor = '#00C853' }) {
  if (!message) return null;

  return (
    <Animated.View
      style={[
        styles.alertBox,
        {
          transform: [{ translateY: slideAnim }],
          backgroundColor: backgroundColor // Condicional dinâmica baseada na prop injetada
        },
      ]}
    >
      <SafeAreaView>
        <Text style={styles.alertText}>{message}</Text>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  alertBox: {
    position: 'absolute',     
    top: Platform.OS === 'ios' ? 40 : 20, 
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 12,
    zIndex: 9999,             
    elevation: 10,            
    shadowColor: '#000',     
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  alertText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});