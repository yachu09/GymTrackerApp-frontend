import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import TrainingProgramBox from "../components/TrainingProgramBox";
import StandardButton from "../components/StandardButton";
import { useNavigation } from "@react-navigation/native";
import { useTrainingPrograms } from "../hooks/useTrainingPrograms";
import { useWorkouts } from "../hooks/useWorkouts";
import { initDatabase } from "../database/localDatabase";
import { useFocusEffect } from "@react-navigation/native";
import WorkoutBar from "../components/WorkoutBar";
import { LinearGradient } from "expo-linear-gradient";

const WorkoutPlanningScreen = () => {
  const { programs, loadPrograms, dropAllTables } = useTrainingPrograms();
  const navigation = useNavigation();
  const [isWorkoutRunning, setIsWorkoutRunning] = useState(false);

  const { dropAllWorkouts, dropWorkoutById, getLatestWorkoutId } =
    useWorkouts();

  const [latestWorkoutId, setLatestWorkoutId] = useState(null);

  // useEffect(() => {
  //   // if (programs.length) {
  //   //   loadPrograms();
  //   //   console.log("programs loaded");
  //   // } else {
  //   //   initDatabase();
  //   //   loadPrograms();
  //   // }
  //   const initAndLoad = async () => {
  //     await initDatabase();
  //     await loadPrograms();
  //     console.log("db init and programs loaded");
  //   };
  //   initAndLoad();
  // }, []);
  useFocusEffect(
    React.useCallback(() => {
      const initAndLoad = async () => {
        try {
          initDatabase();
          loadPrograms();
          const id = await getLatestWorkoutId();
          setLatestWorkoutId(id);
          console.log("init and load");
          console.log("latest workout ID:", id);
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
                setIsWorkoutRunning={() => {
                  setIsWorkoutRunning(true);
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
            dropAllWorkouts();
          }}
        />
        {isWorkoutRunning ? (
          <WorkoutBar
            onDelete={() => {
              dropWorkoutById(latestWorkoutId);
              setIsWorkoutRunning(false);
            }}
          />
        ) : null}
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
