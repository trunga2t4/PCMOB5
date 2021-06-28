import React, { useState, useEffect } from "react";
import { StyleSheet, Text, FlatList, View } from "react-native";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import axios from "axios";

const API = "https://trunga2t4.pythonanywhere.com";
const API_WHOAMI = "/whoami";
const API_POSTS = "/posts";

export default function IndexScreen({ navigation }) {
  const [pageTitle, setPageTitle] = useState("");
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");

  async function getPageTitle() {
    console.log("---- Getting user name ----");
    const token = await AsyncStorage.getItem("token");
    console.log(`Token: ${token}`);
    try {
      const response1 = await axios.get(API + API_WHOAMI, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(`Username: ${response1.data.username}`);
      setUsername(response1.data.username);
      setPageTitle(`${response1.data.username}'s Home Page`);
      const response = await axios.get(API + API_POSTS, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log("Got posts data!");
      //console.log(response.data);
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
      setPageTitle(<ActivityIndicator />);
      getPageTitle();
    });
    getPageTitle();
    return removeListener;
  }, []);

  async function deletePost(id) {
    const token = await AsyncStorage.getItem("token");
    console.log(`Token: ${token}`);
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
    console.log(id);
    navigation.navigate("Edit", { editId: String(id) });
  }

  async function showPost(id) {
    console.log(id);
    navigation.navigate("Show", { editId: String(id) });
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
            <Text style={styles.author}>(Your post)</Text>
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
    } else {
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
          <View style={{ flex: 0.1 }}>
            <AntDesign name="edit" size={24} color="gray" />
          </View>
          <TouchableOpacity
            onPress={() => showPost(item.id)}
            style={{ flex: 0.8 }}
          >
            <Text style={styles.text}>{item.title}</Text>
            <Text style={styles.author}>(Author: {item.username})</Text>
            <Text style={styles.content}>{item.content}</Text>
          </TouchableOpacity>
          <View style={{ flex: 0.1 }}>
            <Ionicons name="trash" size={24} color="gray" />
          </View>
        </View>
      );
    }
  }

  return (
    <View contentContainerStyle={styles.container}>
      <Text style={styles.title}>{pageTitle}</Text>
      <FlatList
        inverted
        data={posts}
        renderItem={renderItem}
        style={{ width: "100%" }}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
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
    margin: 24,
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
