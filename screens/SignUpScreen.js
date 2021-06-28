import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Keyboard } from "react-native";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API = "https://trunga2t4.pythonanywhere.com";
const API_REGISTER = "/newuser";
const API_LOGIN = "/auth";

export default function SignUpScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);

  async function signup() {
    Keyboard.dismiss();
    try {
      setLoading(true);
      const response1 = await axios.post(API + API_REGISTER, {
        username,
        password,
      });
      console.log("Success signing up!");
      console.log(response1);
      const response = await axios.post(API + API_LOGIN, {
        username,
        password,
      });
      console.log("Success signing in!");
      console.log(response);
      AsyncStorage.setItem("token", response.data.access_token);
      setLoading(false);
      navigation.navigate("Account");
    } catch (error) {
      setLoading(false);
      console.log("Error signing up!");
      console.log(error.response);
      setErrorText(error.response.data.description);
    }
  }

  function toLogin() {
    navigation.navigate("Content");
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign up to blog</Text>
        <Text style={styles.fieldTitle}>Username</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          value={username}
          onChangeText={(input) => setUsername(input)}
        />
        <Text style={styles.fieldTitle}>Password</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          autoCompleteType="password"
          autoCorrect={false}
          secureTextEntry={true}
          value={password}
          onChangeText={(input) => setPassword(input)}
        />
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity onPress={signup} style={styles.loginButton}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          {loading ? (
            <ActivityIndicator style={{ marginLeft: 20, marginBottom: 20 }} /> // adjust
          ) : null}
          <TouchableOpacity onPress={toLogin}>
            <Text style={styles.fieldTitle}>
              Already registered? Sign in instead
            </Text>
          </TouchableOpacity>
          <Text style={styles.errorText}>{errorText}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
  fieldTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  input: {
    borderColor: "#999",
    borderWidth: 1,
    marginBottom: 24,
    padding: 4,
    height: 36,
    fontSize: 18,
    backgroundColor: "white",
  },
  loginButton: {
    backgroundColor: "blue",
    width: 120,
    alignItems: "center",
    padding: 18,
    marginTop: 12,
    marginBottom: 36,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    height: 40,
  },
});
