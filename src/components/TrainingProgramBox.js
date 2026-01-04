import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import { Context as TrainingProgramsContext } from "../context/TrainingProgramsContext";
import EditTextInput from "./shared/EditTextInput";

const TrainingProgramBox = ({ program, onPress }) => {
  const {
    state: programs,
    deleteProgram,
    loadPrograms,
    updateProgramName,
  } = useContext(TrainingProgramsContext);

  const navigation = useNavigation();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const [term, setTerm] = useState(program.name);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (term) setErrorMessage("");
  }, [term]);

  return (
    <TouchableOpacity
      onPress={() => {
        if (isModalVisible) setIsModalVisible(false);
        else onPress();
      }}
    >
      {/* <LinearGradient
        start={{ x: 0, y: 0.5 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
        colors={["lightblue", "#58b4e3ff"]}
      > */}
      <View style={styles.container}>
        {/* delete */}
        <TouchableOpacity
          style={styles.rightIconContainer}
          onPress={() => setIsModalVisible(true)}
        >
          <Feather name="trash-2" size={20} color="black" />
        </TouchableOpacity>
        {/* edit */}
        <TouchableOpacity
          style={styles.leftIconContainer}
          onPress={() => {
            if (isEditMode) {
              setIsEditMode(false);
            } else {
              setIsEditMode(true);
            }
          }}
        >
          <Entypo name="edit" size={20} color="black" />
        </TouchableOpacity>
        <View style={styles.viewContainer}>
          {isEditMode ? (
            <EditTextInput
              placeholder={program.name}
              term={term}
              onTermChange={(newTerm) => setTerm(newTerm)}
              onTermSubmit={() => {
                if (term) {
                  updateProgramName(program.id, term);
                  setIsEditMode(false);
                  setErrorMessage("");
                } else {
                  setErrorMessage("No program name!");
                }
              }}
            />
          ) : (
            <Text style={styles.programName}>{program.name}</Text>
          )}
          {/* <Text style={styles.programName}>{program.name}</Text> */}
          {errorMessage && isEditMode && (
            <Text style={{ color: "red" }}>{errorMessage}</Text>
          )}
          <Text style={{ fontSize: 18, paddingTop: 5 }}>
            {program.days.length} Training day/s
          </Text>
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
      </View>
      {/* </LinearGradient> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "lightblue",
    backgroundColor: "#58b4e3",
    height: 100,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 15,
  },
  rightIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
    zIndex: 10,
  },
  leftIconContainer: {
    position: "absolute",
    top: 10,
    left: 10,
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
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  viewContainer: {
    alignItems: "center",
    alignSelf: "stretch",
  },
  programName: {
    paddingVertical: 5,
    fontSize: 24,
    marginTop: 10,
    fontWeight: "bold",
    marginHorizontal: 45,
    // color: "white",
  },
  button: {
    backgroundColor: "white",
    height: 30,
    width: 100,
    borderRadius: 15,
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 12,
    alignSelf: "center",
  },
});

export default TrainingProgramBox;
