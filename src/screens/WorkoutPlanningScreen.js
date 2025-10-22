import React, { use, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import TrainingProgramBox from "../components/TrainingProgramBox";
import AddProgramButton from "../components/AddProgramButton";
import { useNavigation } from "@react-navigation/native";
import { useTrainingPrograms } from "../hooks/useTrainingPrograms";
import { initDatabase } from "../database/localDatabase";

const WorkoutPlanningScreen = () => {
  const { programs, loadPrograms } = useTrainingPrograms();
  const navigation = useNavigation();

  //FIXME: right after adding a training program number of exercises is not being shown correctly
  // after reloading the screen number of exercises is fine
  //the bug is probably due to programs not being fully loaded from the hook but idk
  useEffect(() => {
    if (programs.length) {
      loadPrograms();
    } else {
      initDatabase();
      loadPrograms();
    }
  }, []);

  //jeśli w bazie nie ma nic wyświetl coś w stylu "No training program yet? Add one!" i pokaż guzik
  //dodaj możliwość kliknięcia w plan i wystartowania treningu
  //po starcie treningu przenieś do ekranu treningowego i zajeb z JEFITa mniej więcej wygląd UI odpalonego treningu
  return (
    <View style={styles.container}>
      {/* zdarzenie onPress TrainingProgramBox ma przekierowywać do startu treningu zależnie od wybranego programu treningowego */}
      {!programs.length ? (
        <Text>No training programs yet? Add one!</Text>
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
      <AddProgramButton
        text="Add training program!"
        onPress={() => {
          navigation.navigate("AddProgram");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WorkoutPlanningScreen;
