import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { useAuthStore } from "../../store/authStore";
import { Ionicons } from "@expo/vector-icons";

export default function FeedScreen() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const { token ,user} = useAuthStore();

  const fetchBooks = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://react-native-bookwarm-av2j.onrender.com/api/books/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Server Error:", response.status, data);
        throw new Error(data.message || `Failed with status ${response.status}`);
      }

      setBooks(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message || "Could not fetch books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={20}
          color={i <= rating ? "#f4b400" : "#ccc"}
        />
      );
    }
    return <View style={styles.stars}>{stars}</View>;
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* user info */}
      <View style={styles.userRow}>
        <Image
          source={{
            uri:
              item.user?.profilePic ||
              "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(item.user?.username || "User"),
          }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{item.user?.username || "Unknown"}</Text>
      </View>

      {/* book image */}
      <Image source={{ uri: item.images }} style={styles.bookImage} />

      <Text style={styles.title}>{item.title}</Text>
      {renderStars(item.ratings)}
      <Text style={styles.caption}>{item.caption}</Text>
      <Text style={styles.date}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.logo}>
            📚 <Text style={styles.logoText}>BookReview</Text>
          </Text>
          <Text style={styles.tagline}>
            Discover great reads from the community 👇
          </Text>
        </View>
      }
      data={books}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginVertical: 16,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  logoText: {
    color: "#4CAF50",
  },
  tagline: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  listContainer: {
    padding: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    padding: 10,
    elevation: 2,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  username: {
    fontWeight: "600",
    fontSize: 14,
  },
  bookImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
  caption: {
    color: "#555",
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  stars: {
    flexDirection: "row",
    marginTop: 4,
  },
});
