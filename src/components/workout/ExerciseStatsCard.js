import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ExerciseStatsCard = ({ name, completedSets, contribution }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>

      <Text style={styles.sets}>{completedSets} sets completed</Text>

      <View style={styles.barContainer}>
        <View style={[styles.barFill, { width: `${contribution}%` }]} />
      </View>

      <Text style={styles.percent}>{contribution}% of total</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  sets: {
    color: "gray",
    marginTop: 3,
  },
  barContainer: {
    height: 8,
    backgroundColor: "#ddd",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 6,
  },
  barFill: {
    height: "100%",
    backgroundColor: "lightblue",
  },
  percent: {
    marginTop: 4,
    fontSize: 12,
    color: "gray",
  },
});

export default ExerciseStatsCard;
