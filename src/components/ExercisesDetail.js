import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";

const ExercisesDetail = ({ exercise, bgColor }) => {
  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={styles.name}>{exercise.name}</Text>

      <Image
        source={{ uri: exercise.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.description}>{exercise.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "black",
    // marginHorizontal: 10,
    marginLeft: 15,
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 25,
    alignItems: "flex-start",
    width: 250,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    width: "100%",
  },
});

export default ExercisesDetail;
