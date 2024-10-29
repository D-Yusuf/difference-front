import React from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import InventionCard from "./InventionCard";

const InventionList = ({ inventions }) => {
  if (!inventions || !Array.isArray(inventions)) {
    return <Text>No inventions found.</Text>;
  }

  const validInventions = inventions.filter((invention) => invention != null);

  return (
    <FlatList
      data={validInventions}
      renderItem={({ item }) => <InventionCard invention={item} />}
      keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});

export default InventionList;
