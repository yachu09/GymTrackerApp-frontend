import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SetNumber from "../SetNumber";
import NumericTextInput from "../shared/NumericTextInput";
import { MaterialIcons } from "@expo/vector-icons";

const ExerciseSetRow = ({
  exerciseId,
  setId,
  index,
  values,
  logged,
  isFocused,
  onFocus,
  onInputChange,
}) => {
  return (
    <View style={[styles.setContainer, isFocused && styles.focusedRow]}>
      <SetNumber number={index + 1} />

      <NumericTextInput
        term={values.weight}
        onFocus={() => onFocus(exerciseId, setId)}
        handleChange={(val) => onInputChange(exerciseId, setId, "weight", val)}
        placeholder={values.weight || "0"}
      />
      <Text style={styles.unit}>kgs</Text>

      <NumericTextInput
        term={values.reps}
        onFocus={() => onFocus(exerciseId, setId)}
        handleChange={(val) => onInputChange(exerciseId, setId, "reps", val)}
        placeholder={values.reps || "0"}
      />
      <Text style={styles.unit}>reps</Text>

      <MaterialIcons
        name="done"
        size={20}
        style={styles.done}
        color={logged ? "blue" : "black"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  setContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  focusedRow: {
    backgroundColor: "lightgray",
  },
  unit: {
    alignSelf: "center",
  },
  done: {
    alignSelf: "center",
    marginRight: 15,
  },
});

export default ExerciseSetRow;
