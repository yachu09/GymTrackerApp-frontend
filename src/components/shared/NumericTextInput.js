import React from "react";
import { View, TextInput, StyleSheet } from "react-native";

const NumericTextInput = ({
  handleChange,
  term,
  placeholder = 0,
  onFocus,
  onBlur,
}) => {
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
        onFocus={onFocus ? onFocus : undefined}
        onBlur={onBlur ? onBlur : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    backgroundColor: "#f0f0f0",
    width: 40,
    margin: 5,
    height: 40,
    borderRadius: 25,
    alignSelf: "center",
  },
});

export default NumericTextInput;
