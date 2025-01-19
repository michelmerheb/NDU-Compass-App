import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface EventsCardProps {
  headerImage: string;
  title: string;
  date: string;
  location: string;
  description: string;
  id: string;
  setEvents: (callback: (prevEvents: any) => any) => void;
  onPress: () => void;
}

export default function EventsCard({
  headerImage,
  title,
  date,
  location,
  description,
  id,
  setEvents,
  onPress,
}: EventsCardProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const isModerator = user?.role === "moderator";

  const dynamicStyles = StyleSheet.create({
    actions: isModerator
      ? styles.actions
      : { ...styles.actions, justifyContent: "center" },
  });

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
              prevEvents.filter((event: any) => event.id !== id)
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: headerImage }} style={styles.headerImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardText}>📌 {title}</Text>
        <Text style={styles.cardText}>🗓️ Date: {date}</Text>
        <Text style={styles.cardText}>📍 Location: {location}</Text>
        <Text style={styles.cardText}>📝 {description}</Text>
      </View>
      <View style={dynamicStyles.actions}>
        <TouchableOpacity style={styles.registerButton} onPress={onPress}>
          <Text style={styles.registerButtonText}>Register Now</Text>
        </TouchableOpacity>
        {isModerator && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowOffset: { width: 2, height: 2 },
    elevation: 5,
    shadowColor: "black",
    borderRadius: 10,
    backgroundColor: "#005eb8",
    marginVertical: 10,
  },
  headerImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    padding: 10,
    marginTop: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
    letterSpacing: 1.5,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  registerButtonText: {
    fontSize: 16,
    color: "#005eb8",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});
