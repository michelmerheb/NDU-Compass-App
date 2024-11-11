import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import LoginScreen from "../screens/authscreens/loginScreens/LoginScreen";
import SignupScreen from "../screens/authscreens/signupscreens/SignupScreen";
import HomeScreen from "../screens/appscreens/HomeScreen";
import ResetPasswordScreen from "../screens/authscreens/loginScreens/ResetPasswordScreen";
import EmailVerificationScreen from "../screens/authscreens/signupscreens/EmailVerificationScreen";
const Stack = createStackNavigator();

export default function StackScreens() {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuth } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuth ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignupScreen} />
          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
          />
          <Stack.Screen
            name="EmailVerificationScreen"
            component={EmailVerificationScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
