import React, { useState, useMemo } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { LinearGradient } from "expo-linear-gradient";
import { useWeightData } from "../hooks/useWeightData";
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

  // dostępne okresy
  const PERIOD = { WEEK: "week", MONTH: "month", YEAR: "year" };
  const [period, setPeriod] = useState(PERIOD.WEEK);

  const { weightData, loading, reload } = useWeightData();

  // dane bazowe z parsowaniem daty
  const baseData = useMemo(() => {
    return (weightData || []).map((item) => {
      let date;

      if (typeof item.date === "string") {
        const parts = item.date.split("-").map(Number);
        const [year, month, day] = parts;
        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
          date = new Date(year, month - 1, day);
        } else {
          date = new Date(item.date);
        }
      } else if (item.date instanceof Date) {
        date = item.date;
      } else {
        date = new Date(item.date);
      }

      return {
        value: item.value,
        date,
      };
    });
  }, [weightData]);

  // ostatnie 7 dni
  const getWeekData = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);

    return baseData
      .filter(({ date }) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d >= weekAgo && d <= today;
      })
      .sort((a, b) => a.date - b.date)
      .map(({ value, date }) => ({
        value,
        label: WEEKDAY[date.getDay()],
      }));
  };

  //średnia waga kazdego miesiąca
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

  // srednia waga każdego roku
  const getYearAverages = () => {
    const groups = {};

    baseData.forEach(({ value, date }) => {
      const year = date.getFullYear();
      if (!groups[year]) groups[year] = [];
      groups[year].push(value);
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

  // dane zależne od wybranego okresu
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

  // statystyki
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

  // zakres osi Y
  const vals = filtered.map((d) => d.value);
  const minVal = vals.length ? Math.min(...vals) : 0;
  const maxVal = vals.length ? Math.max(...vals) : minVal + 5;

  const padding = Math.max(1, Math.round((maxVal - minVal) * 0.1));
  let yMin = Math.floor(minVal - padding);
  let yMax = Math.ceil(maxVal + padding);
  if (yMin === yMax) yMax = yMin + 1;

  const yLabels = [];
  const steps = 5;
  const step = Math.ceil((yMax - yMin) / steps);
  for (let v = yMin; v <= yMax; v += step) yLabels.push(v.toString());
  if (Number(yLabels[yLabels.length - 1]) !== yMax)
    yLabels.push(yMax.toString());

  // Normalizacja danych
  const normalizedData = filtered.map((item) => ({
    ...item,
    value: item.value - yMin,
  }));

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const PeriodButton = ({ label, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient style={{ flex: 1 }} colors={["#ffffff", "lightblue"]}>
      <StandardButton
        text="Log your today's weight"
        onPress={() => setIsModalVisible(true)}
      />

      <View style={styles.periodRow}>
        <PeriodButton label="Week" onPress={() => setPeriod(PERIOD.WEEK)} />
        <PeriodButton label="Month" onPress={() => setPeriod(PERIOD.MONTH)} />
        <PeriodButton label="Year" onPress={() => setPeriod(PERIOD.YEAR)} />
      </View>

      <View style={styles.chartContainer}>
        <LineChart
          data={normalizedData}
          curved
          thickness={3}
          isAnimated
          color="blue"
          dataPointsColor="blue"
          yAxisOffset={0}
          maxValue={yMax - yMin}
          yAxisLabelTexts={yLabels}
          noOfSections={yLabels.length - 1}
          spacing={60}
          height={250}
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
        <WeighLoggingModal
          onClose={() => {
            setIsModalVisible(false);
            reload();
          }}
        />
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
    backgroundColor: "#58b4e3",
    height: 50,
    width: 100,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default BodyMeasurementsScreen;
