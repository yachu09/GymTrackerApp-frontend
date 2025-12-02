import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import StandardButton from "../components/StandardButton";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import useWorkoutStreak from "../hooks/useWorkoutStreak";

const ProfileScreen = () => {
  const navigation = useNavigation();

  const { streak, currentWeekWorkouts } = useWorkoutStreak();

  return (
    <LinearGradient style={{ flex: 1 }} colors={["#FFFFFF", "lightblue"]}>
      <Image
        source={require("../../assets/workout_streak.png")}
        style={styles.image}
      />
      <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: 16 }}>
        Your workout streak is {streak} weeks
      </Text>
      <Text
        style={{
          alignSelf: "center",
          fontWeight: "bold",
          fontSize: 16,
          marginBottom: 20,
        }}
      >
        This week you have worked out {currentWeekWorkouts} times
      </Text>
      <StandardButton
        text="Body Measurements"
        onPress={() => {
          navigation.navigate("BodyMeasurements");
        }}
      />
      <StandardButton
        text="Workout Calendar"
        onPress={() => {
          navigation.navigate("WorkoutCalendar");
        }}
      />
      <StandardButton
        text="Personal Records"
        onPress={() => {
          navigation.navigate("PersonalRecords");
        }}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },
});

export default ProfileScreen;
