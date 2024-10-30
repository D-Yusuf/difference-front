import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { getAllInventions } from "../../api/invention";
import InventionList from "../../components/InventionList";
const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [gridColumns, setGridColumns] = useState(2);
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.glassCard}>
            <Text style={styles.headerTitle}>Discover</Text>
            <View style={styles.searchContainer}>
              <Icon
                name="search-outline"
                size={20}
                color="#003863"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="What invention inspires you?"
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholderTextColor="rgba(0, 56, 99, 0.5)"
              />
            </View>
          </View>
          <View style={styles.gridControls}>
            <TouchableOpacity
              style={[
                styles.gridButton,
                gridColumns === 1 && styles.activeGridButton,
              ]}
              onPress={() => setGridColumns(1)}
            >
              <Icon
                name="reorder-four"
                size={24}
                color={gridColumns === 1 ? "#ffffff" : "#003863"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.gridButton,
                gridColumns === 2 && styles.activeGridButton,
              ]}
              onPress={() => setGridColumns(2)}
            >
              <Icon
                name="grid"
                size={24}
                color={gridColumns === 2 ? "#ffffff" : "#003863"}
              />
            </TouchableOpacity>
          </View>
        </View>
        <InventionList
          inventions={filteredInventions}
          numColumns={gridColumns}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#88B3D4",
  },
  container: {
    flex: 1,
    backgroundColor: "#88B3D4",
  },
  headerContainer: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: "transparent",
  },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 25,
    padding: 20,
    shadowColor: "#003863",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
    backdropFilter: "blur(10px)",
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: "800",
    color: "#003863",
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#003863",
  },
  gridControls: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginTop: 20,
    paddingHorizontal: 40,
  },
  gridButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 12,
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#003863",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  activeGridButton: {
    backgroundColor: "#003863",
    transform: [{ scale: 1.1 }],
  },
});

export default Home;
