import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IndexScreen from "./IndexScreen";
import AccountScreen from "./AccountScreen";

const Tab = createBottomTabNavigator();

export default function ContentScreen({ navigation }) {
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={logOut}>
          <Ionicons
            name="log-out"
            size={30}
            color="black"
            style={{
              color: "#f55",
              marginRight: 10,
            }}
          />
        </TouchableOpacity>
      ),
    });
  });

  function logOut() {
    AsyncStorage.removeItem("token");
    navigation.navigate("SignIn");
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home Page") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "Your Account") {
            iconName = focused ? "fort-awesome" : "fort-awesome";
          }

          return <FontAwesome name={iconName} color={color} size={size} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "blue",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen name="Home Page" component={IndexScreen} />
      <Tab.Screen name="Your Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}
