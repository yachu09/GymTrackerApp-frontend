import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Linking,
  TouchableOpacity,
} from "react-native";

const ExerciseDetailsScreen = ({ route }) => {
  const exercise = route.params.exercise;

  //link chwilowo przekierowuje do tutoriala bench pressa. Można dodać linki do każdego ćwiczenia w API ale trzeba zakładać, że tracą one ważność gdy film zostanie np usunięty więc trzeba zapytać promotora
  const openLink = () => {
    Linking.openURL("https://www.youtube.com/watch?v=4Y2ZdHCOXok");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{exercise.name}</Text>
      <Image source={{ uri: exercise.imageUrl }} style={styles.image} />
      <Text style={styles.description}>{exercise.description}</Text>
      <TouchableOpacity
        onPress={() => {
          openLink();
        }}
      >
        <Text
          style={{
            color: "blue",
            fontSize: 18,
            fontWeight: "bold",
            alignSelf: "center",
            marginTop: 20,
          }}
        >
          Watch a tutorial video
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
  },
  description: {
    fontSize: 16,
    marginTop: 10,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default ExerciseDetailsScreen;
