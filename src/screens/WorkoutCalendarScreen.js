import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Context as WorkoutContext } from "../context/WorkoutContext";
import { Calendar } from "react-native-calendars";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

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
    // 2. Gdy workouty się zmienią → przetwórz je do markedDates
    if (workouts.length > 0) {
      setMarkedDates(createMarkedDates(workouts));
    }
  }, [workouts]);

  //nie działą xd
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

  console.log("marked dates: ", JSON.stringify(markedDates, null, 2));

  return (
    <LinearGradient style={{ flex: 1 }} colors={["#FFFFFF", "lightblue"]}>
      <View>
        <Calendar
          style={{ backgroundColor: "transparent" }}
          theme={{
            backgroundColor: "transparent",
            calendarBackground: "transparent",
          }}
          enableSwipeMonths
          markedDates={markedDates}
          onDayPress={(day) => {
            console.log("Kliknięto dzień:", day.dateString);
            onDayPress(day);
          }}
        />
        <Button
          title="add dummy data"
          onPress={() => {
            revokeDummyData();
          }}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({});

export default WorkoutCalendarScreen;
