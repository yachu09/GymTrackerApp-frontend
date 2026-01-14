import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TouchableHighlight,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import WeightInput from "./WeightInput";
import {
  addWeightToDb,
  loadWeightsFromDb,
  weightExistsForDate,
} from "../repos/weightRepository";
import AntDesign from "@expo/vector-icons/AntDesign";

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
    if (weight > 999) {
      setErrorMessage("Weight exceeds the limit");
      return;
    }

    //sprawdzenie czy istnieje data
    const exists = await weightExistsForDate(trimmedDate);
    if (exists) {
      setErrorMessage("Weight already logged for this day");
      console.log("jest juz taki dzien");
      return;
    }

    // console.log(trimmedDate, weight);
    await addWeightToDb(trimmedDate, weight);
    //just to see the log
    await loadWeightsFromDb();
    onClose();
  };

  function trimDate(dateInput) {
    const date = new Date(dateInput);
    if (isNaN(date)) return null;

    // Use local getters (getFullYear/getMonth/getDate) so the stored
    // YYYY-MM-DD corresponds to the user's local date and doesn't shift
    // because of UTC timezone offsets.
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  return (
    <View style={styles.localModalContainer}>
      <View style={styles.localModalContent}>
        <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={onClose}>
          <AntDesign
            name="close"
            size={24}
            color="black"
            style={{ marginTop: 10, marginRight: 10 }}
          />
        </TouchableOpacity>
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
            borderRadius: 15,
            borderColor: "black",
            backgroundColor: "#58b4e3",
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
    borderRadius: 15,
    marginHorizontal: 40,
    marginVertical: 140,
    alignItems: "center",
    zIndex: 20,
  },
  localModalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
  },
});

export default WeightLoggingModal;
