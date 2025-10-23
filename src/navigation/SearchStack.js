import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SearchTabScreen from "../screens/SearchTabScreen";
import ExerciseSearchScreen from "../screens/ExerciseSearchScreen";
import ExerciseDetailsScreen from "../screens/ExerciseDetailsScreen";

const Stack = createNativeStackNavigator();

export default function SearchStack() {
  return (
    //nawigator stacka zakładki (tab) "search"
    <Stack.Navigator
      initialRouteName="ExerciseSearch"
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
      <Stack.Screen
        name="ExerciseSearch"
        component={ExerciseSearchScreen}
        options={{ title: "Search an exercise!" }}
        initialParams={{ fromProgramPlanning: false }}
      />
      <Stack.Screen
        name="ExerciseDetails"
        component={ExerciseDetailsScreen}
        options={{ title: "Details" }}
      />
    </Stack.Navigator>
  );
}
