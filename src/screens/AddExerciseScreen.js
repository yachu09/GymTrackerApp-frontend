import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import StandardTextInput from "../components/shared/StandardTextInput";
import StandardButton from "../components/shared/StandardButton";
import useMuscleGroups from "../hooks/useMuscleGroups";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import useUploadExercise from "../hooks/useUploadExercise";
import { useNavigation } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";

const AddExerciseScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [searchMuscleGroups, muscleGroups, errorMessage] = useMuscleGroups();
  const [selected, setSelected] = useState();

  const [selectedImage, setSelectedImage] = useState(null);

  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [muscleGroupError, setMuscleGroupError] = useState("");
  const [imageError, setImageError] = useState("");

  const { uploadExercise, loading, error, success } = useUploadExercise();

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

  const addExercise = async () => {
    const nameRegex = /^[A-Za-z ]+$/;
    let valid = true;

    if (!name) {
      setNameError("Name is missing");
      valid = false;
    } else if (!nameRegex.test(name)) {
      setNameError("Invalid name");
      valid = false;
    } else {
      setNameError("");
    }

    if (!description) {
      setDescriptionError("Description is missing");
      valid = false;
    } else if (description.length > 250) {
      setDescriptionError("Description too long");
      valid = false;
    } else {
      setDescriptionError("");
    }

    if (!selected) {
      setMuscleGroupError("Select muscle group");
      valid = false;
    } else {
      setMuscleGroupError("");
    }

    if (!selectedImage) {
      setImageError("Please select an image");
      valid = false;
    } else {
      setImageError("");
    }

    if (!valid) return;

    await uploadExercise({
      name,
      description,
      muscleGroup: selected,
      image: selectedImage,
    });
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Potrzebne jest pozwolenie na dostęp do galerii.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.9,
    });

    console.log("Picker result:", result);

    if (!result.canceled) {
      const asset = result.assets[0];
      setSelectedImage(asset);
    }
  };

  return (
    <LinearGradient style={{ flex: 1 }} colors={["#FFFFFF", "lightblue"]}>
      {/* <View style={styles.container}> */}
      {success ? (
        <View style={styles.successContainer}>
          <Feather
            name="check-circle"
            size={88}
            color="#3fc034ff"
            style={styles.successIcon}
          />
          <Text style={styles.success}>Exercise added successfully!</Text>
          <StandardButton
            text="Okay!"
            onPress={() => {
              navigation.popToTop();
            }}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.form}>
            <Text style={styles.label}>Name and description: </Text>
            <StandardTextInput
              placeholder="Enter exercise name"
              term={name}
              onTermChange={(newTerm) => {
                setName(newTerm);
              }}
            />
            {nameError && <Text style={styles.errorMessage}>{nameError}</Text>}

            <StandardTextInput
              placeholder="Enter short description"
              term={description}
              onTermChange={(newTerm) => {
                setDescription(newTerm);
              }}
            />
            {descriptionError && (
              <Text style={styles.errorMessage}>{descriptionError}</Text>
            )}

            <Text style={styles.label}>Muscle Group: </Text>
            <Picker
              selectedValue={selected}
              onValueChange={(value) => setSelected(value)}
              itemStyle={{ fontSize: 18, height: 120 }}
              style={{ paddingHorizontal: 10 }}
            >
              {pickerItems}
            </Picker>
            {muscleGroupError && (
              <Text style={styles.errorMessage}>{muscleGroupError}</Text>
            )}
            {selectedImage ? (
              <Image source={{ uri: selectedImage.uri }} style={styles.image} />
            ) : null}
            {imageError && (
              <Text style={styles.errorMessage}>{imageError}</Text>
            )}
          </View>
          <View style={styles.footer}>
            <StandardButton
              text="Pick an image"
              onPress={() => {
                pickImage();
              }}
            />

            <StandardButton
              text="Add Exercise"
              onPress={() => {
                addExercise();
              }}
            />
          </View>
        </View>
      )}

      {/* </View> */}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 16,
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
    marginTop: 20,
  },
  errorMessage: {
    color: "red",
    alignSelf: "center",
  },
  image: {
    marginTop: 20,
    alignSelf: "center",
    width: 160,
    height: 160,
    borderRadius: 25,
    borderColor: "white",
    borderWidth: 10,
    marginBottom: 5,
  },
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  success: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3fc034ff",
  },
  successIcon: {
    alignSelf: "center",
    marginBottom: 10,
  },
});

export default AddExerciseScreen;
