import React, { useState, useMemo } from "react";
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

  const baseData = useMemo(
    () =>
      weightData.map((item) => ({
        value: item.value,
        date: item.date,
        label: item.date,
        dataPointText: item.value.toString(),
      })),
    []
  );

  const filteredData = useMemo(() => {
    if (!baseData.length) return [];

    if (period === Period.YEAR) return baseData;

    const days = period === Period.WEEK ? 7 : 30;
    const count = Math.min(days, baseData.length);
    return baseData.slice(-count);
  }, [period, baseData]);

  const { normalizedData, yAxisLabelTexts, noOfSections } = useMemo(() => {
    if (!filteredData.length) {
      return {
        normalizedData: [],
        yAxisLabelTexts: [],
        noOfSections: 0,
      };
    }

    const values = filteredData.map((d) => d.value);
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);

    const bottom = Math.floor(rawMin) - 1;
    const top = Math.ceil(rawMax) + 1;

    const normalizedData = filteredData.map((d) => ({
      ...d,
      value: d.value - bottom,
    }));

    const yAxisLabelTexts = [];
    for (let v = bottom; v <= top; v++) {
      yAxisLabelTexts.push(v.toString());
    }

    const noOfSections = Math.max(yAxisLabelTexts.length - 1, 1);

    return { normalizedData, yAxisLabelTexts, noOfSections };
  }, [filteredData]);

  return (
    <LinearGradient style={{ flex: 1 }} colors={["#FFFFFF", "lightblue"]}>
      <StandardButton text="Log your today's weight" />

      <View style={styles.buttonsRow}>
        <StandardButton text="Week" onPress={() => setPeriod(Period.WEEK)} />
        <StandardButton text="Month" onPress={() => setPeriod(Period.MONTH)} />
        <StandardButton text="Year" onPress={() => setPeriod(Period.YEAR)} />
      </View>

      <View style={styles.chartContainer}>
        <LineChart
          data={normalizedData}
          yAxisLabelTexts={yAxisLabelTexts}
          noOfSections={noOfSections}
          fromZero={true}
          curved
          isAnimated
          dataPointsColor="blue"
          color="lightblue"
          thickness={3}
          yAxisThickness={0}
          xAxisThickness={0}
          yAxisLabelTextStyle={{ fontSize: 10 }}
          xAxisLabelTextStyle={{ fontSize: 8 }}
          textColor1="blue"
          textShiftY={-8}
          textShiftX={-3}
          textFontSize={12}
        />
      </View>

      <View style={styles.weightStatsView}>
        <Text style={styles.weightStatsText}>
          Your average weight from this {period} is ? kgs
        </Text>
        <Text style={styles.weightStatsText}>
          Highest body weight this {period}: ? kgs
        </Text>
        <Text style={styles.weightStatsText}>
          Lowest body weight this {period}: ? kgs
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    marginTop: 50,
    marginHorizontal: 15,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  weightStatsView: {
    alignItems: "center",
    marginTop: 20,
  },
  weightStatsText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default BodyMeasurementsScreen;
