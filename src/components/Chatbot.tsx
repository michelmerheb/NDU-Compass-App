import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { sendToDialogflow } from "../services/DialogflowService";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Message {
  text: string;
  isBot: boolean;
  timestamp: number;
  isError?: boolean;
}

const ChatbotComponent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const flatListRef = useRef<FlatList>(null);

  // Load chat history on component mount
  useEffect(() => {
    const defaultMessage: Message = {
      text: "Welcome! What can I help you with today?",
      isBot: true,
      timestamp: Date.now(),
    };
    setMessages([defaultMessage]);
  }, []);

  // Save chat history whenever messages change
  useEffect(() => {
    AsyncStorage.setItem("chat_history", JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      text: inputMessage,
      isBot: false,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    try {
      // Get bot response
      const botResponse = await sendToDialogflow(inputMessage);
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        text: "Sorry, I'm having trouble connecting to the server.",
        isBot: true,
        isError: true,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isBot ? styles.botMessageContainer : styles.userMessageContainer,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.isError && styles.errorText,
          item.isBot ? styles.botMessageText : styles.userMessageText,
        ]}
      >
        {item.text}
      </Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.timestamp.toString()}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="Type your message..."
            placeholderTextColor="#999"
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={!inputMessage.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flex: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  messageContainer: {
    maxWidth: "80%",
    marginVertical: 8,
    padding: 12,
    borderRadius: 15,
  },
  botMessageContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#ccc",
    borderBottomLeftRadius: 5,
  },
  userMessageContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 5,
  },
  messageText: {
    fontSize: 16,
  },
  botMessageText: {
    color: "#333",
  },
  userMessageText: {
    color: "#fff",
  },
  errorText: {
    color: "#ff4444",
  },
  timestamp: {
    fontSize: 12,
    color: "#333",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#007AFF",
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default ChatbotComponent;
