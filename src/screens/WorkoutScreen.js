import React, {
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
  useRef,
} from "react";
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
import { Context as TrainingProgramsContext } from "../context/TrainingProgramsContext";
import { useNavigation } from "@react-navigation/native";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const WorkoutScreen = ({ route }) => {
  const navigation = useNavigation();
  // const program = route.params.program;
  const programId = route.params.programId;

  const {
    state: { workouts, currentWorkoutId, workoutDuration, isWorkoutRunning },
    startWorkout,
    addWorkoutSet,
    loadWorkouts,
  } = useContext(WorkoutContext);

  const { state: allPrograms } = useContext(TrainingProgramsContext);
  const program = allPrograms.find((p) => p.id === programId);
  const workout = workouts.find((w) => w.id === currentWorkoutId);
  // Poprawka: dodano return
  const exercises = program.exercises;

  //FIXME chwilowe rozwiązanie bo initialSeconds ma stale przypisaną wartość
  // const initialSeconds = exercises[0].sets[0].breakTime;
  const initialSeconds = 10;

  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isBreak, setIsBreak] = useState(false);
  //FIXME do zarządzania kolorem haczyka czy ćwiczenie jest wykonane
  const [isDone, setIsDone] = useState(false);
  const [focusedSet, setFocusedSet] = useState(null);
  const [setInputs, setSetInputs] = useState({});
  const flatListRef = useRef(null);

  // current page index = current exercise id
  const [currentPage, setCurrentPage] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentPage(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => {}}>
          <SimpleLineIcons name="options-vertical" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({ title: program.name });
  }, [program.name]);

  useEffect(() => {
    if (!isWorkoutRunning) {
      startWorkout(program.id);
    }
  }, [isWorkoutRunning]);

  // Licznik przerwy treningowej
  useEffect(() => {
    let interval = null;
    if (isBreak) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsBreak(false);
            return initialSeconds; // reset czasu po zakończeniu przerwy
          }
          return prev - 1;
        });
      }, 1000);
    }
    // cleanup przy unmount
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreak]);

  // ⬇Auto-przejście na następne ćwiczenie po załadowaniu danych z bazy
  useEffect(() => {
    if (!workouts.length) return; // jeszcze brak danych
    const refreshedWorkout = workouts.find((w) => w.id === currentWorkoutId);
    if (!refreshedWorkout) return;

    if (
      refreshedWorkout.exercises?.[currentPage]?.sets.length ===
        program.exercises[currentPage].sets.length &&
      currentPage < exercises.length - 1
    ) {
      flatListRef.current?.scrollToIndex({
        index: currentPage + 1,
        animated: true,
      });
    }
  }, [workouts]);

  // uruchamia się po odświeżeniu treningów
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

    if (!data || !currentWorkoutId) return;

    // 🔹 Sprawdź czy seria już istnieje w aktualnym workout
    const currentEx = workout?.exercises?.find(
      (e) => e.programExerciseId === exerciseId
    );
    const alreadyLogged = currentEx?.sets?.some((s) => s.setNumber === setId);

    if (alreadyLogged) {
      console.log(`⚠️ Set ${setId} już był zapisany — nadpisujemy!`);
      await updateWorkoutSet(
        currentWorkoutId,
        exerciseId,
        setId,
        data.weight,
        data.reps
      );
    } else {
      await addWorkoutSet(
        currentWorkoutId,
        exerciseId,
        setId,
        data.weight,
        data.reps
      );
    }

    //await loadWorkouts();
    // Resetowanie fokusu
    setFocusedSet(null);
    setTimeLeft(initialSeconds);
    setIsBreak(true);
  };

  const skipRest = () => {
    setIsBreak(false);
    setTimeLeft(initialSeconds); // chwilowe rozwiązanie
  };

  // 📌 Debugowanie
  console.log("programId z route:", route.params.programId);
  console.log("allPrograms:", allPrograms);
  console.log("program:", program);
  console.log("currentWorkoutId:", currentWorkoutId);
  console.log("workouts:", workouts);
  console.log("workout:", workout);

  return (
    <LinearGradient style={{ flex: 1 }} colors={["#FFFFFF", "lightblue"]}>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={exercises}
          keyExtractor={(exercise) => exercise.id.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onScrollToIndexFailed={(info) => {
            console.warn("Scroll failed, retrying...", info);
            setTimeout(() => {
              flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            }, 100);
          }}
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
                  <View
                    key={set.id || index}
                    style={[
                      styles.setContainer,
                      isFocused && styles.focusedRow,
                    ]}
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
                      style={[
                        styles.done,
                        { color: isDone ? "blue" : "black" },
                      ]}
                    />
                  </View>
                );
              })}
            </View>
          )}
        />

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{timeLeft}</Text>
          <TouchableOpacity style={{ flex: 1 }} onPress={skipRest}>
            <Text style={{ fontSize: 10, alignSelf: "center" }}>Skip rest</Text>
            <Ionicons
              name="play-skip-forward-circle-outline"
              size={30}
              style={{ marginLeft: 20 }}
            />
          </TouchableOpacity>
          {/* <Text>{workoutDuration}</Text> */}
        </View>

        <StandardButton text="Log Set" onPress={handleLogSet} />
        <View style={{ marginBottom: 10 }} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  setContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  focusedRow: {
    // backgroundColor: "rgba(173, 216, 230, 0.3)",
    backgroundColor: "lightgray",
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
    backgroundColor: "transparent",
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
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    height: 60,
    borderRadius: 25,
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
