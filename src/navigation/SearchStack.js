import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ExerciseSearchScreen from "../screens/ExerciseSearchScreen";
import ExerciseDetailsScreen from "../screens/ExerciseDetailsScreen";
import AddExerciseScreen from "../screens/AddExerciseScreen";

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
      <Stack.Screen
        name="AddExercise"
        component={AddExerciseScreen}
        options={{ title: "Add an exercise" }}
      />
    </Stack.Navigator>
  );
}
