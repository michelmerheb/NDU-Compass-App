import {
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import React, { useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { loginUser, clearError } from "../../../redux/slices/authSlice";
import globalStyles from "../../../styles/globalStyles";
import Header from "../../../components/Header";
import SubmitButton from "../../../components/SubmitButton";
import EmailPasswordBox from "../../../components/EmailPasswordBox";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

export default function LoginScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { user, error, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSignup = () => {
    navigation.navigate("SignUp");
  };

  const handleResetPassword = () => {
    navigation.navigate("ResetPasswordScreen");
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView behavior="height">
        <ScrollView>
          <Image
            source={require("../../../assets/NDUCompassLogo.png")}
            style={styles.logo}
          />
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={(values) => {
              dispatch(loginUser(values));
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                {error && <Text style={styles.authErrorText}>{error}</Text>}
                <EmailPasswordBox
                  title="Email"
                  placeholder="Email"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={() => handleBlur("email")}
                />
                {errors.email && touched.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}

                <EmailPasswordBox
                  title="Password"
                  placeholder="Password"
                  secureTextEntry={true}
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={() => handleBlur("password")}
                />
                {errors.password && touched.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}

                <SubmitButton
                  title={isLoading ? "Logging in..." : "Log In"}
                  onPress={handleSubmit}
                />
              </>
            )}
          </Formik>

          <TouchableOpacity
            style={styles.forgotView}
            onPress={handleResetPassword}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={styles.SignupContainer}>
            <Text style={styles.signupText}>Doesn't have account?</Text>
            <TouchableOpacity
              onPress={handleSignup}
              style={{ paddingHorizontal: 5 }}
            >
              <Text style={styles.signupLinkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 300,
    alignSelf: "center",
  },
  authErrorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    marginLeft: 10,
    marginBottom: 10,
  },
  forgotView: {
    margin: 20,
    marginHorizontal: 120,
    alignItems: "center",
  },
  forgotText: {
    fontSize: 12,
    color: "white",
    shadowColor: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  SignupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    textAlign: "center",
    color: "skyblue",
    shadowOffset: { width: 0, height: 1 },
    fontSize: 15,
  },
  signupLinkText: {
    color: "white",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    fontWeight: "bold",
  },
});
