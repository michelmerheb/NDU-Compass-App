import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

interface Post {
  id: number;
  description: string;
  location: string;
  imageUri: string;
}

export default function FreeStuffBoard() {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  // Function to pick an image from the gallery
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the gallery is needed!"
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Submit a new post
  const handleSubmit = () => {
    if (!description.trim() || !location.trim() || !imageUri) {
      Alert.alert(
        "Incomplete Data",
        "Please fill in all fields and select a photo."
      );
      return;
    }
    const newPost: Post = {
      id: Date.now(),
      description: description.trim(),
      location: location.trim(),
      imageUri,
    };
    setPosts([...posts, newPost]);
    // Reset the form
    setDescription("");
    setLocation("");
    setImageUri(null);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Form for a new post */}
      <View style={styles.form}>
        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Textbooks, furniture, etc."
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <Text style={styles.label}>Pickup Location:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter pickup location"
          value={location}
          onChangeText={setLocation}
        />
        <Text style={styles.label}>Phone Number:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
          <Text style={styles.photoBtnText}>
            {imageUri ? "Change Photo" : "Upload Photo"}
          </Text>
        </TouchableOpacity>
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        )}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Post Item</Text>
        </TouchableOpacity>
      </View>

      {/* Displaying the list of posts */}
      <Text style={styles.subHeader}>Items Available:</Text>
      {posts.length === 0 ? (
        <Text style={styles.emptyText}>No posts yet.</Text>
      ) : (
        posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <Image source={{ uri: post.imageUri }} style={styles.postImage} />
            <View style={styles.postContent}>
              <Text style={styles.postDescription}>{post.description}</Text>
              <Text style={styles.postLocation}>Pickup: {post.location}</Text>
              <Text style={styles.postLocation}>Phone: {phoneNumber}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
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
  label: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  photoBtn: {
    backgroundColor: "#E0E5FF",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  photoBtnText: {
    fontSize: 16,
    color: "#333",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  submitBtn: {
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    borderRadius: 5,
    alignItems: "center",
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  subHeader: {
    fontSize: 24,
    fontWeight: "600",
    marginVertical: 10,
    color: "#333",
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginVertical: 20,
  },
  postCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  postImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  postContent: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },
  postDescription: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 5,
    color: "#333",
  },
  postLocation: {
    fontSize: 16,
    color: "#555",
  },
});
