import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const StandardTextInput = ({
  term,
  placeholder,
  onTermChange,
  onTermSubmit,
}) => {
  return (
    <View style={styles.background}>
      <TextInput
        style={styles.inputStyle}
        placeholder={placeholder}
        value={term}
        onChangeText={(newTerm) => onTermChange(newTerm)}
        autoCapitalize="none"
        autoCorrect={false}
        // onEndEditing={() => {
        //   onTermSubmit();
        // }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "lightgray",
    height: 50,
    borderRadius: 15,
    marginHorizontal: 15,
    flexDirection: "row",
    marginTop: 15,
    paddingHorizontal: 10,
  },
  inputStyle: {
    flex: 1,
    fontSize: 18,
  },
});

export default StandardTextInput;
