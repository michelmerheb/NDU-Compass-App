import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Platform,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Exam {
  id: number;
  examName: string;
  examDate: Date;
}

export default function ExamCountdown() {
  // Form states for new exam
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [initialPickerDate, setInitialPickerDate] = useState(new Date());

  // List of exams
  const [exams, setExams] = useState<Exam[]>([]);
  // A state to force re-render each second for live countdown updates
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update currentTime every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load exams from AsyncStorage when component mounts
  useEffect(() => {
    const loadExams = async () => {
      try {
        const storedExams = await AsyncStorage.getItem("exams");
        if (storedExams) {
          // Convert parsed JSON back to Exam objects, including converting examDate to Date objects.
          const parsedExams: Exam[] = JSON.parse(storedExams).map(
            (exam: any) => ({
              ...exam,
              examDate: new Date(exam.examDate),
            })
          );
          setExams(parsedExams);
        }
      } catch (error) {
        console.error("Failed to load exams:", error);
      }
    };
    loadExams();
  }, []);

  // Save exams to AsyncStorage every time the exams state changes
  useEffect(() => {
    const saveExams = async () => {
      try {
        await AsyncStorage.setItem("exams", JSON.stringify(exams));
      } catch (error) {
        console.error("Failed to save exams:", error);
      }
    };
    saveExams();
  }, [exams]);

  // Handle date picker changes
  interface DateTimePickerEvent {
    type: string;
    nativeEvent: {
      timestamp: number;
    };
  }
  const onChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date | undefined
  ): void => {
    if (Platform.OS !== "ios") {
      setShowPicker(false);
    }
    if (event.type === "set" && selectedDate) {
      setExamDate(selectedDate);
    }
  };

  // Add a new exam entry if both examName and examDate are set
  const addExam = () => {
    if (!examName.trim() || !examDate) return;
    const newExam: Exam = {
      id: Date.now(),
      examName: examName.trim(),
      examDate,
    };
    setExams((prevExams) => [...prevExams, newExam]);
    setExamName("");
    setExamDate(null);
  };

  // Delete an exam from the list
  const deleteExam = (id: number) => {
    setExams((prevExams) => prevExams.filter((exam) => exam.id !== id));
  };

  // Helper to compute countdown string
  const getCountdown = (targetDate: Date) => {
    const timeDiff = targetDate.getTime() - currentTime.getTime();
    if (timeDiff <= 0) return "Exam time!";
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
    const seconds = Math.floor((timeDiff / 1000) % 60);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  // Render each exam card
  const renderExam = ({ item }: { item: Exam }) => (
    <View style={styles.examCard}>
      <View style={styles.examInfo}>
        <Text style={styles.examName}>{item.examName}</Text>
        <Text style={styles.countdown}>{getCountdown(item.examDate)}</Text>
      </View>
      <TouchableOpacity
        onPress={() => deleteExam(item.id)}
        style={styles.deleteBtn}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Exam Countdown Tracker</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Course / Exam Name"
          value={examName}
          onChangeText={setExamName}
        />
        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.dateBtnText}>
            {examDate ? examDate.toLocaleDateString() : "Pick Exam Date"}
          </Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={examDate || new Date()}
            mode="date"
            display="default"
            onChange={onChange}
            minimumDate={new Date()}
          />
        )}

        <TouchableOpacity style={styles.addBtn} onPress={addExam}>
          <Text style={styles.addBtnText}>Add Exam</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={exams}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderExam}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No exams added yet.</Text>
        }
        contentContainerStyle={exams.length ? undefined : styles.emptyContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F6FF",
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  form: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  dateBtn: {
    backgroundColor: "#E0E5FF",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  dateBtnText: {
    fontSize: 16,
    color: "#333",
  },
  addBtn: {
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  addBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  examCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
    elevation: 2,
  },
  examInfo: {
    flex: 1,
  },
  examName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  countdown: {
    fontSize: 18,
    color: "#555",
  },
  deleteBtn: {
    backgroundColor: "#FF5C5C",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#777",
    marginTop: 20,
  },
});
