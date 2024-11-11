import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

interface Props {
  title: string;
}

export default function Header({ title }: Props) {
  return (
    <View style={styles.titleView}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  titleView: {
    height: height / 4.2,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  title: {
    textAlign: "center",
    fontSize: 45,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
});
