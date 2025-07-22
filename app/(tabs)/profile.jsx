import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore";

export default function ProfileScreen() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, token, logout } = useAuthStore();

  const fetchUserBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://react-native-bookwarm-av2j.onrender.com/api/books/user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch");

      setBooks(data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert("Confirm", "Are you sure you want to delete this book?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(
              `https://react-native-bookwarm-av2j.onrender.com/api/books/${id}`,
              {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to delete");

            setBooks((prev) => prev.filter((book) => book._id !== id));
            Alert.alert("Deleted", "Book deleted successfully.");
          } catch (err) {
            console.error(err);
            Alert.alert("Error", err.message);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchUserBooks();
  }, []);

  const renderStars = (rating) => {
    return (
      <View style={{ flexDirection: "row" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? "star" : "star-outline"}
            size={16}
            color={star <= rating ? "#FFD700" : "#ccc"}
          />
        ))}
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.bookCard}>
      <Image source={{ uri: item.images }} style={styles.bookImage} />
      <View style={{ flex: 1 }}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        {renderStars(item.ratings)}
        <Text style={styles.bookCaption} numberOfLines={2}>
          {item.caption}
        </Text>
        <Text style={styles.bookDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item._id)}>
        <Ionicons name="trash" size={20} color="red" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri:
              user?.profilePic ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.username || "User"
              )}`,
          }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.username}>{user?.username || "John Doe"}</Text>
          <Text style={styles.email}>{user?.email || "user@email.com"}</Text>
          <Text style={styles.memberSince}>
            Member since {new Date(user?.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Ionicons name="log-out-outline" size={18} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Books */}
      <Text style={styles.recommendationsTitle}>
        Your Recommendations ({books.length} books)
      </Text>

      <FlatList
        data={books}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6fff9",
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12,
  },
  username: {
    fontWeight: "700",
    fontSize: 16,
  },
  email: {
    fontSize: 13,
    color: "#555",
  },
  memberSince: {
    fontSize: 12,
    color: "#888",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 6,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 4,
  },
  recommendationsTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  bookCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  bookImage: {
    width: 50,
    height: 70,
    borderRadius: 4,
    marginRight: 8,
  },
  bookTitle: {
    fontWeight: "600",
  },
  bookCaption: {
    fontSize: 12,
    color: "#555",
  },
  bookDate: {
    fontSize: 10,
    color: "#888",
  },
});
