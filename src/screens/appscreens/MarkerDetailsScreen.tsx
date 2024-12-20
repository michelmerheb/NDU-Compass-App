import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

type Marker = {
  id: number;
  name: string;
  top: number;
  left: number;
  images?: any[];
};

export default function MarkerDetailsScreen({ route, navigation }: any) {
  const { marker }: { marker: Marker } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = marker.images ?? [];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{marker.name}</Text>

      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={handlePrev}>
          <AntDesign name="leftcircle" size={30} color="lightgray" />
        </TouchableOpacity>

        <Image source={images[currentIndex]} style={styles.markerImage} />

        <TouchableOpacity onPress={handleNext}>
          <AntDesign name="rightcircle" size={30} color="lightgray" />
        </TouchableOpacity>
      </View>

      <Text style={styles.imageCounter}>
        {currentIndex + 1} / {images.length}
      </Text>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#005eb8",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.9,
    height: height * 0.5,
  },
  markerImage: {
    width: 700,
    height: 500,
    borderRadius: 10,
    resizeMode: "contain",
  },
  imageCounter: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    left: 10,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
