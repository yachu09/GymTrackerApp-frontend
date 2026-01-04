import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Context as WorkoutContext } from "../context/WorkoutContext";
import { Context as TrainingProgramsContext } from "../context/TrainingProgramsContext";
import { useNavigation } from "@react-navigation/native";

const WorkoutBar = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    state: { currentWorkoutId, currentDayId, workoutDuration, timerRunning },
    endWorkout,
    tickTimer,
    deleteWorkoutById,
  } = useContext(WorkoutContext);

  const { state: allPrograms } = useContext(TrainingProgramsContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => tickTimer(), 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTime = (s) => {
    const hours = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
  };

  const onSave = () => {
    endWorkout(currentWorkoutId, workoutDuration);
  };

  const onDelete = () => {
    deleteWorkoutById(currentWorkoutId);
    endWorkout(null, null, true);
  };

  // 🔍 Znajdź program na podstawie currentDayId
  const program = allPrograms.find((p) =>
    p.days.some((d) => d.id === currentDayId)
  );
  const programId = program?.id;

  const programDayName = program
    ? program.days.find((d) => d.id === currentDayId)?.dayName
    : "Unknown Day";

  return (
    <TouchableOpacity
      onPress={() => {
        if (isModalVisible) {
          setIsModalVisible(false);
        } else if (programId && currentDayId) {
          navigation.navigate("Workout", {
            programId,
            dayId: currentDayId,
          });
        }
      }}
    >
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.timer}>{formatTime(workoutDuration)}</Text>
            <Text style={{ fontWeight: "bold", marginLeft: 5 }}>
              {program.name} - {programDayName}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setIsModalVisible(true);
            }}
          >
            <Text style={styles.buttonText}>End Workout</Text>
          </TouchableOpacity>
          {isModalVisible && (
            <View style={styles.localModalContainer}>
              <View style={styles.localModalContent}>
                <TouchableOpacity onPress={() => onSave()}>
                  <Feather name="save" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete()}>
                  <Feather name="trash-2" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    margin: 15,
    backgroundColor: "#fff",
    height: 50,
    borderRadius: 25,
  },
  column: {
    flexDirection: "column",
    padding: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#58b4e3",
    width: 100,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 12,
    paddingHorizontal: 10,
    alignSelf: "center",
    color: "white",
  },
  timer: {
    fontSize: 12,
    color: "blue",
    marginLeft: 5,
  },
  localModalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "flex-end",
    zIndex: 10,
  },
  localModalContent: {
    backgroundColor: "#ed4242",
    padding: 10,
    flexDirection: "row",
    height: 50,
    borderRadius: 25,
    width: 100,
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default WorkoutBar;
