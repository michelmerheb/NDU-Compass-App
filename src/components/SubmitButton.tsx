import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface Props {
  title: string;
  destination?: string;
  onPress: () => void;
}
export default function SubmitButton({ title, destination, onPress }: Props) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.25,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "skyblue",
    padding: 15,
    borderRadius: 5,
    width: "30%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
});
