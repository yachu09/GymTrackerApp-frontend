import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const EditTextInput = ({ term, placeholder, onTermChange, onTermSubmit }) => {
  return (
    <View style={styles.background}>
      <TextInput
        style={styles.inputStyle}
        placeholder={placeholder}
        value={term}
        onChangeText={(newTerm) => onTermChange(newTerm)}
        autoCapitalize="none"
        autoCorrect={false}
        onSubmitEditing={() => {
          onTermSubmit();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "white",
    height: 40,
    borderRadius: 25,
    marginHorizontal: 75,
    flexDirection: "row",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  inputStyle: {
    flex: 1,
    fontSize: 18,
  },
});

export default EditTextInput;
