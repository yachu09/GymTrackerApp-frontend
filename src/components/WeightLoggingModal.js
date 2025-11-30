import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import StandardTextInput from "./StandardTextInput";

const WeightLoggingModal = ({ onClose }) => {
  const [date, setDate] = useState(new Date());

  const onChange = (event, selectedDate) => {
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
    }
    // if (Platform.OS === "ios") setShowPicker(false);
  };
  return (
    <View style={styles.localModalContainer}>
      <View style={styles.localModalContent}>
        <DateTimePicker
          value={date}
          mode="date" // "date" | "time" | "datetime"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChange}
          maximumDate={new Date()}
        />
        <StandardTextInput placeholder="Enter your weight" />
        <TouchableOpacity
          style={{
            height: 50,
            width: "90%",
            paddingHorizontal: 25,
            marginTop: 20,
            borderRadius: 25,
            borderColor: "black",
            backgroundColor: "lightblue",
            justifyContent: "center",
          }}
          onPress={onClose}
        >
          <Text
            style={{
              alignSelf: "center",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Done
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  localModalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    borderRadius: 25,
    marginHorizontal: 40,
    marginVertical: 140,
    // justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  localModalContent: {
    // paddingHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
  },
});

export default WeightLoggingModal;
