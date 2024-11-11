import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  KeyboardTypeOptions,
} from "react-native";

interface Props {
  title: string;
  placeholder: string;
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  keyboardType?: KeyboardTypeOptions;
}
export default function NameInputBox({
  title,
  placeholder,
  secureTextEntry,
  onChangeText,
  value,
  onBlur,
  keyboardType = "default",
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.inputName}>{title}</Text>
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          keyboardType={keyboardType}
        />
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
  },
  inputBox: {
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: 15,
    marginTop: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 5,
  },
});
