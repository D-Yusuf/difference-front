import React from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import InventionCard from "./InventionCard";

const InventionList = ({ inventions, numColumns, showInvestButton = true, showEditButton = true }) => {
  if (!inventions || !Array.isArray(inventions)) {
    return <Text style={styles.noInventions}>No inventions found.</Text>;
  }

  const validInventions = inventions.filter((invention) => invention != null);

  return (
    <FlatList
      data={inventions}
      renderItem={({ item }) => <InventionCard invention={item} />}
      keyExtractor={(item) => item._id.toString()}
      contentContainerStyle={styles.container}
    />
    
  );
  // <View>
  //   {inventions.map((invention) => (
  //     <InventionCard key={invention._id} invention={invention} showInvestButton={showInvestButton} showEditButton={showEditButton} />
  //     ))}
  //   </View>
  // );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  cardWrapper: {
    padding: 6, // Reduced padding for tighter grid
  },
  noInventions: {
    color: "#ffffff", // Changed to white for better visibility on blue background
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    fontWeight: "500",
  },
});

export default InventionList;
