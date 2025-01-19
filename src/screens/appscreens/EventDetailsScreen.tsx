import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";

export default function EventDetailsScreen({ route, navigation }: any) {
  const { event, setEvents } = route.params;

  const handleDelete = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this event?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setEvents((prevEvents: any) =>
              prevEvents.filter((e: any) => e.id !== event.id)
            );
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: event.image }} style={styles.image} />
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.text}>📍 Location: {event.location}</Text>
      <Text style={styles.text}>📝 {event.description}</Text>
      <Text style={styles.text}>🗓️ Date: {event.date}</Text>
      <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete Event</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  deleteButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
