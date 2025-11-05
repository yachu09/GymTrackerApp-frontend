import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import TrainingProgramBox from "../components/TrainingProgramBox";
import AddProgramButton from "../components/AddProgramButton";
import { useNavigation } from "@react-navigation/native";
import { useTrainingPrograms } from "../hooks/useTrainingPrograms";
import { initDatabase } from "../database/localDatabase";
import { useFocusEffect } from "@react-navigation/native";
import WorkoutBar from "../components/WorkoutBar";

const WorkoutPlanningScreen = () => {
  const { programs, loadPrograms, dropAllTables } = useTrainingPrograms();
  const navigation = useNavigation();
  const [isWorkoutRunning, setIsWorkoutRunning] = useState(false);

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
      const initAndLoad = () => {
        try {
          initDatabase();
          loadPrograms();
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
      <AddProgramButton
        text="Add training program!"
        onPress={() => {
          navigation.navigate("AddProgram");
        }}
      />
      {/* guzik do usuwania danych z bazy */}
      <AddProgramButton
        text="DEV: Delete all data"
        onPress={() => {
          dropAllTables();
        }}
      />
      {isWorkoutRunning ? (
        <WorkoutBar
          setIsWorkoutRunning={() => {
            setIsWorkoutRunning(false);
          }}
        />
      ) : null}
    </View>
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
