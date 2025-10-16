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

const ExercisesList = ({ header, exercises }) => {
  const navigation = useNavigation();

  if (!exercises.length) {
    return null;
  }

  return (
    <View>
      {/* header po kategoriach ćwiczeń */}
      <Text style={styles.header}>{header}</Text>
      {/* lista ćwiczeń z danej kategorii */}
      <FlatList
        horizontal
        data={exercises}
        keyExtractor={(exercise) => exercise.id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ExerciseDetails");
              }}
            >
              <ExercisesDetail exercise={item} />
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
