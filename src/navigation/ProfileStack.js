import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/ProfileScreen";
import BodyMeasurementsScreen from "../screens/BodyMeasurementsScreen";
import WorkoutCalendarScreen from "../screens/WorkoutCalendarScreen";
import WorkoutDetailsScreen from "../screens/WorkoutDetailsScreen";
import PersonalRecordsScreen from "../screens/PersonalRecordsScreen";

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
      <Stack.Screen
        name="WorkoutDetails"
        component={WorkoutDetailsScreen}
        options={{ title: "Workout Details" }}
      />
      <Stack.Screen
        name="PersonalRecords"
        component={PersonalRecordsScreen}
        options={{ title: "Personal Records" }}
      />
    </Stack.Navigator>
  );
}
