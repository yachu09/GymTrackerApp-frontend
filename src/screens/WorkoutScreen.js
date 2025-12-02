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
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import useOneRepMax from "../hooks/useOneRepMax";

const { width } = Dimensions.get("window");

const WorkoutScreen = ({ route }) => {
  const navigation = useNavigation();
  const programId = route.params.programId;
  const dayId = route.params.dayId;

  const {
    state: { workouts, currentWorkoutId, workoutDuration, isWorkoutRunning },
    startWorkout,
    addWorkoutSet,
    loadWorkouts,
    endWorkout,
    deleteWorkoutById,
  } = useContext(WorkoutContext);

  const { state: allPrograms } = useContext(TrainingProgramsContext);

  const program = allPrograms.find((p) => p.id === programId);
  const programDay = program?.days?.find((d) => d.id === dayId);
  const exercises = programDay?.exercises || [];

  const workout = workouts.find((w) => w.id === currentWorkoutId);

  const initialSeconds = 10;
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isBreak, setIsBreak] = useState(false);
  const [loggedSets, setLoggedSets] = useState(new Set());
  const [focusedSet, setFocusedSet] = useState(null);
  const [setInputs, setSetInputs] = useState({});
  const flatListRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentPage(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const focusedKey = focusedSet
    ? `${focusedSet.exerciseId}_${focusedSet.setId}`
    : null;

  const currentFocusedValues = focusedKey ? setInputs[focusedKey] || {} : {};
  const currentWeight = parseFloat(currentFocusedValues.weight) || 0;
  const currentReps = parseFloat(currentFocusedValues.reps) || 0;

  const [oneRepMax] = useOneRepMax(currentWeight, currentReps);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Back",
      headerRight: () => (
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setIsModalVisible(true);
            }}
          >
            {isModalVisible ? null : (
              <Text style={styles.buttonText}>End Workout</Text>
            )}
          </TouchableOpacity>
          {isModalVisible && (
            <View style={styles.localModalContainer}>
              <View style={styles.localModalContent}>
                <TouchableOpacity onPress={() => onSave()}>
                  <Feather name="save" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete()}>
                  <Feather name="trash-2" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ),
    });
  }, [navigation, isModalVisible]);

  const onSave = async () => {
    const id = currentWorkoutId;
    await endWorkout(id, workoutDuration);
    navigation.navigate("WorkoutSummary", { workoutId: id });
  };

  const onDelete = async () => {
    await deleteWorkoutById(currentWorkoutId);
    await endWorkout(null, null, true);
    navigation.navigate("WorkoutPlanning");
  };

  useEffect(() => {
    if (program && programDay) {
      navigation.setOptions({
        title: `${program.name} - ${programDay.dayName}`,
      });
    }
  }, [program?.name]);

  useEffect(() => {
    if (!isWorkoutRunning && dayId) {
      startWorkout(dayId);
    }
  }, []);

  // Licznik przerwy treningowej
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
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreak]);

  // automatyczne przejście na następne ćwiczenie po załadowaniu danych z bazy
  useEffect(() => {
    if (!workouts.length || !exercises.length) return;
    const refreshedWorkout = workouts.find((w) => w.id === currentWorkoutId);
    if (!refreshedWorkout) return;

    if (
      refreshedWorkout.exercises?.[currentPage]?.sets.length ===
        exercises[currentPage]?.sets.length &&
      currentPage < exercises.length - 1
    ) {
      flatListRef.current?.scrollToIndex({
        index: currentPage + 1,
        animated: true,
      });
    }
  }, [workouts]);

  useEffect(() => {
    if (!workout) return;

    const logged = new Set();
    workout.exercises?.forEach((exercise) => {
      exercise.sets?.forEach((set) => {
        const key = `${exercise.programExerciseId}_${set.setNumber}`;
        logged.add(key);
      });
    });

    setLoggedSets(logged);
  }, [workout]);

  useEffect(() => {
    if (!workout) return;

    const newInputs = {};
    workout.exercises?.forEach((exercise) => {
      exercise.sets?.forEach((set) => {
        const key = `${exercise.programExerciseId}_${set.setNumber}`;
        newInputs[key] = {
          weight:
            set.weight !== null && set.weight !== undefined
              ? String(set.weight)
              : "0",
          reps:
            set.reps !== null && set.reps !== undefined ? String(set.reps) : "",
        };
      });
    });
    setSetInputs((prev) => ({
      ...prev,
      ...newInputs,
    }));
  }, [workout]);

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

    await addWorkoutSet(
      currentWorkoutId,
      exerciseId,
      setId,
      data.weight,
      data.reps
    );

    await loadWorkouts();

    setLoggedSets((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });

    setFocusedSet(null);
    setTimeLeft(initialSeconds);
    setIsBreak(true);
  };

  const skipRest = () => {
    setIsBreak(false);
    setTimeLeft(initialSeconds);
  };

  if (!programDay || !exercises?.length) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No exercises found for this day.</Text>
      </View>
    );
  }

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
          renderItem={({ item }) => (
            <View style={styles.page}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginHorizontal: 40,
                  marginBottom: 10,
                }}
              >
                <Text style={styles.name}>{item.exerciseName}</Text>

                {focusedSet && oneRepMax ? (
                  <Text style={styles.name}>1RM: {oneRepMax.toFixed(1)}</Text>
                ) : (
                  <Text style={styles.name}>1RM: -</Text>
                )}
              </View>

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
                      placeholder={values.weight || "0"}
                    />
                    <Text style={{ alignSelf: "center" }}>kgs</Text>

                    <NumericTextInput
                      term={values.reps}
                      onFocus={() => handleFocus(item.id, set.id)}
                      handleChange={(val) =>
                        handleInputChange(item.id, set.id, "reps", val)
                      }
                      placeholder={values.reps || String(set.reps)}
                    />
                    <Text style={{ alignSelf: "center" }}>reps</Text>

                    <MaterialIcons
                      name="done"
                      size={20}
                      style={styles.done}
                      color={loggedSets.has(key) ? "blue" : "black"}
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
    backgroundColor: "lightgray",
  },
  image: {
    width: width,
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
  },
  page: {
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
  button: {
    backgroundColor: "transparent",
    width: 100,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 12,
    paddingBottom: 12,
    alignSelf: "center",
  },
  localModalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  localModalContent: {
    paddingHorizontal: 10,
    flexDirection: "row",
    height: 50,
    width: 100,
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default WorkoutScreen;
