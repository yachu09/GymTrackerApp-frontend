import React, { useContext } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import StandardButton from "../components/shared/StandardButton";
import ProgramDayBox from "../components/ProgramDayBox";
import { Context as TrainingProgramsContext } from "../context/TrainingProgramsContext";

const ProgramDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const programId = route.params.programId;

  const { state: programs } = useContext(TrainingProgramsContext);

  const program = programs.find((p) => p.id === programId);

  return (
    <LinearGradient style={{ flex: 1 }} colors={["#FFFFFF", "lightblue"]}>
      <View style={styles.container}>
        {/* <Text>Details of {program.name} program</Text> */}
        {!program.days.length ? (
          <Text style={styles.noDays}>
            Add training days to finish {"\n"} setting up your program!
          </Text>
        ) : null}
        <FlatList
          data={program.days}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            return (
              <ProgramDayBox
                day={item}
                program={program}
                onPress={() => {
                  navigation.navigate("ProgramDayDetails", {
                    day: item,
                    program: program,
                  });
                }}
              />
            );
          }}
        />
        <StandardButton
          text="Add Training Day"
          onPress={() => {
            console.log(program.id);
            navigation.navigate("AddProgramDay", { programId: program.id });
          }}
        />
        <View style={{ height: 10 }}></View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noDays: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 200,
  },
});

export default ProgramDetailsScreen;
