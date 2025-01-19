import React, { useEffect } from "react";
import {
  Modal,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  GestureHandlerGestureEvent,
  State,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface FlowchartViewerProps {
  image: any;
  visible: boolean;
  onClose: () => void;
}

export function FlowchartViewer({
  image,
  visible,
  onClose,
}: FlowchartViewerProps) {
  const scale = useSharedValue(1);
  const baseScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePinch = (event: GestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.BEGAN) {
      baseScale.value = scale.value;
    }
    if (event.nativeEvent.state === State.ACTIVE) {
      scale.value = baseScale.value * (event.nativeEvent as any).scale;
    }
    if (
      event.nativeEvent.state === State.END ||
      event.nativeEvent.state === State.CANCELLED
    ) {
      baseScale.value = scale.value;
    }
  };

  useEffect(() => {
    const lockOrientation = async () => {
      if (visible) {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      } else {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );
      }
    };

    if (visible) lockOrientation();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, [visible]);

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <GestureHandlerRootView style={styles.fullScreen}>
        <PinchGestureHandler onGestureEvent={handlePinch}>
          <Animated.Image
            source={image}
            style={[styles.image, animatedStyle]}
            resizeMode="contain"
          />
        </PinchGestureHandler>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: screenWidth,
    height: screenHeight,
  },
  closeButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
