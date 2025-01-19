import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import ScreenHeader from "../../components/ScreenHeader";

export default function AddEventScreen({ route, navigation }: any) {
  const { setEvents } = route.params;

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState("");

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access images is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAddEvent = () => {
    const newEvent = {
      id: Math.random().toString(),
      title,
      date,
      location,
      description,
      image: imageUri,
    };

    setEvents((prevEvents: any) => [...prevEvents, newEvent]);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <ScreenHeader title="Add Event" navigation={navigation} />

        <View style={styles.addContent}>
          <TouchableOpacity
            onPress={pickImage}
            style={styles.imagePickerButton}
          >
            <Text style={styles.buttonText}>Pick an Image</Text>
          </TouchableOpacity>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.noImageText}>No image selected</Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Event Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Date (e.g., Monday, April 15, 2024)"
            value={date}
            onChangeText={setDate}
          />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <TouchableOpacity onPress={handleAddEvent} style={styles.button}>
            <Text style={styles.buttonText}>Add Event</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  addContent: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 20,
    marginVertical: 10,
  },
  imagePickerButton: {
    backgroundColor: "#999",
    padding: 15,
    marginVertical: 15,
    borderRadius: 15,
  },
  button: {
    backgroundColor: "#005eb8",
    padding: 10,
    marginVertical: 15,
    borderRadius: 15,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
  noImageText: {
    color: "gray",
    textAlign: "center",
    marginTop: 10,
  },
});
