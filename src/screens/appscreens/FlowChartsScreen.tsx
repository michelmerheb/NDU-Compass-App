import React, { useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FlowchartViewer } from "../../components/FlowChartViewer";

const majors = [
  {
    id: "1",
    name: "Computer Science",
    image: require("../../assets/CS-FlowChart.png"),
  },
  {
    id: "2",
    name: "Information Technology",
    image: require("../../assets/IT-FlowChart.png"),
  },
];

export default function FlowChartsScreen() {
  const [selectedImage, setSelectedImage] = useState<any | null>(null);

  return (
    <View style={styles.container}>
      <FlatList
        data={majors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.majorButton}
            onPress={() => setSelectedImage(item.image)}
          >
            <Text style={styles.majorText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <FlowchartViewer
        image={selectedImage}
        visible={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 32,
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
});
