import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { useAuthStore } from "../../store/authStore";

export default function BookRecommendation({ initialImageUri = null }) {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState(0);
  const [imageUri, setImageUri] = useState(initialImageUri);
  const [imageBase64, setImageBase64] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = useAuthStore();

  const handleRating = (value) => {
    setRating(value);
  };

  const imagePicker = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "You need to allow access to your photos."
        );
        return;
      }

      setLoading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 5],
        quality: 1,
        base64: false, // we’ll generate base64 after compression
      });

      if (!result.canceled) {
        const asset = result.assets[0];

        // compress + resize with ImageManipulator
        const manipResult = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: 800 } }], // resize to max width 800
          {
            compress: 0.7, // 20% quality
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
          }
        );

        setImageUri(manipResult.uri);
        setImageBase64(manipResult.base64);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to pick and process image");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !caption || !imageBase64 || !rating) {
      Alert.alert("Please fill all the inputs");
      return;
    }

    try {
      setLoading(true);

      const imageDataUrl = `data:image/jpeg;base64,${imageBase64}`;

      const response = await fetch(
        "https://react-native-bookwarm-av2j.onrender.com/api/books/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            caption,
            image: imageDataUrl,
            ratings: rating, 
          }),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        console.error("Server Error:", response.status, text);
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      Alert.alert("Success", "Your recommendation was posted!");
      setTitle("");
      setCaption("");
      setRating(0);
      setImageUri(null);
      setImageBase64("");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.label}>Book Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter book title"
            placeholderTextColor="#aaa"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Your Rating</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleRating(star)}>
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={30}
                  color={star <= rating ? "#FFD700" : "#aaa"}
                  style={{ marginHorizontal: 2 }}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Book Image</Text>

          <TouchableOpacity style={styles.imageBox} onPress={imagePicker}>
            {loading ? (
              <ActivityIndicator size="large" color="#4CAF50" />
            ) : imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={40} color="#aaa" />
                <Text style={styles.imageText}>Tap to select image</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.label}>Caption</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Write your review or thoughts about this book..."
            placeholderTextColor="#aaa"
            multiline
            value={caption}
            onChangeText={setCaption}
          />

          <TouchableOpacity style={styles.postButton} onPress={handleSubmit}>
            <Text style={styles.postButtonText}>Post Recommendation</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    padding: 20,
    backgroundColor: "#f6fff9",
    flex: 1,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 44,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  stars: {
    flexDirection: "row",
    marginBottom: 8,
  },
  imageBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 8,
    overflow: "hidden",
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageText: {
    marginTop: 6,
    color: "#aaa",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  postButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  postButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
