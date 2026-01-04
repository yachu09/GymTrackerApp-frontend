import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Linking,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ExerciseRating from "../components/ExerciseRating";
import StandardButton from "../components/shared/StandardButton";

const ExerciseDetailsScreen = ({ route }) => {
  const exercise = route.params.exercise;
  const ytUrl =
    "https://www.youtube.com/results?search_query=" +
    encodeURIComponent(`${exercise.name} tutorial`);
  const openLink = () => {
    Linking.openURL(ytUrl);
  };

  return (
    <LinearGradient style={{ flex: 1 }} colors={["#FFFFFF", "lightblue"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{exercise.name}</Text>
          <Text style={styles.subtitle}>Technique & description</Text>
        </View>

        <View style={styles.card}>
          <Image source={{ uri: exercise.imageUrl }} style={styles.image} />

          <Text style={styles.description}>{exercise.description}</Text>

          <StandardButton text="Find tutorial video" onPress={openLink} />

          <TouchableOpacity onPress={openLink} style={styles.linkRow}>
            <Text style={styles.linkHint}>Searches YouTube</Text>
          </TouchableOpacity>
        </View>
        <ExerciseRating exercise={exercise} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "black",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    textAlign: "center",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(17, 24, 39, 0.08)",
  },
  image: {
    width: "100%",
    height: 260,
    borderRadius: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  description: {
    fontSize: 15,
    fontWeight: "500",
    color: "black",
    lineHeight: 20,
  },
  linkRow: {
    marginTop: 5,
    alignItems: "center",
  },
  linkHint: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
});

export default ExerciseDetailsScreen;
