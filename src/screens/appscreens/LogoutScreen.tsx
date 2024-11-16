import React, { useEffect, useState } from "react";
import { Text, View, ActivityIndicator, Alert } from "react-native";
import { logout } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { useFocusEffect } from "@react-navigation/native";

export default function LogoutScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const [alertShown, setAlertShown] = useState(false);
  const [cancelPressed, setCancelPressed] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setAlertShown(false);
      setCancelPressed(false);
    }, [])
  );

  useEffect(() => {
    if (!alertShown && !cancelPressed) {
      setAlertShown(true);
      Alert.alert("Logout", "Are you sure you want to logout?", [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {
            setCancelPressed(true);
            navigation.goBack();
          },
        },
        {
          text: "Logout",
          onPress: () => dispatch(logout()),
        },
      ]);
    }
  }, [alertShown, cancelPressed, dispatch, navigation]);

  if (cancelPressed) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#005eb8" />
      <Text style={styles.logoutText}>Logging out...</Text>
    </View>
  );
}

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: {
    color: "black",
    fontSize: 20,
  },
});
