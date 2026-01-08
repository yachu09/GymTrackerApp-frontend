import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Context as WorkoutContext } from "../context/WorkoutContext";
import { Calendar } from "react-native-calendars";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import StandardButton from "../components/shared/StandardButton";

const WorkoutCalendarScreen = () => {
  const navigation = useNavigation();

  const {
    state: { workouts },
    loadWorkouts,
    addDummyData,
  } = useContext(WorkoutContext);

  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    loadWorkouts();
    console.log("workout calendar screen: załadowano workouty");
  }, []);

  useEffect(() => {
    if (workouts.length > 0) {
      setMarkedDates(createMarkedDates(workouts));
    }
  }, [workouts]);

  const revokeDummyData = async () => {
    await addDummyData();
    // loadWorkouts();
  };

  const createMarkedDates = (workouts) => {
    const marked = {};

    workouts.forEach((workout) => {
      const dateString = workout.date.split(" ")[0];
      marked[dateString] = {
        selected: true,
        selectedColor: "blue",
        workoutId: workout.id,
      };
    });

    return marked;
  };

  const onDayPress = (day) => {
    const selectedWorkout = markedDates[day.dateString];

    if (!selectedWorkout) {
      console.log("Brak treningu w tym dniu.");
      return;
    }
    navigation.navigate("WorkoutDetails", {
      workoutId: selectedWorkout.workoutId,
    });
  };

  // console.log("marked dates: ", JSON.stringify(markedDates, null, 2));

  return (
    <LinearGradient style={{ flex: 1 }} colors={["#FFFFFF", "lightblue"]}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>Tap a day to see workout details</Text>
      </View>

      <View style={styles.card}>
        <Calendar
          style={{ backgroundColor: "transparent" }}
          enableSwipeMonths
          markedDates={markedDates}
          onDayPress={(day) => onDayPress(day)}
        />
      </View>

      {/* guzik służący do dodania przykładowych treningów w celach testowania */}
      {/* <View style={styles.dev}>
        <StandardButton text="DEV: add dummy data" onPress={revokeDummyData} />
      </View> */}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    alignSelf: "center",
    marginVertical: 10,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(17, 24, 39, 0.08)",
    marginHorizontal: 15,
  },
});

export default WorkoutCalendarScreen;
