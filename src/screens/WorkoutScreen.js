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
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import StandardButton from "../components/shared/StandardButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";

import { Context as WorkoutContext } from "../context/WorkoutContext";
import { Context as TrainingProgramsContext } from "../context/TrainingProgramsContext";

import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import useOneRepMax from "../hooks/useOneRepMax";
import useWorkoutRestTimer from "../hooks/useWorkoutRestTimer";
import useWorkoutSetInputs from "../hooks/useWorkoutSetInputs";
import useWorkoutLogger from "../hooks/useWorkoutLogger";

import ExercisePage from "../components/workout/ExercisePage";
import RestTimer from "../components/workout/RestTimer";

import WorkoutBreakdown from "../components/workout/WorkoutBreakdown";

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

  const exercisesWithSummary = [
    ...exercises,
    { id: "summary-slot", isSummary: true },
  ];

  const workout = workouts.find((w) => w.id === currentWorkoutId);

  const { timeLeft, isBreak, startBreak, skipBreak, breakDuration } =
    useWorkoutRestTimer();

  const {
    inputs: setInputs,
    focusedSet,
    setFocusedSet,
    handleFocus,
    handleInputChange,
  } = useWorkoutSetInputs(workout);

  const breakTimeGetter = (exerciseId, setNumber) => {
    const ex = programDay?.exercises?.find((e) => e.id === exerciseId);
    if (!ex) return null;
    const s = ex.sets?.find((ss) => ss.setNumber === setNumber);
    return s?.breakTime ?? null;
  };

  const { loggedSets, logSet } = useWorkoutLogger({
    workout,
    exercises,
    currentWorkoutId,
    addWorkoutSet,
    loadWorkouts,
    startBreak,
    breakTimeGetter,
  });

  const flatListRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isLastPage, setIsLastPage] = useState(false);

  const focusedKey = focusedSet
    ? `${focusedSet.exerciseId}_${focusedSet.setId}`
    : null;

  const currentFocusedValues = focusedKey ? setInputs[focusedKey] || {} : {};
  const currentWeight = parseFloat(currentFocusedValues.weight) || 0;
  const currentReps = parseFloat(currentFocusedValues.reps) || 0;

  const [oneRepMax] = useOneRepMax(currentWeight, currentReps);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setCurrentPage(index);
      setIsLastPage(index === exercisesWithSummary.length - 1);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Back",
      headerRight: () => (
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsModalVisible(true)}
          >
            {!isModalVisible && (
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
    if (!workout || !exercises.length) return;

    const allCompleted = workout.exercises.every(
      (loggedEx, idx) => loggedEx.sets.length === exercises[idx].sets.length
    );

    if (allCompleted) {
      flatListRef.current?.scrollToIndex({
        index: exercises.length,
        animated: true,
      });
    }
  }, [workout]);

  useEffect(() => {
    if (program && programDay) {
      navigation.setOptions({
        title: `${program.name} - ${programDay.dayName}`,
      });
    }
  }, [program?.name, programDay?.dayName]);

  useEffect(() => {
    if (!isWorkoutRunning && dayId) {
      startWorkout(dayId);
    }
  }, []);

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

  const handleLogSet = async () => {
    if (!focusedSet) return;

    await logSet(focusedSet, setInputs);

    setFocusedSet(null);
  };

  if (!programDay || !exercises?.length) {
    return (
      <View style={styles.centered}>
        <Text>No exercises found for this day.</Text>
      </View>
    );
  }

  return (
    <LinearGradient style={{ flex: 1 }} colors={["#FFFFFF", "lightblue"]}>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={exercisesWithSummary}
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
          renderItem={({ item }) =>
            item.isSummary ? (
              <View style={{ width: width, paddingBottom: 120 }}>
                <WorkoutBreakdown workout={workout} />
              </View>
            ) : (
              <ExercisePage
                exercise={item}
                setInputs={setInputs}
                loggedSets={loggedSets}
                focusedSet={focusedSet}
                handleFocus={handleFocus}
                handleInputChange={handleInputChange}
                oneRepMax={oneRepMax}
              />
            )
          }
        />

        {!isLastPage && (
          <RestTimer
            timeLeft={timeLeft}
            totalTime={breakDuration}
            onSkip={skipBreak}
          />
        )}
        {isLastPage ? (
          <StandardButton
            text="Save Workout"
            onPress={() => {
              onSave();
            }}
          />
        ) : (
          <StandardButton text="Log Set" onPress={handleLogSet} />
        )}

        <View style={{ marginBottom: 10 }} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
