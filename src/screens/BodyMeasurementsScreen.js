import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { LinearGradient } from "expo-linear-gradient";

const BodyMeasurementsScreen = () => {
  const data = [
    { value: 70, dataPointText: "70" },
    { value: 70.6, dataPointText: "70.6" },
    { value: 71, dataPointText: "71" },
    { value: 70.9, dataPointText: "70.9" },
    { value: 71.4, dataPointText: "71.4" },
    { value: 72.1, dataPointText: "72.1" },
    { value: 71.7, dataPointText: "71.7" },
  ];

  return (
    <LinearGradient style={{ flex: 1 }} colors={["#FFFFFF", "lightblue"]}>
      <Text>Body Measurements</Text>
      <View style={styles.chartContainer}>
        <LineChart
          data={data}
          dataPointsColor={"blue"}
          color={"lightblue"}
          thickness={3}
          curved
          isAnimated
          yAxisThickness={0}
          xAxisThickness={0}
          hideYAxisText
          // startFromZero={false}
          textColor1="blue"
          textShiftY={-8}
          textShiftX={-3}
          textFontSize={12}
          hideRules
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    marginTop: 50,
    marginHorizontal: 15,
  },
});

export default BodyMeasurementsScreen;
