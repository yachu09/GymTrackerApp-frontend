import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/ProfileScreen";
import BodyMeasurementsScreen from "../screens/BodyMeasurementsScreen";
import WorkoutCalendarScreen from "../screens/WorkoutCalendarScreen";

const Stack = createNativeStackNavigator();

export default function SearchStack() {
  return (
    //nawigator stacka zakładki (tab) "profile"
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={
        {
          // headerTitle: "Exercise Search",
        }
      }
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
      <Stack.Screen
        name="BodyMeasurements"
        component={BodyMeasurementsScreen}
        options={{ title: "Body measurements" }}
      />
      <Stack.Screen
        name="WorkoutCalendar"
        component={WorkoutCalendarScreen}
        options={{ title: "Workout Calendar" }}
      />
    </Stack.Navigator>
  );
}
