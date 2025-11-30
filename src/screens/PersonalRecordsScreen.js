import React, { useContext, useEffect, useState } from "react";
import { View, FlatList, Text } from "react-native";
import usePersonalRecords from "../hooks/usePersonalRecords";
import PersonalRecordBox from "../components/PersonalRecordBox";
import SearchBar from "../components/SearchBar";
import { LinearGradient } from "expo-linear-gradient";

const PersonalRecordsScreen = () => {
  const [term, setTerm] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const personalRecords = usePersonalRecords();

  useEffect(() => {
    setFilteredRecords(personalRecords);
  }, [personalRecords]);

  const filterRecords = () => {
    if (!term.trim()) {
      setFilteredRecords(personalRecords);
    } else {
      setFilteredRecords(
        personalRecords.filter((record) =>
          record.exerciseName.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
  };

  return (
    <LinearGradient style={{ flex: 1 }} colors={["#FFFFFF", "lightblue"]}>
      <SearchBar
        term={term}
        onTermChange={(newTerm) => {
          setTerm(newTerm);
          filterRecords();
        }}
        onTermSubmit={filterRecords}
      />

      {filteredRecords.length === 0 ? (
        <Text style={{ alignSelf: "center", marginTop: 20 }}>
          No results found
        </Text>
      ) : (
        <FlatList
          data={filteredRecords}
          keyExtractor={(item) => item.exerciseName}
          renderItem={({ item }) => <PersonalRecordBox record={item} />}
        />
      )}
    </LinearGradient>
  );
};

export default PersonalRecordsScreen;
