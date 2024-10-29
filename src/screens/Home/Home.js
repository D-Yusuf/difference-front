import React, { useState, useContext, useEffect } from "react";
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
import { ThemeContext } from "../../context/ThemeContext";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [gridColumns, setGridColumns] = useState(2);
  const { data: inventions, isPending: inventionsPending } = useQuery({
    queryKey: ["inventions"],
    queryFn: getAllInventions,
  });
  const { setBackgroundColor } = useContext(ThemeContext);

  useEffect(() => {
    setBackgroundColor("#88B3D4"); // Set color when component mounts
  }, []);

  // Filter inventions based on the search term
  const filteredInventions = inventions?.filter((invention) =>
    invention.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (inventionsPending) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background Elements */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />

      <View style={styles.innerContainer}>
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Discover</Text>
          <Text style={styles.headerSubtitle}>Find your next inspiration</Text>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Icon name="search-outline" size={24} color="#fff" />
            <TextInput
              style={styles.searchInput}
              placeholder="What invention inspires you?"
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholderTextColor="rgba(255,255,255,0.7)"
            />
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
                color={gridColumns === 1 ? "#88B3D4" : "#fff"}
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
                color={gridColumns === 2 ? "#88B3D4" : "#fff"}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.listContainer}>
          <InventionList
            inventions={filteredInventions}
            numColumns={gridColumns}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#88B3D4",
  },
  bgCircle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    top: -50,
    right: -50,
  },
  bgCircle2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    top: 100,
    left: -100,
  },
  bgCircle3: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    bottom: -50,
    right: -50,
  },
  innerContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  headerSection: {
    marginTop: 40,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 48,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    marginTop: 8,
  },
  searchSection: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.3)",
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: "#ffffff",
    paddingVertical: 8,
  },
  gridControls: {
    flexDirection: "row",
    gap: 15,
    alignSelf: "flex-end",
  },
  gridButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 12,
    borderRadius: 15,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  activeGridButton: {
    backgroundColor: "#ffffff",
    transform: [{ scale: 1.1 }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  listContainer: {
    flex: 1,
  },
});

export default Home;
