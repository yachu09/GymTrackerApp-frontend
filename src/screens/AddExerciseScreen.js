import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import StandardTextInput from "../components/shared/StandardTextInput";
import StandardButton from "../components/shared/StandardButton";
import useMuscleGroups from "../hooks/useMuscleGroups";
import { Picker } from "@react-native-picker/picker";

const AddExerciseScreen = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [searchMuscleGroups, muscleGroups, errorMessage] = useMuscleGroups();
  const [selected, setSelected] = useState();

  const [invalidNameError, setInvalidNameError] = useState(false);
  const [noNameError, setNoNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [noDescriptionError, setNoDescriptionError] = useState(false);

  const muscleGroupsToPicker = () => {
    const pickerItems = [];
    muscleGroups.forEach((group) => {
      pickerItems.push(
        <Picker.Item label={group.name} value={group.name} key={group.id} />
      );
    });
    return pickerItems;
  };

  const pickerItems = muscleGroupsToPicker();

  //zablokuj znaki specjalnie oraz liczby, do tego kapitalizuj pierwsza litere nazwy i ogranicz długość opisu.
  // Zrób zabezpieczenie również w API
  const addExercise = () => {
    const nameRegex = /^[A-Za-z ]+$/;

    if (!name) setNoNameError(true);
    else setNoNameError(false);

    if (!description) setNoDescriptionError(true);
    else setNoDescriptionError(false);

    if (name && description && selected) {
      if (!nameRegex.test(name)) {
        setInvalidNameError(true);
        return;
      }
      if (description.length > 250) {
        setDescriptionError(true);
        return;
      }
    }
  };

  return (
    <LinearGradient style={{ flex: 1 }} colors={["#FFFFFF", "lightblue"]}>
      <View style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.label}>Name: </Text>
          <StandardTextInput
            placeholder="Enter exercise name"
            term={name}
            onTermChange={(newTerm) => {
              setName(newTerm);
            }}
          />
          {invalidNameError ? (
            <Text style={styles.errorMessage}>
              Name must contain only letters
            </Text>
          ) : null}
          {noNameError ? (
            <Text style={styles.errorMessage}>Name is missing</Text>
          ) : null}
          <Text style={styles.label}>Description: </Text>
          <StandardTextInput
            placeholder="Enter short description"
            term={description}
            onTermChange={(newTerm) => {
              setDescription(newTerm);
            }}
          />
          {descriptionError ? (
            <Text style={styles.errorMessage}>Description is too long</Text>
          ) : null}
          {noDescriptionError ? (
            <Text style={styles.errorMessage}>Description is missing</Text>
          ) : null}
          {/* make some kind of enum in API and change text input to picker */}
          <Text style={styles.label}>Muscle Group: </Text>
          {/* <StandardTextInput placeholder="Enter muscle group" /> */}
          <Picker
            selectedValue={selected}
            onValueChange={(value) => setSelected(value)}
          >
            {pickerItems}
          </Picker>
        </View>

        <View style={styles.footer}>
          <StandardButton
            text="Add Exercise"
            onPress={() => {
              addExercise();
            }}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    justifyContent: "space-between",
  },
  form: {
    flex: 1,
  },
  footer: {
    paddingBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 10,
  },
  errorMessage: {
    color: "red",
    alignSelf: "center",
  },
});

export default AddExerciseScreen;
