import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import ExercisesDetail from "./ExercisesDetail";
import { useNavigation } from "@react-navigation/native";
import StandardButton from "./StandardButton";

const ExercisesList = ({ header, exercises, fromProgramPlanning }) => {
  const navigation = useNavigation();

  const [selectedIds, setSelectedIds] = useState([]);

  const handlePress = (id) => {
    if (!fromProgramPlanning) {
      navigation.navigate("ExerciseDetails");
    } else {
      // jesli już wybrane -> usuń z tablicy, jeśli nie -> dodaj
      setSelectedIds((prev) =>
        prev.includes(id)
          ? prev.filter((itemId) => itemId !== id)
          : [...prev, id]
      );
    }
  };

  if (!exercises.length) {
    return null;
  }

  return (
    <View>
      <Text style={styles.header}>{header}</Text>

      <FlatList
        horizontal
        data={exercises}
        keyExtractor={(exercise) => exercise.id}
        renderItem={({ item }) => {
          const isSelected = selectedIds.includes(item.id);

          return (
            <TouchableOpacity onPress={() => handlePress(item.id)}>
              <ExercisesDetail
                exercise={item}
                bgColor={isSelected ? "lightblue" : "#f0f0f0"} // niebieskie tło gdy wybrane
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
    marginVertical: 5,
  },
});

export default ExercisesList;
