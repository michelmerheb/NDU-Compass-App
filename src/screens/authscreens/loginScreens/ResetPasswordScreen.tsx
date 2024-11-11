import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { resetPassword } from "../../../redux/slices/authSlice";
import globalStyles from "../../../styles/globalStyles";
import EmailPasswordBox from "../../../components/EmailPasswordBox";
import SubmitButton from "../../../components/SubmitButton";

export default function ResetPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const error = useSelector((state: RootState) => state.auth.error);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await dispatch(resetPassword({ email })).unwrap();
      Alert.alert("Success", "Email sent, check your inbox!");
      navigation.goBack();
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView behavior="height">
        <ScrollView>
          <Image
            source={require("../../../assets/NDUCompassLogo.png")}
            style={styles.headerImage}
          />
          <EmailPasswordBox
            title="Enter Your email address"
            placeholder="email address"
            secureTextEntry={false}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <SubmitButton title="Reset Password" onPress={handleResetPassword} />
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
        </ScrollView>
      </KeyboardAvoidingView>
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
  errorText: {
    color: "red",
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "lightblue",
    padding: 10,
    margin: 10,
    alignItems: "center",
  },
});
