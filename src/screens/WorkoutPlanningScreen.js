import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import TrainingProgramBox from "../components/TrainingProgramBox";
import AddProgramButton from "../components/AddProgramButton";
import { useNavigation } from "@react-navigation/native";

const WorkoutPlanningScreen = () => {
  const navigation = useNavigation();
  //1. zapytaj LOKALNĄ baze (nie api) o plany treningowe
  //2.1 jeśli w bazie nie ma nic wyświetl coś w stylu "No training program yet? Add one!" i pokaż guzik
  // stwórz ekran do tworzenia planu uzywająć wyszukiwarki ćwiczeń
  //2.2 jeśli w bazie są plany wyświetl je, a pod nimi przycisk do dodania nowego
  //3 dodaj możliwość kliknięcia w plan i wystartowania treningu
  //4 po starcie treningu przenieś do ekranu treningowego i zajeb z JEFITa mniej więcej wygląd UI odpalonego treningu
  return (
    <View>
      {/* chwilowe rozwiązanie - docelowo FlatList renderujący komponenty TrainingProgramBox na podstawie tego co zwróci baza */}
      {/* zdarzenie onPress TrainingProgramBox ma przekierowywać do startu treningu zależnie od wybranego programu treningowego */}
      <TrainingProgramBox programName={"Program #1"} onPress={() => {}} />
      <TrainingProgramBox programName={"Program #2"} />
      <TrainingProgramBox programName={"Program #3"} />
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
    alignItems: "center",
    marginTop: 300,
  },
});

export default WorkoutPlanningScreen;
