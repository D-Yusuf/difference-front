import React from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import InventionCard from "./InventionCard";
import { BASE_URL } from "../api/index";

const InventionList = ({ inventions }) => {
  if (inventions.length === 0 || !inventions) {
    return <Text>No inventions found.</Text>;
  }

  return (
    <FlatList
      data={inventions}
      renderItem={({ item }) => <InventionCard invention={item} />}
      keyExtractor={(item) => item._id.toString()}
    />
  );
};

export default InventionList;

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});
