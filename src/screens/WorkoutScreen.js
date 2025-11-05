import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import AddProgramButton from "../components/AddProgramButton";

const WorkoutScreen = ({ route }) => {
  const program = route.params.program;
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: program.exercises[0].imageUrl }}
        style={styles.image}
      />
      <Text>{program.exercises[0].exerciseName}</Text>
      <Text>Set 1 ...</Text>
      <Text>Set 2 ...</Text>
      <Text>Set 3 ...</Text>
      <AddProgramButton text="Log Set" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
  },
});

export default WorkoutScreen;
