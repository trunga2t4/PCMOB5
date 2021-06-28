import React, { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Button, ScrollView, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import axios from "axios";

const API = "https://trunga2t4.pythonanywhere.com";
const API_WHOAMI = "/whoami";
const API_POSTS = "/posts";

export default function AccountScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [posts, setPosts] = useState([]);

  async function getUsername() {
    const token = await AsyncStorage.getItem("token");
    console.log(`Token is ${token}`);
    try {
      const response1 = await axios.get(API + API_WHOAMI, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log("Got user name!");
      console.log(response1);
      setUsername(response1.data.username);
      const response = await axios.get(API + API_POSTS, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log("Got posts data!");
      console.log(response.data);
      setPosts(response.data);
    } catch (error) {
      console.log("Error getting user name and posts data");
      if (error.response) {
        console.log(error.response.data);
      } else {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    console.log("Setting up nav listener");
    // Check for when we come back to this screen
    const removeListener = navigation.addListener("focus", () => {
      console.log("Running nav listener");
      setUsername(<ActivityIndicator />);
      getUsername();
    });
    getUsername();
    AsyncStorage.removeItem("editId");
    return removeListener;
  }, []);
  function signOut() {
    AsyncStorage.removeItem("token");
    navigation.navigate("SignIn");
  }

  function createPost() {
    navigation.navigate("Create");
  }

  async function deletePost(id) {
    const token = await AsyncStorage.getItem("token");
    console.log(`Token is ${token}`);
    try {
      const response = await axios.delete(API + API_POSTS + `/${id}`, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log("Post deleted!");
      console.log(response.data);
      const response2 = await axios.get(API + API_POSTS, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log("Got posts data!");
      console.log(response2.data);
      setPosts(response2.data);
    } catch (error) {
      console.log("Error posting data");
      if (error.response) {
        console.log(error.response.data);
      } else {
        console.log(error);
      }
    }
  }

  async function editPost(id) {
    AsyncStorage.setItem("editId", id);
    navigation.navigate("Edit");
  }

  async function showPost(id) {
    AsyncStorage.setItem("editId", id);
    navigation.navigate("Show");
  }

  function renderItem({ item }) {
    if (item.username == username) {
      return (
        <View
          style={{
            padding: 10,
            borderBottomColor: "#ccc",
            borderBottomWidth: 2,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => editPost(item.id)}
            style={{ flex: 0.1 }}
          >
            <AntDesign name="edit" size={24} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => showPost(item.id)}
            style={{ flex: 0.8 }}
          >
            <Text style={styles.text}>{item.title}</Text>
            <Text style={styles.content}>{item.content}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deletePost(item.id)}
            style={{ flex: 0.1 }}
          >
            <Ionicons name="trash" size={24} color="#944" />
          </TouchableOpacity>
        </View>
      );
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{username}'s Personal Page</Text>
      <Button title="New Post" onPress={createPost} />
      <FlatList
        data={posts}
        renderItem={renderItem}
        style={{ width: "100%" }}
        keyExtractor={(item) => item.id.toString()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "700",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  content: {
    fontSize: 16,
  },
  author: {
    fontSize: 16,
    fontStyle: "italic",
    fontWeight: "500",
  },
});
