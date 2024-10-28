import React from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import InventionCard from "./InventionCard";
import { BASE_URL } from "../api/index";

const InventionList = ({ inventions }) => {
  if (inventions.length === 0 || !inventions) {
    return <Text>No inventions found.</Text>;
  }

  return (
    // <FlatList

    //   data={userInventions}
    //   renderItem={renderItem}
    //   keyExtractor={(item) => item._id.toString()}
    //   contentContainerStyle={styles.container}
    // />

    <View>
      {inventions.map((invention) => (
        <InventionCard key={invention._id} invention={invention} />
      ))}
    </View>
  );
};

export default InventionList;

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});
