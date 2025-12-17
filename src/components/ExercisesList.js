import React from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import ExercisesDetail from "./ExercisesDetail";
import { useNavigation } from "@react-navigation/native";

const ExercisesList = ({
  header,
  exercises,
  fromProgramPlanning,
  selectedExercises,
  toggleSelectExercise,
}) => {
  const navigation = useNavigation();

  if (!exercises.length) {
    return null;
  }

  return (
    <View>
      <Text style={styles.header}>{header}</Text>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={exercises}
        keyExtractor={(exercise) => exercise.id}
        renderItem={({ item }) => {
          const isSelected = selectedExercises.includes(item.id);

          return (
            <TouchableOpacity
              onPress={() => {
                if (!fromProgramPlanning) {
                  navigation.navigate("ExerciseDetails", { exercise: item });
                } else {
                  toggleSelectExercise(item.id);
                }
              }}
            >
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
