import React, { useContext, useEffect, useLayoutEffect } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { Context as WorkoutContext } from "../context/WorkoutContext";
import { useNavigation } from "@react-navigation/native";
import useTotalWeight from "../hooks/useTotalWeight";
import { LinearGradient } from "expo-linear-gradient";
import StandardButton from "../components/shared/StandardButton";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import ViewShot from "react-native-view-shot";
import { useRef } from "react";
import { Alert } from "react-native";
import * as MediaLibrary from "expo-media-library";

const { width, height } = Dimensions.get("window");

const WorkoutSummaryScreen = ({ route }) => {
  const viewShotRef = useRef();
  const navigation = useNavigation();
  const workoutId = route.params.workoutId;
  const [totalWeight, errorMessage] = useTotalWeight(workoutId);
  const {
    state: { workouts },
    loadWorkouts,
  } = useContext(WorkoutContext);

  useEffect(() => {
    loadWorkouts();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
      headerLeft: () => <></>,
    });
  }, [navigation]);

  if (!workouts || !Array.isArray(workouts)) {
    return <Text>Loading workout data...</Text>;
  }

  const workout = workouts.find((w) => w.id === workoutId);

  if (!workout) {
    return <Text>No workout found for ID: {workoutId}</Text>;
  }

  const saveToGallery = async () => {
    try {
      const uri = await viewShotRef.current.capture();

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("No permissions", "Allow access to the gallery");
        return;
      }

      await MediaLibrary.saveToLibraryAsync(uri);

      Alert.alert("Success!", "Photo has been saved! 🎉");
    } catch (error) {
      console.log("SAVE ERROR:", error);
      Alert.alert("Error", "Saving photo failed.");
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds || seconds <= 0) return "00:00:00";
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <LinearGradient style={{ flex: 1 }} colors={["#FFFFFF", "lightblue"]}>
      <ViewShot
        ref={viewShotRef}
        options={{ format: "png", quality: 1 }}
        style={{ width: "100%", height: "100%", flex: 1 }}
      >
        <View style={styles.summaryContainer}>
          {/* <Text>Summary of {workout.programName} program workout</Text>
          <Text>Start of workout: {workout.date}</Text>
      <Text>Total Weight Lifted: {totalWeight} kgs</Text> */}
          <Text
            style={{
              marginTop: 15,
              fontWeight: "bold",
              fontSize: 18,
              alignSelf: "center",
            }}
          >
            Workout Complete!
          </Text>
          <Text
            style={{
              marginTop: 5,
              fontWeight: "600",
              fontSize: 14,
              alignSelf: "center",
            }}
          >
            {workout.programName} - {workout.dayName}
          </Text>
          <Image
            source={require("../../assets/victory.png")}
            style={styles.image}
          />
          <Text style={styles.weightLifted}>
            Weight lifted: {totalWeight} kgs
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
            }}
          >
            <View style={styles.infoContainer}>
              <FontAwesome6 name="dumbbell" size={30} color="black" />
              <Text>Exercises</Text>
              <Text>{workout.exercises.length}</Text>
            </View>
            <View style={styles.infoContainer}>
              <FontAwesome5 name="clock" size={30} color="black" />
              <Text>Duration</Text>
              <Text>{formatDuration(workout.duration)}</Text>
            </View>
            {/* <View style={styles.infoContainer}>
              <FontAwesome5 name="trophy" size={30} color="black" />
              <Text>New Record</Text>
              <Text>0</Text>
            </View> */}
          </View>
        </View>
      </ViewShot>
      <StandardButton text="Save as image" onPress={() => saveToGallery()} />
      <StandardButton
        text="Done"
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "WorkoutPlanning" }],
          });
        }}
      />
      <View style={{ height: 10 }}></View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  summaryContainer: {
    backgroundColor: "white",
    borderRadius: 25,
    width: width * 0.8,
    height: height * 0.5,
    alignSelf: "center",
    marginTop: height * 0.08,
    marginBottom: 20,
    paddingHorizontal: 45,
  },
  infoContainer: {
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  weightLifted: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 30,
  },
});

export default WorkoutSummaryScreen;
