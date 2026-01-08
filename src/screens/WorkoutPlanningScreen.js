import React, { useContext } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import TrainingProgramBox from "../components/TrainingProgramBox";
import StandardButton from "../components/shared/StandardButton";
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

  //pobranie planów treningowych po wczytaniu ekranu
  useFocusEffect(
    React.useCallback(() => {
      const initAndLoad = async () => {
        try {
          await initDatabase();
          await loadPrograms();
          console.log("init and load");
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
      <Text style={styles.subtitle}>Select a program or create one</Text>

      <View style={styles.container}>
        {!programs.length ? (
          <Text style={styles.noPrograms}>
            No training programs yet? Add one!
          </Text>
        ) : null}
        {/* prezentacja planów w liście */}
        <FlatList
          data={programs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            return (
              <TrainingProgramBox
                program={item}
                onPress={() => {
                  navigation.navigate("ProgramDetails", { programId: item.id });
                }}
              />
            );
          }}
        />
        <StandardButton
          text="Add training program!"
          onPress={() => {
            navigation.navigate("AddNewProgram");
          }}
        />
        {/* guzik do usuwania danych z bazy */}
        {/* <StandardButton
          text="DEV: Delete all program data"
          onPress={() => {
            dropAllTables();
          }}
        /> */}
        {/* guzik do usuwania historii treningów */}
        {/* <StandardButton
          text="DEV: Delete all workout history"
          onPress={() => {
            deleteAllWorkouts();
          }}
        /> */}
        {/* usun gdy wyrzucisz guziki DEV */}
        <View style={{ height: 10 }}></View>
        {isWorkoutRunning ? <WorkoutBar /> : null}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    alignSelf: "center",
    marginTop: 10,
  },
  container: {
    flex: 1,
  },
  noPrograms: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 200,
  },
  localModalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    borderRadius: 15,
    marginHorizontal: 40,
    // marginVertical: 240,
    height: 120,
    marginTop: 320,
    // justifyContent: "center",
    alignItems: "center",
    zIndex: 30,
  },
  localModalContent: {
    // paddingHorizontal: 20,
    backgroundColor: "transparent",
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
  },
});

export default WorkoutPlanningScreen;
