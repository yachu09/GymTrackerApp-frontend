import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { LinearGradient } from "expo-linear-gradient";
import StandardButton from "../components/StandardButton";
import { weightData } from "../data/dummyData/weightData";

const BodyMeasurementsScreen = () => {
  const Period = {
    WEEK: "week",
    MONTH: "month",
    YEAR: "year",
  };
  const [period, setPeriod] = useState(Period.WEEK);

  const prepareWeightDataForGraph = (data) => {
    return data.map((item) => ({
      value: item.value,
      date: item.date, // zachowujemy oryginalną datę
      dataPointText: item.value.toString(), // do wyświetlenia przy punkcie
      label: item.date, // opcjonalnie, jeśli chcesz pokazać datę na osi X
    }));
  };

  const weightDataToGraph = prepareWeightDataForGraph(weightData);
  // console.log(JSON.stringify(weightDataToGraph, null, 2));

  const transformDataBasedOnPeriod = (data) => {
    return;
  };

  const calcAvgBasedOnPeriod = () => {};
  const calcMinBasedOnPeriod = () => {};
  const calcMaxBasedOnPeriod = () => {};

  return (
    <LinearGradient style={{ flex: 1 }} colors={["#FFFFFF", "lightblue"]}>
      <StandardButton text="Log your today's weight" />
      <View style={styles.buttonsRow}>
        <StandardButton
          text="Week"
          onPress={() => {
            setPeriod(Period.WEEK);
          }}
        />
        <StandardButton
          text="Month"
          onPress={() => {
            setPeriod(Period.MONTH);
          }}
        />
        <StandardButton
          text="Year"
          onPress={() => {
            setPeriod(Period.YEAR);
          }}
        />
      </View>
      <View style={styles.chartContainer}>
        <LineChart
          data={weightDataToGraph}
          dataPointsColor={"blue"}
          color={"lightblue"}
          thickness={3}
          curved
          isAnimated
          yAxisThickness={0}
          xAxisThickness={0}
          // hideYAxisText
          textColor1="blue"
          textShiftY={-8}
          textShiftX={-3}
          textFontSize={12}
          hideRules
          xAxisLabelTextStyle={{ fontSize: 8 }}
          // startFromZero={false}
          //chwilowo na sztywno
          fromZero={false}
          yAxisLabelTexts={[
            "60",
            "62",
            "64",
            "66",
            "68",
            "70",
            "72",
            "74",
            "76",
            "78",
            "80",
          ]}
        />
      </View>
      <View style={styles.weigthStatsView}>
        <Text style={styles.weightStatsText}>
          Your average weight from this {period} is ?
        </Text>
        <Text style={styles.weightStatsText}>Highest body weight: </Text>
        <Text style={styles.weightStatsText}>Lowest body weight: </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    marginTop: 70,
    marginHorizontal: 15,
  },
  buttonsRow: { flexDirection: "row", justifyContent: "space-evenly" },
  weigthStatsView: {
    alignItems: "center",
    marginTop: 20,
  },
  weightStatsText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default BodyMeasurementsScreen;
