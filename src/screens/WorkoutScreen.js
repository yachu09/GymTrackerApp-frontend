import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import AddProgramButton from "../components/AddProgramButton";
import SetNumber from "../components/SetNumber";
import NumericTextInput from "../components/NumericTextInput";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const WorkoutScreen = ({ route }) => {
  const program = route.params.program;
  const exercises = program.exercises;
  const initialSeconds = exercises[0].sets[0].breakTime;
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isBreak, setIsBreak] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isBreak) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsBreak(false);
            return initialSeconds; //reset czasu po zakonczeniu przerwy
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreak]);

  return (
    <View style={styles.container}>
      <FlatList
        data={exercises}
        keyExtractor={(exercise) => exercise.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.page}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <Text style={styles.name}>{item.exerciseName}</Text>
            {item.sets.map((set, index) => (
              // <Text key={set.id || index}>Set {index + 1}</Text>
              <View style={styles.setContainer}>
                <SetNumber number={index + 1} />
                <NumericTextInput />
                <Text style={{ alignSelf: "center" }}>kgs</Text>
                <NumericTextInput placeholder={set.reps} />
                <Text style={{ alignSelf: "center" }}>reps</Text>
                <MaterialIcons
                  name="done"
                  size={20}
                  style={[styles.done, { color: isDone ? "blue" : "black" }]}
                />
              </View>
            ))}
          </View>
        )}
      />
      <Text>{timeLeft}</Text>
      <AddProgramButton
        text="Log Set"
        onPress={() => {
          setTimeLeft(initialSeconds);
          setIsBreak(true);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  setContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  image: {
    width: width,
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
  },
  page: {
    // flexDirection: "row",
    width: width,
    height: "100%",
    alignContent: "center",
    backgroundColor: "lightgray",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },
  done: {
    alignSelf: "center",
    marginRight: 15,
  },
});

export default WorkoutScreen;
