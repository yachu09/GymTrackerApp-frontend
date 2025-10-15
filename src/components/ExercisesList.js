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
      <Text>{header}</Text>
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

const styles = StyleSheet.create({});

export default ExercisesList;
