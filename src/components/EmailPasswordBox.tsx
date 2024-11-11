import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  KeyboardTypeOptions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  title: string;
  placeholder: string;
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  keyboardType?: KeyboardTypeOptions;
}

export default function EmailPasswordBox({
  title,
  placeholder,
  secureTextEntry,
  onChangeText,
  value,
  onBlur,
  keyboardType = "default",
}: Props) {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.inputName}>{title}</Text>
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          autoCapitalize="none"
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          keyboardType={keyboardType}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={togglePasswordVisibility}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.15,
    justifyContent: "center",
    padding: 10,
  },
  inputName: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    width: "100%",
    padding: 15,
    paddingLeft: 25,
    marginTop: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 50,
  },
  toggleButton: {
    position: "absolute",
    right: 15,
    padding: 10,
  },
});
