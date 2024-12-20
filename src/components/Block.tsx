import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import React from "react";

interface BlockProps {
  imageSource: ImageSourcePropType;
  title: string;
  onPress: () => void;
}

export default function Block({ imageSource, title, onPress }: BlockProps) {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.touchable} onPress={onPress}>
        <Image source={imageSource} style={styles.image} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 20,
  },
  touchable: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  title: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
});
