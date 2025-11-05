import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const WorkoutBar = () => {
  return (
    <TouchableOpacity>
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.timer}>//Timer</Text>
            <Text>//Aktualne cwiczenie</Text>
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>End Workout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

//FIXME fix styling to match JEFIT workout bar
const styles = StyleSheet.create({
  container: {
    margin: 15,
    backgroundColor: "lightgray",
    padding: 10,
    height: 50,
    borderRadius: 25,
  },
  column: {
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "lightblue",
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 10,
    paddingHorizontal: 10,
  },
  timer: {
    fontSize: 10,
    color: "blue",
  },
});

export default WorkoutBar;
