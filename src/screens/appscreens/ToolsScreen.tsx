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
          <Block
            imageSource={require("../../assets/countdown.jpg")}
            title="Exam Countdown"
            onPress={() => navigation.navigate("ExamCountdown")}
          />
          <Block
            imageSource={require("../../assets/freestuff.jpg")}
            title="Free Stuff Board"
            onPress={() => navigation.navigate("FreeStuff")}
          />
          <Block
            imageSource={require("../../assets/quicknotes.jpg")}
            title="Quick Notes"
            onPress={() => navigation.navigate("QuickNotes")}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
