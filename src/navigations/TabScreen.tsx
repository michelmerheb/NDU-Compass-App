import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/appscreens/HomeScreen";
import GPACalculator from "../screens/appscreens/GPACalculator";
import { Feather, AntDesign } from "@expo/vector-icons";
import { Dimensions, StyleSheet } from "react-native";

const Tab = createBottomTabNavigator();

const TabScreens = ({ navigation }: any) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Feather.glyphMap;
          size = focused ? 25 : 20;
          if (route.name === "Home") {
            return <Feather name="home" size={size} color={color} />;
          } else if (route.name === "GPA") {
            return <AntDesign name="calculator" size={size} color={color} />;
          }
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 50,
        },
        tabBarActiveTintColor: "#005eb8",
        tabBarInactiveTintColor: "gray",
        headerTitleStyle: {
          fontSize: 20,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: true,
          title: "NDU Compass",
        }}
      />
      <Tab.Screen
        name="GPA"
        component={GPACalculator}
        options={{ headerShown: true, title: "GPA Calculator" }}
      />
    </Tab.Navigator>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  headerImage: {
    width: width / 2,
    height: height / 4,
    marginTop: 10,
  },
});

export default TabScreens;
