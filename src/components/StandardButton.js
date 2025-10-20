import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const StandardButton = ({ onPress, text }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "lightgray",
    height: 50,
    borderRadius: 10,
    flexDirection: "row",
    padding: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    color: "darkgray",
  },
});

export default StandardButton;
