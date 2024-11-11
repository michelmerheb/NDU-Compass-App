import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import { FIREBASE_AUTH } from "../../../config/firebaseConfig";
import globalStyles from "../../../styles/globalStyles";
import { Feather } from "@expo/vector-icons";
import SubmitButton from "../../../components/SubmitButton";

export default function EmailVerificationScreen({ navigation }: any) {
  const [isChecking, setIsChecking] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const checkEmailVerified = async () => {
    setIsChecking(true);
    const user = FIREBASE_AUTH.currentUser;
    await user?.reload();
    setEmailVerified(user?.emailVerified || false);
    setIsChecking(false);

    if (user?.emailVerified) {
      navigation.navigate("GetToKnowYouScreen");
    } else {
      alert("Please verify your email before proceeding.");
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <Image
        source={require("../../../assets/NDUCompassLogo.png")}
        style={styles.headerImage}
      />
      <View style={styles.content}>
        <Feather
          name="check-circle"
          size={42}
          color="green"
          style={styles.checkIcon}
        />
        <Text style={styles.infoText}>
          A verification email has been sent to your email address.
        </Text>
        <Text>Please verify your email to proceed.</Text>
        <SubmitButton title="I have verified" onPress={checkEmailVerified} />
        {isChecking && <ActivityIndicator size="large" color="#0000ff" />}
      </View>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  headerImage: {
    width: "100%",
    height: height / 3,
    alignSelf: "center",
    marginBottom: 50,
  },
  checkIcon: {
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  content: {
    flex: 1,
    alignItems: "center",
    marginTop: 50,
    padding: 20,
  },
  infoText: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "skyblue",
    marginTop: 20,
    padding: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
});
