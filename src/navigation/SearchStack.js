import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SearchTabScreen from "../screens/SearchTabScreen";
import ExerciseSearchScreen from "../screens/ExerciseSearchScreen";
import ExerciseDetailsScreen from "../screens/ExerciseDetailsScreen";

const Stack = createNativeStackNavigator();

export default function SearchStack() {
  return (
    <Stack.Navigator
      initialRouteName="SearchTab"
      screenOptions={
        {
          // headerTitle: "Exercise Search",
        }
      }
    >
      <Stack.Screen
        name="SearchTab"
        component={SearchTabScreen}
        options={{ title: "Search" }}
      />
      <Stack.Screen name="ExerciseSearch" component={ExerciseSearchScreen} />
      <Stack.Screen name="ExerciseDetails" component={ExerciseDetailsScreen} />
    </Stack.Navigator>
  );
}
