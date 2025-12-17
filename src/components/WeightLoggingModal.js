import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import StandardTextInput from "./shared/StandardTextInput";
import WeightInput from "./WeightInput";
import { addWeightToDb, loadWeightsFromDb } from "../repos/weightRepository";

const WeightLoggingModal = ({ onClose }) => {
  const [date, setDate] = useState(new Date());
  const [errorMessage, setErrorMessage] = useState("");

  const onChange = (event, selectedDate) => {
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
    }
    // if (Platform.OS === "ios") setShowPicker(false);
  };

  const [weight, setWeight] = useState(0);

  //pozwala tylko na cyfry, jeden przecinek (konwertuje na kropkę) oraz na tylko jedno miejsce dziesiętne
  const handleChange = (text) => {
    let cleaned = text.replace(/[^0-9.,]/g, "");

    cleaned = cleaned.replace(/,/g, ".");

    const parts = cleaned.split(".");

    if (parts.length > 2) {
      cleaned = parts[0] + "." + parts.slice(1).join("");
    } else if (parts.length === 2) {
      parts[1] = parts[1].slice(0, 1);
      cleaned = parts[0] + "." + parts[1];
    }

    setWeight(cleaned);
  };

  const logWeight = async (onClose) => {
    const trimmedDate = trimDate(date);
    if (!trimDate) {
      setErrorMessage("Invalid date");
      console.log("Wprowadz poprawna date");
      return;
    }
    if (weight == 0 || weight[0] == 0) {
      setErrorMessage("Enter correct weight");
      console.log("blad wagi");
      return;
    }

    //sprawdzenie czy istnieje data
    //BUG
    // const exists = await weightExistsForDate(trimmedDate);
    // if (exists) {
    //   setErrorMessage("Weight already logged for this day");
    //   return;
    // }

    // console.log(trimmedDate, weight);
    await addWeightToDb(trimmedDate, weight);
    //just to see the log
    await loadWeightsFromDb();
    onClose();
  };

  function trimDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) return null;

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  return (
    <View style={styles.localModalContainer}>
      <View style={styles.localModalContent}>
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChange}
          maximumDate={new Date()}
        />
        <WeightInput
          term={weight}
          placeholder={"Enter your weight"}
          handleChange={(text) => handleChange(text)}
        />
        {errorMessage ? (
          <Text style={{ color: "red" }}>{errorMessage}</Text>
        ) : null}
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
          onPress={() => {
            logWeight(onClose);
          }}
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
