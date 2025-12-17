import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import ExerciseStatsCard from "./ExerciseStatsCard";
import useWorkoutMuscleStats from "../../hooks/useWorkoutMuscleStats";

const WorkoutBreakdown = ({ workout }) => {
  const {
    stats,
    muscleGroupTotals,
    totalSets,
    topMuscleGroup,
    topMusclePercent,
  } = useWorkoutMuscleStats(workout);

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  return (
    <View style={{ padding: 16, paddingBottom: 120 }}>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 26,
          alignSelf: "center",
        }}
      >
        Workout Breakdown
      </Text>
      <Text
        style={{
          fontSize: 18,
          alignSelf: "center",
          fontStyle: "italic",
          fontWeight: "600",
          marginTop: 5,
        }}
      >
        You did a total of {totalSets} sets
      </Text>

      {topMuscleGroup && (
        <Text style={styles.topMuscleText}>
          🏆 Most trained: {""}
          <Text style={styles.highlight}>
            {capitalize(topMuscleGroup)} ({topMusclePercent}%)
          </Text>
        </Text>
      )}

      <View style={styles.groupStatsContainer}>
        {Object.entries(muscleGroupTotals).map(([group, percent]) => (
          <View key={group} style={styles.groupRow}>
            <Text style={styles.groupName}>{capitalize(group)}: </Text>
            <Text style={styles.groupPercent}>{percent}% of all sets</Text>
          </View>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {stats.map((ex, i) => (
          <ExerciseStatsCard
            key={i}
            name={ex.name}
            completedSets={ex.completedSets}
            contribution={ex.contributionPercent}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  topMuscleText: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 10,
    color: "black",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 15,
  },

  highlight: {
    fontWeight: "700",
    color: "#74cfeaff",
  },
  groupStatsContainer: {
    marginBottom: 10,
    color: "black",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 15,
  },
  groupRow: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 4,
  },
  groupName: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
  },
  groupPercent: {
    fontSize: 16,
    fontWeight: "600",
    color: "#74cfeaff",
  },
});

export default WorkoutBreakdown;
