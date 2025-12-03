import React from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import ProgramExerciseDetail from "../components/ProgramExerciseDetail";
import StandardButton from "../components/shared/StandardButton";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const ProgramDayDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const programDay = route.params.day;
  return (
    <LinearGradient style={{ flex: 1 }} colors={["#FFFFFF", "lightblue"]}>
      <View>
        <Text style={styles.programDayName}>{programDay.dayName}</Text>
        <FlatList
          data={programDay.exercises}
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
  programDayName: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
  },
});

export default ProgramDayDetailsScreen;
