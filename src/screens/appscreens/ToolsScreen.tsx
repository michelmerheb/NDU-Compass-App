import {
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React from "react";
import globalStyles from "../../styles/globalStyles";
import Block from "../../components/Block";

export default function ToolsScreen({ navigation }: any) {
  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView>
          <Block
            imageSource={require("../../assets/GPABackground.webp")}
            title="GPA Calculator"
            onPress={() => navigation.navigate("GPACalculator")}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
