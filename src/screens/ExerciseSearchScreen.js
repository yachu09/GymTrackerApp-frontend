import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import useExercises from "../hooks/useExercises";
import SearchBar from "../components/SearchBar";
import ExercisesList from "../components/ExercisesList";
import { AntDesign } from "@expo/vector-icons";

const ExerciseSearchScreen = ({ route }) => {
  const [term, setTerm] = useState("");
  const [searchExercises, exercises, errorMessage] = useExercises([]);
  const [groupedExercises, setGroupedExercises] = useState([]);
  //true or false - jeśli true wyświetl plusik do dodawania ćwiczeń który zmieni się po kliknieciu w haczyk jako że ćwiczenie zostało zakolejkowane do planu
  //wtedy doda się to ćwiczenie do jakiegoś state, i jeśli dodawanie ćwiczeń zostanie zatwierdzone plan zostanie utworzony w bazie i nawigacja przekieruje do planów
  const fromProgramPlanning = route.params.fromProgramPlanning;
  const [exercisesToAdd, setExercisesToAdd] = useState([]);

  const groupExercisesByMuscleGroup = (exercises) => {
    const grouped = [];

    exercises.forEach((exercise) => {
      // sprawdzenie czy istnieje grupa
      const existingGroup = grouped.find(
        (g) => g.muscleGroup === exercise.muscleGroup
      );

      if (existingGroup) {
        // dodaje do istniejącej grupy
        existingGroup.exercises.push(exercise);
      } else {
        // tworzy nowa grupę
        grouped.push({
          muscleGroup: exercise.muscleGroup,
          exercises: [exercise],
        });
      }
    });
    return grouped;
  };

  //filtrowanie exercises po wartości wyszukiwania
  const filterExercises = (allExercises, term) => {
    if (!term) return allExercises;
    const lowerTerm = term.toLowerCase();
    return allExercises.filter(
      (ex) =>
        ex.name.toLowerCase().includes(lowerTerm) ||
        ex.muscleGroup.toLowerCase().includes(lowerTerm)
    );
  };

  //const groupedExercises = groupExercisesByMuscleGroup(exercises);
  //effect wywołuje się za każdym razem gdy zmienia się jeden z elementów drugiego argumentu [exercises, term]
  useEffect(() => {
    const filtered = filterExercises(exercises, term);
    const grouped = groupExercisesByMuscleGroup(filtered);
    setGroupedExercises(grouped);
  }, [exercises, term]);

  console.log(JSON.stringify(groupedExercises, null, 2));
  return (
    <View style={styles.container}>
      <SearchBar
        term={term}
        onTermChange={(newTerm) => {
          setTerm(newTerm);
        }}
        onTermSubmit={() => {}}
      />
      <Text style={styles.searchResultCount}>
        We found{" "}
        {groupedExercises.reduce(
          (total, group) => total + group.exercises.length,
          0
        )}{" "}
        exercise/s
        {term ? " that match your search" : null}
      </Text>
      <FlatList
        data={groupedExercises}
        keyExtractor={(item) => item.muscleGroup}
        renderItem={({ item }) => {
          return (
            <ExercisesList
              header={`${
                item.muscleGroup.charAt(0).toUpperCase() +
                item.muscleGroup.slice(1)
              } Exercises`}
              exercises={item.exercises}
              fromProgramPlanning={fromProgramPlanning}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchResultCount: {
    alignSelf: "center",
  },
});

export default ExerciseSearchScreen;
