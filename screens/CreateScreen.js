import React, { useState, useEffect } from "react";
import { TouchableOpacity, TextInput } from "react-native";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API = "https://trunga2t4.pythonanywhere.com";
const API_ADD_POST = "/create";
const API_WHOAMI = "/whoami";

export default function CreateScreen({ navigation }) {
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
      setPageTitle(`${response1.data.username}'s New Post`);
    } catch (error) {
      console.log("Error getting user name and posts data");
      if (error.response1) {
        console.log(error.response1.data);
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

  async function createPost(title, content) {
    const token = await AsyncStorage.getItem("token");
    console.log(`Token: ${token}`);
    try {
      const response = await axios.post(
        API + API_ADD_POST,
        { title, content },
        {
          headers: { Authorization: `JWT ${token}` },
        }
      );
      console.log("New post created!");
      console.log(response.data);
      navigation.navigate("Content");
    } catch (error) {
      console.log("Error posting data");
      if (error.response) {
        console.log(error.response.data);
      } else {
        console.log(error);
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{pageTitle}</Text>
      <Text style={styles.title2}>Post Title</Text>
      <TextInput
        style={styles.textInput}
        value={title}
        onChangeText={(input) => setTitle(input)}
      />
      <Text style={styles.title2}>Post Content</Text>
      <TextInput
        style={styles.textInput}
        value={content}
        onChangeText={(input) => setContent(input)}
      />
      <View style={[styles.buttonContainer, { justifyContent: "center" }]}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => createPost(title, content)}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Dismiss</Text>
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
    fontSize: 18,
    marginBottom: 12,
    alignItems: "center",
  },
  textInput: {
    borderColor: "#999",
    borderWidth: 1,
    marginBottom: 24,
    padding: 4,
    height: 36,
    fontSize: 18,
    backgroundColor: "white",
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
