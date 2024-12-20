import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function CalendarEventsScreen() {
  const { user } = useSelector((state: RootState) => state.auth);
  const isModerator = user?.role === "moderator";

  const handleAddEvent = () => {
    console.log("Add Event Button Pressed");
  };

  return (
    <View style={styles.container}>
      <Text>CalendarEventsScreen</Text>

      {isModerator && <Button title="Add Event" onPress={handleAddEvent} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
