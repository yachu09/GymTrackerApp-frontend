import React from "react";
import { View, TextInput, StyleSheet } from "react-native";

const NumericTextInput = ({ handleChange, term, placeholder = 0 }) => {
  return (
    <View>
      <TextInput
        style={styles.inputStyle}
        textAlign="center"
        placeholder={placeholder.toString()}
        keyboardType="numeric"
        value={term}
        onChangeText={(term) => {
          handleChange(term);
        }}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    backgroundColor: "#f0f0f0",
    width: 40,
    margin: 5,
    borderRadius: 10,
    alignSelf: "center",
  },
});

export default NumericTextInput;
