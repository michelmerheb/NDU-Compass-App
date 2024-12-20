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
            imageSource={require("../../assets/Students.jpg")}
            title="Calendar and events"
            onPress={() => navigation.navigate("FlowCharts")}
          />
          <Block
            imageSource={require("../../assets/NDUCampus.jpg")}
            title="NDU Map Tour"
            onPress={() => navigation.navigate("NduMapScreen")}
          />
          <Block
            imageSource={require("../../assets/FlowChart.jpg")}
            title="FLow Charts"
            onPress={() => navigation.navigate("FlowCharts")}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <TouchableOpacity style={styles.chatbotButton} onPress={toggleChatbot}>
        <FontAwesome name="wechat" size={24} color="white" />
      </TouchableOpacity>

      <Modal visible={isChatbotVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={toggleChatbot}>
            <FontAwesome name="close" size={30} color="white" />
          </TouchableOpacity>
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
    top: 20,
    right: 20,
    backgroundColor: "#FF3B30",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
