import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Zoomable } from "@likashefqet/react-native-image-zoom";
import { Image } from "expo-image";
import * as ScreenOrientation from "expo-screen-orientation";
import { useNavigation } from "@react-navigation/native";

type Marker = {
  id: number;
  name: string;
  top: number;
  left: number;
  images?: any[];
};

export default function CampusMap({ navigation }: any) {
  const [imageSize, setImageSize] = useState({ width: 1, height: 1 });

  const markers: Marker[] = [
    {
      id: 1,
      name: "Library",
      top: 32,
      left: 73,
      images: [
        require("../../assets/Library1.jpg"),
        require("../../assets/Library2.jpg"),
        require("../../assets/Library3.jpg"),
      ],
    },
    {
      id: 2,
      name: "Old building",
      top: 44,
      left: 62,
      images: [
        require("../../assets/OldBuilding1.jpg"),
        require("../../assets/OldBuilding2.jpg"),
        require("../../assets/OldBuilding3.jpg"),
        require("../../assets/OldBuilding4.jpg"),
        require("../../assets/OldBuilding5.jpg"),
        require("../../assets/OldBuilding6.jpg"),
      ],
    },
    {
      id: 3,
      name: "New building",
      top: 50,
      left: 70,
      images: [
        require("../../assets/NewBuilding1.jpg"),
        require("../../assets/NewBuilding2.jpg"),
      ],
    },
  ];

  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    };
    lockOrientation();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const handleImageLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setImageSize({ width, height });
  };

  const calculatePosition = (marker: Marker) => {
    return {
      top: (marker.top / 100) * imageSize.height,
      left: (marker.left / 100) * imageSize.width,
    };
  };

  return (
    <View style={{ flex: 1 }}>
      <Zoomable
        minScale={1}
        maxScale={5}
        doubleTapScale={2.5}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }} onLayout={handleImageLayout}>
          <Image
            style={styles.image}
            source={require("../../assets/Map.png")}
            contentFit="cover"
          />

          {markers.map((marker) => {
            const position = calculatePosition(marker);
            return (
              <View
                key={marker.id}
                style={[
                  styles.markerContainer,
                  { top: position.top, left: position.left },
                ]}
              >
                <TouchableOpacity
                  style={styles.marker}
                  onPress={() =>
                    navigation.navigate("MarkerDetailsScreen", { marker })
                  }
                />
                <Text style={styles.markerLabel}>{marker.name}</Text>
              </View>
            );
          })}
        </View>
      </Zoomable>
    </View>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    position: "absolute",
    alignItems: "center",
  },
  marker: {
    width: 20,
    height: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  markerLabel: {
    marginTop: 5,
    fontSize: 15,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "black",
    shadowOpacity: 0.5,
    color: "white",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
