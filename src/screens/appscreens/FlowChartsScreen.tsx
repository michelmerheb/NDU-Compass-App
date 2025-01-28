import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FlowChartViewer from "../../components/FlowChartViewer";

export default function FlowChartsScreen() {
  const [isViewerVisible, setIsViewerVisible] = useState(false);

  const openPDF = () => {
    setIsViewerVisible(true);
  };

  const goBack = () => {
    setIsViewerVisible(false);
  };

  return (
    <View style={styles.container}>
      {!isViewerVisible ? (
        <TouchableOpacity style={styles.majorButton} onPress={openPDF}>
          <Text style={styles.buttonText}>Open Flowchart</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.viewerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <FlowChartViewer />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 32,
    backgroundColor: "#f4f4f4",
  },
  majorButton: {
    padding: 16,
    backgroundColor: "#007bff",
    borderRadius: 8,
    marginVertical: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  viewerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    padding: 16,
    backgroundColor: "#ff6347",
    borderRadius: 8,
    marginVertical: 8,
    alignItems: "center",
  },
});
