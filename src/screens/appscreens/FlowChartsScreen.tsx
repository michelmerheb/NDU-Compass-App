import React, { useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { WebView } from "react-native-webview";

interface Major {
  id: string;
  name: string;
  pdfUrl: string;
}

const majors: Major[] = [
  {
    id: "1",
    name: "Computer Science",
    pdfUrl: "https://example.com/computer-science.pdf",
  },
  {
    id: "2",
    name: "Electrical Engineering",
    pdfUrl: "https://example.com/electrical-engineering.pdf",
  },
  {
    id: "3",
    name: "Mechanical Engineering",
    pdfUrl: "https://example.com/mechanical-engineering.pdf",
  },
];

export default function FlowChartsScreen() {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <FlatList
        data={majors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.majorButton}
            onPress={() => setSelectedPdf(item.pdfUrl)}
          >
            <Text style={styles.majorText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal
        visible={!!selectedPdf}
        onRequestClose={() => setSelectedPdf(null)}
      >
        <View style={{ flex: 1 }}>
          {selectedPdf && (
            <WebView
              source={{ uri: selectedPdf }}
              style={{ flex: 1 }}
              onError={() => console.error("Failed to load PDF")}
            />
          )}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedPdf(null)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  majorButton: {
    padding: 16,
    backgroundColor: "#007bff",
    borderRadius: 8,
    marginVertical: 8,
    alignItems: "center",
  },
  majorText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 16,
    backgroundColor: "red",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
