import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import TrainingProgramBox from "../components/TrainingProgramBox";
import StandardButton from "../components/StandardButton";
import { useNavigation } from "@react-navigation/native";
import { initDatabase } from "../database/localDatabase";
import { useFocusEffect } from "@react-navigation/native";
import WorkoutBar from "../components/WorkoutBar";
import { LinearGradient } from "expo-linear-gradient";
import { Context as WorkoutContext } from "../context/WorkoutContext";
import { Context as TrainingProgramsContext } from "../context/TrainingProgramsContext";

const WorkoutPlanningScreen = () => {
  const {
    state: programs,
    loadPrograms,
    addProgramWithExercises,
    dropAllTables,
  } = useContext(TrainingProgramsContext);

  const navigation = useNavigation();

  const {
    state: { workouts, isWorkoutRunning, currentWorkoutId },
    loadWorkouts,
    startWorkout,
    endWorkout,
    addWorkoutSet,
    deleteWorkoutById,
    deleteAllWorkouts,
    getLatestWorkoutId,
  } = useContext(WorkoutContext);

  useFocusEffect(
    React.useCallback(() => {
      const initAndLoad = async () => {
        try {
          initDatabase();
          loadPrograms();
          // const id = getLatestWorkoutId();
          console.log("init and load");
          // console.log("latest workout ID:", id);
        } catch (e) {
          console.error("init and load error (WorkoutPlanningScreen)", e);
        }
      };

      initAndLoad();
    }, [])
  );

  //po starcie treningu przenieś do ekranu treningowego i zajeb z JEFITa mniej więcej wygląd UI odpalonego treningu
  return (
    <LinearGradient style={{ flex: 1 }} colors={["#FFFFFF", "lightblue"]}>
      <View style={styles.container}>
        {!programs.length ? (
          <Text style={styles.noPrograms}>
            No training programs yet? Add one!
          </Text>
        ) : null}
        <FlatList
          data={programs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            return (
              <TrainingProgramBox
                program={item}
                onPress={() => {
                  navigation.navigate("ProgramDetails", { program: item });
                }}
              />
            );
          }}
        />
        <StandardButton
          text="Add training program!"
          onPress={() => {
            navigation.navigate("AddProgram");
          }}
        />
        {/* guzik do usuwania danych z bazy */}
        <StandardButton
          text="DEV: Delete all program data"
          onPress={() => {
            dropAllTables();
          }}
        />
        {/* guzik do usuwania historii treningów */}
        <StandardButton
          text="DEV: Delete all workout history"
          onPress={() => {
            deleteAllWorkouts();
          }}
        />
        {/* usun gdy wyjebiesz guziki DEV */}
        <View style={{ height: 10 }}></View>
        {isWorkoutRunning ? <WorkoutBar /> : null}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noPrograms: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 200,
  },
});

export default WorkoutPlanningScreen;
