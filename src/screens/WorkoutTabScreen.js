import React from "react";
import { View, Text, StyleSheet } from "react-native";

const WorkoutTabScreen = () => {
  return (
    <View style={styles.container}>
      <Text>This is a workout tab screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 300,
  },
});

export default WorkoutTabScreen;
