import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Note {
  id: string;
  text: string;
}

export default function QuickNotes() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);

  // Load notes from local storage when component mounts
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem("quickNotes");
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load notes.");
    }
  };

  const saveNotes = async (notesToSave: Note[]) => {
    try {
      await AsyncStorage.setItem("quickNotes", JSON.stringify(notesToSave));
    } catch (error) {
      Alert.alert("Error", "Failed to save notes.");
    }
  };

  const addNote = () => {
    if (!note.trim()) {
      Alert.alert("Validation", "Please write a note before adding.");
      return;
    }
    const newNote: Note = { id: Date.now().toString(), text: note.trim() };
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    setNote("");
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter((item) => item.id !== id);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const renderItem = ({ item }: { item: Note }) => (
    <View style={styles.noteItem}>
      <Text style={styles.noteText}>{item.text}</Text>
      <TouchableOpacity
        onPress={() => deleteNote(item.id)}
        style={styles.deleteBtn}
      >
        <Text style={styles.deleteBtnText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Quick Notes</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder='Jot down a quick note... (e.g., "Remember to submit lab report by Friday!")'
          value={note}
          onChangeText={setNote}
          multiline
          textAlignVertical="top"
        />
        <TouchableOpacity style={styles.addBtn} onPress={addNote}>
          <Text style={styles.addBtnText}>Add Note</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notes yet. Start jotting!</Text>
        }
        contentContainerStyle={notes.length ? undefined : styles.emptyContainer}
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
  inputContainer: {
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
    fontSize: 16,
    marginBottom: 10,
    minHeight: 60,
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
  noteItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    alignItems: "center",
  },
  noteText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  deleteBtn: {
    backgroundColor: "#FF5C5C",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
  },
  deleteBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    fontSize: 16,
    marginTop: 20,
  },
});
