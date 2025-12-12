import React, { useState, useMemo } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { LinearGradient } from "expo-linear-gradient";
import { weightData } from "../data/dummyData/weightData";
import WeighLoggingModal from "../components/WeightLoggingModal";
import StandardButton from "../components/shared/StandardButton";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const BodyMeasurementsScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const PERIOD = {
    WEEK: "week",
    MONTH: "month",
    YEAR: "year",
  };

  const [period, setPeriod] = useState(PERIOD.WEEK);

  const baseData = useMemo(() => {
    return weightData.map((item) => ({
      value: item.value,
      date: new Date(item.date),
    }));
  }, []);

  const getWeekData = () => {
    return baseData.map(({ value, date }) => ({
      value,
      label: WEEKDAY[date.getDay()], // Mon, Tue, Wed...
    }));
  };

  const getMonthAverages = () => {
    const groups = {};

    baseData.forEach(({ value, date }) => {
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(value);
    });

    return Object.keys(groups)
      .sort()
      .map((key) => {
        const [year, month] = key.split("-").map(Number);
        const avg = groups[key].reduce((a, b) => a + b, 0) / groups[key].length;
        return {
          value: Number(avg.toFixed(1)),
          label: MONTH_NAMES[month],
        };
      });
  };

  const getYearAverages = () => {
    const groups = {};

    baseData.forEach(({ value, date }) => {
      const key = date.getFullYear();
      if (!groups[key]) groups[key] = [];
      groups[key].push(value);
    });

    return Object.keys(groups)
      .sort()
      .map((year) => {
        const avg =
          groups[year].reduce((a, b) => a + b, 0) / groups[year].length;
        return {
          value: Number(avg.toFixed(1)),
          label: year.toString(),
        };
      });
  };

  const filtered = useMemo(() => {
    switch (period) {
      case PERIOD.WEEK:
        return getWeekData();
      case PERIOD.MONTH:
        return getMonthAverages();
      case PERIOD.YEAR:
        return getYearAverages();
      default:
        return [];
    }
  }, [period, baseData]);

  const stats = useMemo(() => {
    if (!filtered.length) return { avg: 0, min: 0, max: 0 };

    const vals = filtered.map((d) => d.value);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;

    return {
      avg: avg.toFixed(1),
      min: Math.min(...vals).toFixed(1),
      max: Math.max(...vals).toFixed(1),
    };
  }, [filtered]);

  const avgWeight =
    filtered.reduce((a, b) => a + b.value, 0) / (filtered.length || 1);

  const yMin = Math.floor(avgWeight - 2);
  const yMax = Math.ceil(avgWeight + 2);

  const yLabels = [];
  for (let v = yMin; v <= yMax; v++) yLabels.push(v.toString());

  const normalizedData = filtered.map((item) => ({
    ...item,
    value: item.value - yMin,
  }));

  const PeriodButton = ({ label, active, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <LinearGradient
        start={{ x: 0, y: 0.5 }}
        end={{ x: 0, y: 1 }}
        // style={styles.button}
        style={{ flex: 1, justifyContent: "center", borderRadius: 25 }}
        colors={["lightblue", "#58b4e3ff"]}
      >
        <Text style={styles.buttonText}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient style={{ flex: 1 }} colors={["#ffffff", "lightblue"]}>
      <StandardButton
        text="Log your today's weight"
        onPress={() => setIsModalVisible(true)}
      />

      <View style={styles.periodRow}>
        <PeriodButton
          label="Week"
          active={period === PERIOD.WEEK}
          onPress={() => setPeriod(PERIOD.WEEK)}
        />
        <PeriodButton
          label="Month"
          active={period === PERIOD.MONTH}
          onPress={() => setPeriod(PERIOD.MONTH)}
        />
        <PeriodButton
          label="Year"
          active={period === PERIOD.YEAR}
          onPress={() => setPeriod(PERIOD.YEAR)}
        />
      </View>

      <View style={styles.chartContainer}>
        <LineChart
          data={normalizedData}
          curved
          thickness={3}
          isAnimated
          color="blue"
          dataPointsColor="blue"
          startFillColor="rgba(0, 70, 255, 0.25)"
          endFillColor="rgba(0, 70, 255, 0.05)"
          yAxisOffset={0}
          maxValue={yMax - yMin}
          yAxisLabelTexts={yLabels}
          noOfSections={yLabels.length - 1}
          spacing={60}
          height={250}
          xAxisLabelTextStyle={{ fontSize: 10, color: "#222" }}
          yAxisTextStyle={{ fontSize: 12, color: "#222" }}
          scrollable
          scrollToEnd
          scrollAnimation
        />
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Average ({period}): {stats.avg} kg
        </Text>
        <Text style={styles.statsText}>Highest: {stats.max} kg</Text>
        <Text style={styles.statsText}>Lowest: {stats.min} kg</Text>
      </View>

      {isModalVisible && (
        <WeighLoggingModal onClose={() => setIsModalVisible(false)} />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  periodRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  chartContainer: {
    marginTop: 40,
    marginHorizontal: 20,
  },

  statsContainer: {
    marginTop: 25,
    alignItems: "center",
  },
  statsText: {
    fontWeight: "bold",
    fontSize: 16,
    marginVertical: 4,
  },

  button: {
    backgroundColor: "lightblue",
    height: 50,
    width: 100,
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    borderRadius: 25,
    flexDirection: "row",
    marginHorizontal: 15,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    color: "black",
  },
});

export default BodyMeasurementsScreen;
