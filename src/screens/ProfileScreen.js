import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import StandardButton from "../components/shared/StandardButton";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import useWorkoutStreak from "../hooks/useWorkoutStreak";

const ProfileScreen = () => {
  const navigation = useNavigation();

  const { streak, currentWeekWorkouts } = useWorkoutStreak();

  return (
    <LinearGradient style={{ flex: 1 }} colors={["#FFFFFF", "lightblue"]}>
      <Text style={styles.subtitle}>Your progress at a glance</Text>

      <View style={styles.card}>
        <Image
          source={require("../../assets/workout_streak.png")}
          style={styles.image}
        />

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.statValue}>{streak} weeks</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>This week</Text>
            <Text style={styles.statValue}>{currentWeekWorkouts} workouts</Text>
          </View>
        </View>
      </View>

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
  card: {
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(17, 24, 39, 0.08)",
    marginHorizontal: 15,
  },
  image: {
    width: 180,
    height: 180,
    alignSelf: "center",
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: "row",
    gap: 15,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(17, 24, 39, 0.08)",
    alignItems: "center",
  },
  statLabel: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "600",
  },
  statValue: {
    marginTop: 4,
    color: "black",
    fontSize: 18,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    alignSelf: "center",
    marginVertical: 10,
  },
});

export default ProfileScreen;
