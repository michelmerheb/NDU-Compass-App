// components/StudyGroupForm.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { createStudyRequest } from "../redux/slices/studyGroupSlice";
import { AppDispatch, RootState } from "../redux/store";
import { Ionicons } from "@expo/vector-icons"; // Make sure you have this installed

const StudyGroupForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [isExpanded, setIsExpanded] = useState(false);
  const [course, setCourse] = useState("");
  const [availableTimes, setAvailableTimes] = useState("");
  const [note, setNote] = useState("");

  // Animation values
  const spinValue = useRef(new Animated.Value(0)).current;
  const heightValue = useRef(new Animated.Value(0)).current;

  const toggleAccordion = () => {
    Animated.parallel([
      Animated.timing(spinValue, {
        toValue: isExpanded ? 0 : 1,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(heightValue, {
        toValue: isExpanded ? 0 : 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }),
    ]).start();
    setIsExpanded(!isExpanded);
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const contentHeight = heightValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 400], // Adjust based on your content height
  });

  const handleSubmit = () => {
    if (!currentUser?.uid) {
      Alert.alert("Error", "You must be logged in to create a study request.");
      return;
    }

    if (!course.trim() || !availableTimes.trim()) {
      Alert.alert("Missing Information", "Please fill in the required fields.");
      return;
    }

    dispatch(
      createStudyRequest({
        userId: currentUser.uid,
        course: course.trim(),
        availableTimes: availableTimes.trim(),
        note: note.trim(),
        createdAt: new Date().toISOString(),
      })
    );

    Alert.alert("Submitted!", "Your study request has been added.");
    setCourse("");
    setAvailableTimes("");
    setNote("");
    setIsExpanded(false); // Collapse after submission
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleAccordion}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={isExpanded ? "Collapse form" : "Expand form"}
      >
        <Text style={styles.headerText}>Create New Study Request</Text>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Ionicons name="chevron-down" size={24} color="#3B82F6" />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={[styles.content, { height: contentHeight }]}>
        {isExpanded && (
          <View style={styles.form}>
            <Text style={styles.label}>Course:</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., CS101"
              placeholderTextColor="#94a3b8"
              value={course}
              onChangeText={setCourse}
            />

            <Text style={styles.label}>Available Times:</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., MWF 2-4 PM"
              placeholderTextColor="#94a3b8"
              value={availableTimes}
              onChangeText={setAvailableTimes}
            />

            <Text style={styles.label}>Additional Note (optional):</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Extra details"
              placeholderTextColor="#94a3b8"
              multiline
              value={note}
              onChangeText={setNote}
            />

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Submit Request</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8fafc",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#005eb8",
  },
  content: {
    paddingHorizontal: 16,
  },
  form: {
    paddingVertical: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#475569",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: "#1e293b",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    paddingVertical: 14,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default StudyGroupForm;
