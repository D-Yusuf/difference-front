import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getAllInventions } from "../../api/invention";
import InventionList from "../../components/InventionList";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: inventions, isPending: inventionsPending } = useQuery({
    queryKey: ["inventions"],
    queryFn: getAllInventions,
  });

  // Filter inventions based on the search term
  const filteredInventions = inventions?.filter((invention) =>
    invention.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (inventionsPending) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="🔍 Search"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <ScrollView vertical>
        {filteredInventions.length > 0 ? (
          <InventionList inventions={filteredInventions} />
        ) : (
          <Text style={{ fontSize: 16 }}>No inventions found.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  searchInput: {
    fontSize: 16,
    color: "#888",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
    width: "100%",
  },
});

export default Home;
