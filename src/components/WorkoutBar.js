import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import Feather from "@expo/vector-icons/Feather";

const WorkoutBar = ({ onDelete }) => {
  const [seconds, setSeconds] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (s) => {
    const hours = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;

    const pad = (num) => String(num).padStart(2, "0");
    return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
  };

  // const onSave = () => {};

  return (
    <TouchableOpacity
      onPress={() => {
        if (isModalVisible) {
          setIsModalVisible(false);
        } else {
        }
      }}
    >
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.timer}>{formatTime(seconds)}</Text>
            <Text>//Aktualne cwiczenie</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setIsModalVisible(true);
            }}
          >
            <Text style={styles.buttonText}>End Workout</Text>
          </TouchableOpacity>
          {isModalVisible && (
            <View style={styles.localModalContainer}>
              <View style={styles.localModalContent}>
                <TouchableOpacity>
                  <Feather name="save" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete()}>
                  <Feather name="trash-2" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

//FIXME fix styling to match JEFIT workout bar
const styles = StyleSheet.create({
  container: {
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    margin: 15,
    backgroundColor: "lightgray",
    height: 50,
    borderRadius: 25,
  },
  column: {
    flexDirection: "column",
    padding: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "lightblue",
    width: 100,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 12,
    paddingHorizontal: 10,
    alignSelf: "center",
  },
  timer: {
    fontSize: 10,
    color: "blue",
  },
  localModalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "flex-end",
    zIndex: 10,
  },
  localModalContent: {
    backgroundColor: "#ed4242",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    height: 50,
    borderRadius: 25,
    width: 100,
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default WorkoutBar;
