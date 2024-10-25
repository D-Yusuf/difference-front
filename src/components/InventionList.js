import React from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import InventionCard from "./InventionCard";
import { BASE_URL } from "../api/index";

const InventionList = ({ profile }) => {
  console.log("InventionList props:", { profile });

  if (!profile) {
    return <Text>Loading profile...</Text>;
  }

  const userInventions = profile.inventions || [];

  console.log("User inventions:", userInventions);

  if (userInventions.length === 0) {
    return <Text>No inventions found for this user.</Text>;
  }

  const renderItem = ({ item }) => <InventionCard invention={item} />;

  return (
    // <FlatList

    //   data={userInventions}
    //   renderItem={renderItem}
    //   keyExtractor={(item) => item._id.toString()}
    //   contentContainerStyle={styles.container}
    // />

    <View>
      {userInventions.map((invention) => (
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
