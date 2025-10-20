import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const AddProgramButton = ({ onPress, text }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "lightblue",
    height: 50,
    borderRadius: 10,
    flexDirection: "row",
    padding: 10,
    marginHorizontal: 15,
    marginTop: 10,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    color: "black",
  },
});

export default AddProgramButton;
