import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const TrainingProgramBox = ({ program, onPress }) => {
  const navigation = useNavigation();

  //sprawdza czy plan ma przypisane serie powtórzenia i czas przerwy
  const isProgramSetUp = (program) => {
    if (!program?.exercises || program.exercises.length === 0) return false;

    for (const exercise of program.exercises) {
      if (!exercise.sets || exercise.sets.length === 0) return false;

      for (const set of exercise.sets) {
        if (
          set.reps === undefined ||
          set.reps === null ||
          set.breakTime === undefined ||
          set.breakTime === null
        ) {
          return false;
        }

        if (set.reps <= 0) return false;
      }
    }
    return true;
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        start={{ x: 0, y: 0.5 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
        colors={["lightblue", "#58b4e3ff"]}
      >
        <View style={styles.viewContainer}>
          <Text style={styles.programName}>{program.name}</Text>
          <Text>{program.exercises.length} exercises</Text>
          {/* jeśli tak renderuje przycisk aby zacząć trening */}
          {isProgramSetUp(program) ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigation.navigate("Workout", { program });
              }}
            >
              <Text style={styles.buttonText}>Start Workout</Text>
            </TouchableOpacity>
          ) : (
            <Text
              style={{ marginTop: 10, fontWeight: "bold", color: "#ed4242" }}
            >
              Finish setting up your program!
            </Text>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "lightblue",
    height: 100,
    // justifyContent: "center",
    // alignItems: "center",
    // alignSelf: "stretch",
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 25,
  },
  viewContainer: {
    alignItems: "center",
    alignSelf: "stretch",
  },
  programName: {
    marginTop: 10,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "white",
    height: 30,
    width: 100,
    borderRadius: 25,
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 12,
    alignSelf: "center",
  },
});

export default TrainingProgramBox;
