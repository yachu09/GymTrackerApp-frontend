import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Ionicons from "@expo/vector-icons/Ionicons";

const SIZE = 144;
const RADIUS = 54;
const STROKE = 7;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const RestTimer = ({ timeLeft, totalTime, onSkip }) => {
  const progress = timeLeft / totalTime;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  return (
    <TouchableOpacity
      onPress={onSkip}
      activeOpacity={0.7}
      style={styles.container}
    >
      <View style={styles.circleWrapper}>
        <Svg height={SIZE} width={SIZE} style={{ position: "absolute" }}>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth={STROKE}
            fill="none"
          />

          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="gray"
            strokeWidth={STROKE}
            fill="none"
            strokeDasharray={`${CIRCUMFERENCE}`}
            strokeDashoffset={`${strokeDashoffset}`}
            strokeLinecap="round"
          />
        </Svg>

        <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>

        <View style={styles.skipContainer}>
          <Ionicons name="play-skip-forward" size={20} color="gray" />
          <Text style={styles.skipText}>Skip</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  circleWrapper: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    fontSize: 34,
    color: "gray",
    fontWeight: "bold",
  },
  skipContainer: {
    position: "absolute",
    bottom: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  skipText: {
    color: "gray",
    fontWeight: "700",
    fontSize: 14,
  },
});

export default RestTimer;
