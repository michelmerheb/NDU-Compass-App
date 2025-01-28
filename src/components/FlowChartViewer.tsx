import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system";

export default function FlowChartViewer() {
  const [loading, setLoading] = useState(true);
  const [fileUri, setFileUri] = useState<string | null>(null);

  useEffect(() => {
    // Get the local file URI for the PDF
    const loadPdf = async () => {
      try {
        const pdfUri = FileSystem.documentDirectory + "IT-Course FlowChart.pdf";
        const fileInfo = await FileSystem.getInfoAsync(pdfUri);

        if (!fileInfo.exists) {
          // If the file doesn't exist, copy it from the app bundle
          await FileSystem.downloadAsync(
            require("../assets/IT-Course FlowChart.pdf"),
            pdfUri
          );
        }
        setFileUri(pdfUri); // Set the local file URI
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    loadPdf();
  }, []);

  const handleLoad = () => {
    setLoading(false); // Hide the loader once the WebView has loaded
  };

  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      )}
      {fileUri && (
        <WebView
          source={{ uri: fileUri }}
          style={styles.webview}
          onLoad={handleLoad}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    position: "absolute",
    top: "50%",
  },
  webview: {
    flex: 1,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
