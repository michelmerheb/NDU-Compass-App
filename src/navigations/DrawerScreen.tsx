import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import GPACalculator from "../screens/appscreens/GPACalculator";
import LogoutScreen from "../screens/appscreens/LogoutScreen";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();

export default function DrawerScreens() {
  const GpaCalculator = () => {
    return <AntDesign name="calculator" size={24} color="#005eb8" />;
  };

  const LogoutIcon = () => {
    return <AntDesign name="logout" size={24} color="#005eb8" />;
  };
  return (
    <Drawer.Navigator
      screenOptions={{
        headerTintColor: "#005eb8",
        drawerActiveTintColor: "#005eb8",
        drawerInactiveTintColor: "grey",
        drawerStyle: { backgroundColor: "white" },
        drawerLabelStyle: { fontSize: 20 },
      }}
    >
      <Drawer.Screen
        name="GPA"
        component={GPACalculator}
        options={{
          headerShown: true,
          title: "GPA Calculator",
          drawerIcon: GpaCalculator,
        }}
      />
      <Drawer.Screen
        name="Logout"
        component={LogoutScreen}
        options={{ drawerIcon: LogoutIcon }}
      />
    </Drawer.Navigator>
  );
}
