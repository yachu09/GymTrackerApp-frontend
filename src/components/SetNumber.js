import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SetNumber = ({ number, isSelected }) => {
  return (
    <View style={styles.container}>
      <Text>{number}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "lightblue",
    height: 40,
    width: 40,
    borderRadius: 20,
    marginLeft: 15,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {},
});

export default SetNumber;
