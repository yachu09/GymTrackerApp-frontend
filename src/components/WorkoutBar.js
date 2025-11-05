import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const WorkoutBar = ({ setIsWorkoutRunning }) => {
  const [seconds, setSeconds] = useState(3590);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval); // cleanup przy unmount
  }, []);

  const formatTime = (s) => {
    const hours = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;

    const pad = (num) => String(num).padStart(2, "0");
    return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
  };

  return (
    <TouchableOpacity>
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.timer}>{formatTime(seconds)}</Text>
            <Text>//Aktualne cwiczenie</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsWorkoutRunning()}
          >
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
