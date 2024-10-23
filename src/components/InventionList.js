import React from "react";
import { StyleSheet, FlatList, View } from "react-native";
import InventionCard from "./InventionCard";
import { BASE_URL } from "../api/index";

const InventionList = ({ inventions }) => {
  const renderItem = ({ item }) => <InventionCard invention={item} />;

  return (
    <FlatList
      data={inventions}
      renderItem={renderItem}
      keyExtractor={(item) => item._id.toString()}
      contentContainerStyle={styles.container}
    />
  );
};

export default InventionList;

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});
