import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Foundation from "@expo/vector-icons/Foundation";

import useRateExercise from "../hooks/useRateExercise";

const ExerciseRating = ({ exercise }) => {
  // const rateExercise = (delta) => {};
  const { rateExercise, error, success } = useRateExercise();

  return (
    <View
      style={{
        paddingTop: 20,
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <Text style={{ alignSelf: "center", fontWeight: 700, fontSize: 20 }}>
        Rating: {exercise.rating}
      </Text>
      <TouchableOpacity
        onPress={() => {
          rateExercise({ exerciseId: exercise.id, delta: 1 });
        }}
      >
        <Foundation
          name="like"
          size={32}
          color="black"
          style={{ marginHorizontal: 20 }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          rateExercise({ exerciseId: exercise.id, delta: -1 });
        }}
      >
        <Foundation name="dislike" size={32} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ExerciseRating;
