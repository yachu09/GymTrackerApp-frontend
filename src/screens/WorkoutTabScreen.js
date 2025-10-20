import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import StandardButton from "../components/StandardButton";

const WorkoutTabScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <StandardButton
        onPress={() => {
          navigation.navigate("WorkoutPlanning");
        }}
        text="Click to plan your workout!"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 300,
  },
});

export default WorkoutTabScreen;
