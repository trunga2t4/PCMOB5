import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API = "https://trunga2t4.pythonanywhere.com";
const API_WHOAMI = "/whoami";
const API_POSTS = "/posts";

export default function ShowScreen({ route, navigation }) {
  const { editId } = route.params;
  const [pageTitle, setPageTitle] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function getPageTitle() {
    const token = await AsyncStorage.getItem("token");
    console.log(`Token: ${token}`);
    try {
      const response1 = await axios.get(API + API_WHOAMI, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(`Username: ${response1.data.username}`);
      const response = await axios.get(API + API_POSTS + `/${editId}`, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log("Got post data!");
      console.log(response.data);
      setTitle(response.data.title);
      setContent(response.data.content);
      setPageTitle(`${response.data.username}'s Post`);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{pageTitle}</Text>
      <Text style={styles.title2}>{title}</Text>
      <Text style={styles.text}>{content}</Text>
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  title2: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    alignItems: "center",
  },
  text: {
    marginBottom: 24,
    padding: 4,
    height: 36,
    fontSize: 18,
  },
  button: {
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
    margin: 10,
    marginTop: 30,
    width: 120,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});
