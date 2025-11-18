import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const StandardButton = ({ onPress, text }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        start={{ x: 0, y: 0.5 }}
        end={{ x: 0, y: 1 }}
        style={styles.button}
        colors={["lightblue", "#58b4e3ff"]}
      >
        <Text style={styles.buttonText}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "lightblue",
    height: 50,
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    // borderWidth: 1,
    // borderColor: "white",
    borderRadius: 25,
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

export default StandardButton;
