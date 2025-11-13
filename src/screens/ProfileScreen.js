import React from "react";
import { View, Text, StyleSheet } from "react-native";
import StandardButton from "../components/StandardButton";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const navigation = useNavigation();
  return (
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
  );
};

const styles = StyleSheet.create({});

export default ProfileScreen;
