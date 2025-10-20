import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SearchTabScreen from "../screens/SearchTabScreen";
import WorkoutTabScreen from "../screens/WorkoutTabScreen";
import SearchStack from "./SearchStack";
import { FontAwesome6, Feather } from "@expo/vector-icons";
import WorkoutStack from "./WorkoutStack";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    //nawigator odpowiedzialny za dolny tab bar
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="WorkoutTabScreen"
        component={WorkoutStack}
        options={{
          title: "Workout",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="dumbbell" color={"gray"} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="SearchTabScreen"
        component={SearchStack}
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" color={"gray"} size={20} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
