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

export default function HomeScreen() {
  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView>
          <Block
            imageSource={require("../../assets/Students.jpg")}
            title="Calendar and events"
          />
          <Block
            imageSource={require("../../assets/GraduationPic.png")}
            title="Graduation info"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
