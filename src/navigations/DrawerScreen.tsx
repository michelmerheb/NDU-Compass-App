import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ToolsScreen from "../screens/appscreens/ToolsScreen";
import LogoutScreen from "../screens/appscreens/LogoutScreen";
import GPACalculator from "../screens/appscreens/GPACalculator";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();

export default function DrawerScreens() {
  const GpaCalculator = () => {
    return <FontAwesome5 name="tools" size={24} color="#005eb8" />;
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
        name="Tools"
        component={ToolsScreen}
        options={{ drawerIcon: GpaCalculator }}
      />
      <Drawer.Screen
        name="Logout"
        component={LogoutScreen}
        options={{ drawerIcon: LogoutIcon }}
      />
    </Drawer.Navigator>
  );
}
