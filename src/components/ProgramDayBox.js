import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import { Context as TrainingProgramsContext } from "../context/TrainingProgramsContext";
import { hasWorkoutTodayInDb } from "../repos/workoutRepository";
import { Alert } from "react-native";
import EditTextInput from "./shared/EditTextInput";

const ProgramDayBox = ({ day, program, onPress }) => {
  const {
    state: programs,
    deleteProgramDay,
    loadPrograms,
    updateTrainingDayName,
  } = useContext(TrainingProgramsContext);

  const navigation = useNavigation();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const [term, setTerm] = useState(day.dayName);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (term) setErrorMessage("");
  }, [term]);

  //sprawdza czy dzien treningowy ma przypisane serie powtórzenia i czas przerwy
  const isDaySetUp = (day) => {
    if (!day?.exercises || day.exercises.length === 0) return false;

    for (const exercise of day.exercises) {
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

  const workoutStart = async () => {
    const alreadyDoneToday = await hasWorkoutTodayInDb();

    if (alreadyDoneToday) {
      Alert.alert("You should rest!", "You already completed a workout today!");
      return;
    }

    navigation.navigate("Workout", {
      programId: program.id,
      dayId: day.id,
    });
  };

  return (
    <TouchableOpacity
      onPress={() => {
        if (isModalVisible) setIsModalVisible(false);
        else onPress();
      }}
    >
      <View style={styles.container}>
        {/* delete */}
        <TouchableOpacity
          style={styles.rightIconContainer}
          onPress={() => setIsModalVisible(true)}
        >
          <Feather name="trash-2" size={20} color="black" />
        </TouchableOpacity>
        {/* edit */}
        <TouchableOpacity
          style={styles.leftIconContainer}
          onPress={() => {
            if (isEditMode) {
              setIsEditMode(false);
            } else {
              setIsEditMode(true);
            }
          }}
        >
          <Entypo name="edit" size={20} color="black" />
        </TouchableOpacity>
        <View style={styles.viewContainer}>
          {isEditMode ? (
            <EditTextInput
              placeholder={day.dayName}
              term={term}
              onTermChange={(newTerm) => setTerm(newTerm)}
              onTermSubmit={() => {
                if (term) {
                  //TODO update program day name
                  updateTrainingDayName(day.id, term);
                  setIsEditMode(false);
                  setErrorMessage("");
                } else {
                  setErrorMessage("No day name!");
                }
              }}
            />
          ) : (
            <>
              <Text style={styles.programName}>{day.dayName}</Text>
              <Text>{day.exercises.length} exercises</Text>
            </>
          )}
          {errorMessage && isEditMode && (
            <Text style={{ color: "red" }}>{errorMessage}</Text>
          )}
          {/* <Text style={styles.programName}>{day.dayName}</Text>
          <Text>{day.exercises.length} exercises</Text> */}
          {/* jeśli tak renderuje przycisk aby zacząć trening */}
          {isDaySetUp(day)
            ? !isEditMode && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    workoutStart();
                  }}
                >
                  <Text style={styles.buttonText}>Start Workout</Text>
                </TouchableOpacity>
              )
            : !isEditMode && (
                <Text
                  style={{
                    marginTop: 10,
                    fontWeight: "bold",
                    color: "#ed4242",
                  }}
                >
                  Finish setting up your training day!
                </Text>
              )}
        </View>
        {isModalVisible && (
          <View style={styles.localModalContainer}>
            <View style={styles.localModalContent}>
              <Text style={{ color: "white", marginBottom: 10 }}>
                Really want to delete?
              </Text>
              <TouchableOpacity
                style={{
                  height: 30,
                  borderRadius: 15,
                  borderColor: "black",
                  backgroundColor: "#ed4242",
                  justifyContent: "center",
                }}
                onPress={async () => {
                  console.log("usun dzien programu");
                  await deleteProgramDay(day.id);
                  loadPrograms();
                  setIsModalVisible(false);
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "lightblue",
    backgroundColor: "#58b4e3",
    height: 100,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 15,
  },
  rightIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
    zIndex: 10,
  },
  leftIconContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 5,
    zIndex: 10,
  },
  localModalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  viewContainer: {
    alignItems: "center",
    alignSelf: "stretch",
  },
  programName: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: "bold",
    // color: "white",
  },
  button: {
    backgroundColor: "white",
    height: 30,
    width: 100,
    borderRadius: 15,
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 12,
    alignSelf: "center",
  },
});

export default ProgramDayBox;
