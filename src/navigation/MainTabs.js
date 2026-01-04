import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SearchStack from "./SearchStack";
import { FontAwesome6, Feather } from "@expo/vector-icons";
import WorkoutStack from "./WorkoutStack";
import ProfileStack from "./ProfileStack";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    //nawigator odpowiedzialny za dolny tab bar
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "lightblue",
          borderTopWidth: 0,
          height: 70,
        },
        tabBarActiveTintColor: "white", // kolor aktywnej ikony/tekstu
        tabBarInactiveTintColor: "black",
        tabBarLabelStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tab.Screen
        name="WorkoutStack"
        component={WorkoutStack}
        options={{
          title: "Workout",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="dumbbell" color={"gray"} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="SearchStack"
        component={SearchStack}
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" color={"gray"} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="image-portrait" color={"gray"} size={20} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
