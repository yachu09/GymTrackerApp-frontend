import React from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import ProgramExerciseDetail from "../components/ProgramExerciseDetail";
import StandardButton from "../components/StandardButton";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const ProgramDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const program = route.params.program;
  return (
    <LinearGradient style={{ flex: 1 }} colors={["#FFFFFF", "lightblue"]}>
      <View>
        <Text style={styles.programName}>{program.name}</Text>
        <FlatList
          data={program.exercises}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            return <ProgramExerciseDetail exercise={item} />;
          }}
        />
        <StandardButton
          text="Done"
          onPress={() => {
            navigation.pop();
          }}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {},
  programName: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
  },
});

export default ProgramDetailsScreen;
