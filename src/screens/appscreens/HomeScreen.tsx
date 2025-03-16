// HomeScreen.tsx

import {
  SafeAreaView,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useState } from "react";
import globalStyles from "../../styles/globalStyles";
import { FontAwesome } from "@expo/vector-icons";
import Block from "../../components/Block";
import Chatbot from "../../components/Chatbot";

export default function HomeScreen({ navigation }: any) {
  const [isChatbotVisible, setChatbotVisible] = useState(false);

  const toggleChatbot = () => setChatbotVisible(!isChatbotVisible);

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView>
          <Block
            imageSource={require("../../assets/events.jpg")}
            title="Calendar and events"
            onPress={() => navigation.navigate("CalendarEventScreen")}
          />
          <Block
            imageSource={require("../../assets/NDUCampus.jpg")}
            title="NDU Map Tour"
            onPress={() => navigation.navigate("NduMapScreen")}
          />
          <Block
            imageSource={require("../../assets/FlowChart.jpg")}
            title="Flow Charts"
            onPress={() => navigation.navigate("FlowCharts")}
          />
          <Block
            imageSource={require("../../assets/Students.jpg")}
            title="Study Group"
            onPress={() => navigation.navigate("StudyGroup")}
          />
          <Block
            imageSource={require("../../assets/FlowChart.jpg")}
            title="Quiz Generator"
            onPress={() => navigation.navigate("QuizGenerator")}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <TouchableOpacity style={styles.chatbotButton} onPress={toggleChatbot}>
        <FontAwesome name="wechat" size={24} color="white" />
      </TouchableOpacity>

      <Modal visible={isChatbotVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.chatbotModal}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={toggleChatbot}
            >
              <FontAwesome name="close" size={30} color="white" />
            </TouchableOpacity>
            <Chatbot />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chatbotButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007AFF",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 20,
    backgroundColor: "#FF3B30",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  chatbotModal: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 10,
    paddingTop: 60,
    paddingHorizontal: 10,
  },
});
