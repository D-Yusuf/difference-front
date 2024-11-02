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
  ScrollView,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { getAllInventions } from "../../api/invention";
import InventionList from "../../components/InventionList";
import { ThemeContext } from "../../context/ThemeContext";
import { colors } from "../../../Colors";
import { getCategories } from "../../api/categories";
import FilterModal from "../../components/FilterModal";
const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [gridColumns, setGridColumns] = useState(2);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const { data: inventions, isPending: inventionsPending } = useQuery({
    queryKey: ["inventions"],
    queryFn: getAllInventions,
  });
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const { setBackgroundColor } = useContext(ThemeContext);

  useEffect(() => {
    setBackgroundColor("white"); // Set color when component mounts
  }, []);

  const filteredInventions = inventions
    ?.filter((invention) => {
      const matchesSearch = invention.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory
        ? invention.category === selectedCategory
        : true;
      const matchesPhase = selectedPhase
        ? invention.phase === selectedPhase
        : true;
      return matchesSearch && matchesCategory && matchesPhase;
    })
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "popular") {
        return (b.likes?.length || 0) - (a.likes?.length || 0);
      }
      return 0;
    });

  if (inventionsPending) {
    return <Text>Loading...</Text>;
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ADD8E6" />

      <FilterModal
        isVisible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedPhase={selectedPhase}
        setSelectedPhase={setSelectedPhase}
      />

      <View style={styles.innerContainer}>
        <View style={styles.headerSection}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={styles.headerTitle}>Discover</Text>
              <Text style={styles.headerSubtitle}>
                Find your next inspiration
              </Text>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                padding: 10,
                borderRadius: 8,
                marginBottom: 10,
                alignSelf: "flex-end",
              }}
              onPress={() => setFilterModalVisible(true)}
            >
              <Icon name="filter-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Icon name="search-outline" size={24} color={colors.primary} />
            <TextInput
              style={styles.searchInput}
              placeholder="What invention inspires you?"
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholderTextColor={colors.primary}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.page,
  },

  innerContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  headerSection: {
    // marginTop: 40,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 48,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.primary,
    marginTop: 8,
  },
  searchSection: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: colors.primary,
    paddingVertical: 8,
  },
  gridControls: {
    flexDirection: "row",
    gap: 15,
    alignSelf: "flex-end",
  },
  gridButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 15,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  activeGridButton: {
    backgroundColor: colors.primary,
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
