import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

type Course = {
  id: string;
  name: string;
  credits: string;
  grade: string;
};

const gradePoints: { [key: string]: number } = {
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  F: 0.0,
};

export default function GPACalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", name: "", credits: "", grade: "" },
  ]);
  const [gpa, setGpa] = useState<string>("");

  const addCourse = () => {
    const newCourse: Course = {
      id: Math.random().toString(),
      name: "",
      credits: "",
      grade: "",
    };
    setCourses([...courses, newCourse]);
  };

  const updateCourse = (id: string, field: keyof Course, value: string) => {
    setCourses(
      courses.map((course) =>
        course.id === id ? { ...course, [field]: value } : course
      )
    );
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach((course) => {
      const gradePoint = gradePoints[course.grade];
      const credits = parseFloat(course.credits);

      if (gradePoint !== undefined && !isNaN(credits)) {
        totalPoints += gradePoint * credits;
        totalCredits += credits;
      }
    });

    const gpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : "0.00";
    setGpa(gpa);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={styles.content}>
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.courseRow}>
              <TextInput
                style={styles.input}
                placeholder="Course"
                value={item.name}
                onChangeText={(text) => updateCourse(item.id, "name", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Credits"
                keyboardType="numeric"
                value={item.credits}
                onChangeText={(text) => updateCourse(item.id, "credits", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Grade (A, B+, etc.)"
                value={item.grade}
                onChangeText={(text) => updateCourse(item.id, "grade", text)}
              />
            </View>
          )}
        />
        <View style={styles.footer}>
          <TouchableOpacity style={styles.addButton} onPress={addCourse}>
            <Text style={styles.addButtonText}>+ Add Course</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.calculateButton}
            onPress={calculateGPA}
          >
            <Text style={styles.calculateButtonText}>Calculate GPA</Text>
          </TouchableOpacity>

          {gpa && <Text style={styles.gpaText}>Your GPA: {gpa}</Text>}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  courseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
  input: {
    flex: 1,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginHorizontal: 5,
  },
  footer: {
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  addButton: {
    backgroundColor: "#005eb8",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  calculateButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
  },
  calculateButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  gpaText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
});
