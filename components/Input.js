import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MaskInput from "react-native-mask-input";

export default function Input({ children }) {
  return <View>{children}</View>;
}

export function CustomInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  isPassword,
  senhaVisivel,
  setSenhaVisivel,
  erro,
  ...props
}) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.tituloInput}>{label}</Text>}

      <View style={[styles.inputContainer, isPassword && styles.senhaContainer]}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#868181"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          style={[
            isPassword ? styles.senhaInput : styles.input
          ]}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
            <Ionicons
              name={senhaVisivel ? "eye-off" : "eye"}
              color="#868181"
              size={24}
            />
          </TouchableOpacity>
        )}
      </View>

      {erro && <Text style={styles.erro}>{erro}</Text>}
    </View>
  );
}

export function CPFInput({
  label,
  placeholder,
  value,
  onChangeText,
  erro,
  ...props
}) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.tituloInput}>{label}</Text>}

      <View style={styles.inputContainer}>
        <MaskInput
          style={[styles.input]}
          placeholder={placeholder}
          placeholderTextColor="#868181"
          value={value}
          onChangeText={onChangeText}
          mask={[
            /\d/, /\d/, /\d/,
            ".",
            /\d/, /\d/, /\d/,
            ".",
            /\d/, /\d/, /\d/,
            "-",
            /\d/, /\d/,
          ]}
          keyboardType="numeric"
          {...props}
        />
      </View>

      {erro && <Text style={styles.erro}>{erro}</Text>}
    </View>
  );
}

export function PhoneNumberInput({
  label,
  placeholder,
  value,
  onChangeText,
  erro,
  ...props
}) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.tituloInput}>{label}</Text>}

      <View style={styles.inputContainer}>
        <MaskInput
          style={[styles.input]}
          placeholder={placeholder}
          placeholderTextColor="#868181"
          value={value}
          onChangeText={onChangeText}
          mask={[
            "(",
            /\d/, /\d/,
            ")",
            " ",
            /\d/,
            /\d/, /\d/, /\d/, /\d/,
            "-",
            /\d/, /\d/, /\d/, /\d/,
          ]}
          keyboardType="phone-pad"
          {...props}
        />
      </View>

      {erro && <Text style={styles.erro}>{erro}</Text>}
    </View>
  );
}

export function TimeInput({
  label,
  placeholder,
  value,
  onChangeText,
  erro,
  ...props
}) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.tituloInput}>{label}</Text>}

      <View style={styles.inputContainer}>
        <MaskInput
          style={[styles.input]}
          placeholder={placeholder}
          placeholderTextColor="#868181"
          value={value}
          onChangeText={onChangeText}
          mask={[/\d/, /\d/, ":", /\d/, /\d/]}
          keyboardType="numeric"
          {...props}
        />
      </View>

      {erro && <Text style={styles.erro}>{erro}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    marginTop: 10,
  },

  tituloInput: {
    color: "#6A6A6A",
    fontSize: 14,
    marginBottom: 4,
  },

  inputContainer: {
    width: "100%",
  },

  input: {
    borderWidth: 2,
    borderColor: "#6A6A6A",
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: "#000000",
  },

  inputErro: {
    borderColor: "#EC4040",
  },

  senhaContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#6A6A6A",
    borderRadius: 12,
    paddingRight: 10,
  },

  senhaInput: {
    flex: 1,
    padding: 14,
    fontSize: 14,
    color: "#000000",
  },

  erro: {
    color: "#EC4040",
    marginTop: 4,
    marginLeft: 4,
    fontSize: 14,
  },
});