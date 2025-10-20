import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

const TrainingProgramBox = ({ programName, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.programName}>{programName}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "lightblue",
    height: 100,
    // justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 10,
  },
  programName: {
    marginTop: 10,
    fontWeight: "bold",
  },
});

export default TrainingProgramBox;
