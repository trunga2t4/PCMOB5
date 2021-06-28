import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import AccountScreen from "./screens/AccountScreen";
import CreateScreen from "./screens/CreateScreen";
import EditScreen from "./screens/EditScreen";
import ShowScreen from "./screens/ShowScreen";
import ContentScreen from "./screens/ContentScreen";

const Stack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);

  async function loadToken() {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      setSignedIn(true);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadToken();
  }, []);
  return loading ? (
    <View style={styles.container}>
      <ActivityIndicator />
    </View>
  ) : (
    <NavigationContainer>
      <Stack.Navigator
        mode="modal"
        //headerMode="none"
        initialRouteName={signedIn ? "Content" : "SignIn"}
      >
        <Stack.Screen
          options={{ title: "Blog" }}
          component={ContentScreen}
          name="Content"
        />
        <Stack.Screen
          options={{ headerShown: false }}
          component={CreateScreen}
          name="Create"
        />
        <Stack.Screen
          options={{ headerShown: false }}
          component={EditScreen}
          name="Edit"
        />
        <Stack.Screen
          options={{ headerShown: false }}
          component={ShowScreen}
          name="Show"
        />
        <Stack.Screen
          options={{ headerShown: false }}
          component={SignInScreen}
          name="SignIn"
        />
        <Stack.Screen
          options={{ headerShown: false }}
          component={SignUpScreen}
          name="SignUp"
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
