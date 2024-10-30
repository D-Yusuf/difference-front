import React from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import InventionCard from "./InventionCard";

const InventionList = ({ inventions, showInvestButton = true, showEditButton = true }) => {
  if (inventions?.length === 0 || !inventions) {
    return <Text>No inventions found.</Text>;
  }

  return (
  //   <FlatList
  //     data={inventions}
  //     renderItem={({ item }) => <InventionCard invention={item} />}
  //     keyExtractor={(item) => item._id.toString()}
  //     contentContainerStyle={styles.container}
  //   />
    
  // );
  <View>
    {inventions.map((invention) => (
      <InventionCard key={invention._id} invention={invention} showInvestButton={showInvestButton} showEditButton={showEditButton} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});

export default InventionList;
