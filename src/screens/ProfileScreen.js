import React from "react";
import { View, Text, StyleSheet } from "react-native";
import StandardButton from "../components/StandardButton";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const ProfileScreen = () => {
  const navigation = useNavigation();
  return (
    <LinearGradient style={{ flex: 1 }} colors={["#FFFFFF", "lightblue"]}>
      <View>
        <StandardButton
          text="Body Measurements"
          onPress={() => {
            navigation.navigate("BodyMeasurements");
          }}
        />
        <StandardButton
          text="Workout Calendar"
          onPress={() => {
            navigation.navigate("WorkoutCalendar");
          }}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({});

export default ProfileScreen;
