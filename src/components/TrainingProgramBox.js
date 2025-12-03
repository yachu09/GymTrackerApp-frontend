import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import { Context as TrainingProgramsContext } from "../context/TrainingProgramsContext";

const TrainingProgramBox = ({ program, onPress }) => {
  const {
    state: programs,
    deleteProgram,
    loadPrograms,
  } = useContext(TrainingProgramsContext);

  const navigation = useNavigation();

  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <TouchableOpacity
      onPress={() => {
        if (isModalVisible) setIsModalVisible(false);
        else onPress();
      }}
    >
      <LinearGradient
        start={{ x: 0, y: 0.5 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
        colors={["lightblue", "#58b4e3ff"]}
      >
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => setIsModalVisible(true)}
        >
          <Feather name="trash-2" size={20} color="black" />
        </TouchableOpacity>
        <View style={styles.viewContainer}>
          <Text style={styles.programName}>{program.name}</Text>
          <Text style={{ fontSize: 18, paddingTop: 5 }}>
            {program.days.length} Training day/s
          </Text>
          {/* <View
            style={styles.button}
          >
            <Text style={styles.buttonText}>See more</Text>
          </View> */}
        </View>
        {isModalVisible && (
          <View style={styles.localModalContainer}>
            <View style={styles.localModalContent}>
              <Text style={{ color: "white", marginBottom: 10 }}>
                Really want to delete?
              </Text>
              <TouchableOpacity
                style={{
                  height: 30,
                  borderRadius: 15,
                  borderColor: "black",
                  backgroundColor: "#ed4242",
                  justifyContent: "center",
                }}
                onPress={async () => {
                  console.log("usun program");
                  await deleteProgram(program.id);
                  loadPrograms();
                  setIsModalVisible(false);
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "lightblue",
    height: 100,
    // justifyContent: "center",
    // alignItems: "center",
    // alignSelf: "stretch",
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 25,
  },
  iconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
    zIndex: 10,
  },
  localModalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  viewContainer: {
    alignItems: "center",
    alignSelf: "stretch",
  },
  programName: {
    paddingTop: 5,
    fontSize: 24,
    marginTop: 10,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "white",
    height: 30,
    width: 100,
    borderRadius: 25,
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 12,
    alignSelf: "center",
  },
});

export default TrainingProgramBox;
