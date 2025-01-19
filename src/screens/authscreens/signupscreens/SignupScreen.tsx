import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { signupUser, clearError } from "../../../redux/slices/authSlice";
import globalStyles from "../../../styles/globalStyles";
import Header from "../../../components/Header";
import EmailPasswordBox from "../../../components/EmailPasswordBox";
import SubmitButton from "../../../components/SubmitButton";

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null as any], "Passwords must match")
    .required("Required"),
});

export default function SignupScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { user, error, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (user && !user.emailVerified) {
      setEmailSent(true);
      navigation.navigate("EmailVerificationScreen");
    }
  }, [user, navigation]);

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView>
          <Header title="Welcome to NDU Compass" />
          <Formik
            initialValues={{ email: "", password: "", confirmPassword: "" }}
            validationSchema={SignUpSchema}
            onSubmit={(values) => {
              dispatch(
                signupUser({ email: values.email, password: values.password })
              );
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
                {emailSent && (
                  <Text style={styles.emailSentText}>
                    Verification email sent. Please check your email.
                  </Text>
                )}
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

                <EmailPasswordBox
                  title="Confirm Password"
                  placeholder="Confirm Password"
                  secureTextEntry={true}
                  value={values.confirmPassword}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={() => handleBlur("confirmPassword")}
                />
                {errors.confirmPassword && touched.confirmPassword ? (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                ) : null}

                <SubmitButton
                  title={isLoading ? "Signing Up..." : "Sign Up"}
                  onPress={handleSubmit}
                />
              </>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    marginLeft: 10,
    marginBottom: 10,
  },
  authErrorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  emailSentText: {
    color: "green",
    textAlign: "center",
    marginBottom: 10,
  },
});
