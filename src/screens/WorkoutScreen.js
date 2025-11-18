import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import StandardButton from "../components/StandardButton";
import SetNumber from "../components/SetNumber";
import NumericTextInput from "../components/NumericTextInput";
import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Context as WorkoutContext } from "../context/WorkoutContext";

const { width } = Dimensions.get("window");

const WorkoutScreen = ({ route }) => {
  const program = route.params.program;
  const exercises = program.exercises;
  //FIXME chwilowe rozwiązanie bo initialSeconds ma stale przypisaną wartość
  const initialSeconds = exercises[0].sets[0].breakTime;
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isBreak, setIsBreak] = useState(false);
  //FIXME do zarządzania kolorem haczyka czy ćwiczenie jest wykonane
  const [isDone, setIsDone] = useState(false);

  const [focusedSet, setFocusedSet] = useState(null);
  const [setInputs, setSetInputs] = useState({});

  const {
    state: { workouts, currentWorkoutId },
    startWorkout,
    addWorkoutSet,
    loadWorkouts,
  } = useContext(WorkoutContext);

  useEffect(() => {
    let interval = null;

    if (isBreak) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsBreak(false);
            return initialSeconds;
          }
          return prev - 1;
        });
      }, 1000);
    }

    //check if last set

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreak]);

  // po załadowaniu ekranu
  useEffect(() => {
    const start = async () => {
      startWorkout(program.id);
    };
    start();
  }, []);

  // useEffect(() => {
  //   const test = async () => {
  //     const workoutId = await startWorkout(1); // Plan ID 1
  //     await addWorkoutSet(workoutId, 1, 1, 100, 8); // ćwiczenie ID 3 z programu
  //     await addWorkoutSet(workoutId, 1, 2, 105, 6);
  //     await addWorkoutSet(workoutId, 2, 1, 10, 6);
  //     await loadWorkouts();
  //   };
  //   test();
  // }, []);

  const handleInputChange = (exerciseId, setId, field, value) => {
    const key = `${exerciseId}_${setId}`;
    setSetInputs((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const handleFocus = (exerciseId, setId) => {
    setFocusedSet({ exerciseId, setId });
  };

  const handleLogSet = async () => {
    if (!focusedSet) return;
    const { exerciseId, setId } = focusedSet;
    const key = `${exerciseId}_${setId}`;
    const data = setInputs[key];
    if (!data) return;
    if (!currentWorkoutId) {
      console.log("nie ma workout id");
      return;
    }
    if (!currentWorkoutId) {
      console.log("nie ma workout id nie zlogowano seta");
      return;
    }
    await addWorkoutSet(
      currentWorkoutId,
      exerciseId,
      setId,
      data.weight,
      data.reps
    );

    // await loadWorkouts();
    loadWorkouts();
    setTimeLeft(initialSeconds);
    setIsBreak(true);
  };

  const skipRest = () => {
    setIsBreak(false);
    //chwilowe rozwiązanie bo initialSeconds ma stale przypisaną wartość
    setTimeLeft(initialSeconds);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={exercises}
        keyExtractor={(exercise) => exercise.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.page}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <Text style={styles.name}>{item.exerciseName}</Text>
            {item.sets.map((set, index) => {
              const key = `${item.id}_${set.id}`;
              const values = setInputs[key] || {};
              const isFocused =
                focusedSet?.exerciseId === item.id &&
                focusedSet?.setId === set.id;
              return (
                // <Text key={set.id || index}>Set {index + 1}</Text>
                <View
                  key={set.id || index}
                  style={[styles.setContainer, isFocused && styles.focusedRow]}
                >
                  <SetNumber number={index + 1} />
                  <NumericTextInput
                    term={values.weight}
                    onFocus={() => handleFocus(item.id, set.id)}
                    handleChange={(val) =>
                      handleInputChange(item.id, set.id, "weight", val)
                    }
                  />
                  <Text style={{ alignSelf: "center" }}>kgs</Text>
                  <NumericTextInput
                    term={values.reps}
                    onFocus={() => handleFocus(item.id, set.id)}
                    handleChange={(val) =>
                      handleInputChange(item.id, set.id, "reps", val)
                    }
                    placeholder={set.reps}
                  />
                  <Text style={{ alignSelf: "center" }}>reps</Text>
                  <MaterialIcons
                    name="done"
                    size={20}
                    style={[styles.done, { color: isDone ? "blue" : "black" }]}
                  />
                </View>
              );
            })}
          </View>
        )}
      />
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{timeLeft}</Text>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            skipRest();
          }}
        >
          <Text style={{ fontSize: 10, alignSelf: "center" }}>Skip rest</Text>
          <Ionicons
            name="play-skip-forward-circle-outline"
            size={30}
            style={{ marginLeft: 20 }}
          />
        </TouchableOpacity>
      </View>
      <StandardButton
        text="Log Set"
        onPress={() => {
          // setTimeLeft(initialSeconds);
          // setIsBreak(true);
          handleLogSet();
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
  focusedRow: {
    backgroundColor: "rgba(173, 216, 230, 0.3)",
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
  timerContainer: {
    backgroundColor: "lightblue",
    height: 60,
    borderRadius: 10,
    flexDirection: "row",
    padding: 10,
    width: 120,
    marginHorizontal: 15,
    marginTop: 10,
    justifyContent: "center",
  },
  timerText: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    color: "blue",
  },
});

export default WorkoutScreen;
