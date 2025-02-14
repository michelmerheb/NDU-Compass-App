import { View, Text } from "react-native";
import React from "react";
import StudyGroupForm from "../../components/StudyGroupForm";
import StudyGroupsList from "../../components/StudyGroupsList";

export default function StudyGroupScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#005eb8" }}>
      <StudyGroupForm />
      <StudyGroupsList />
    </View>
  );
}
