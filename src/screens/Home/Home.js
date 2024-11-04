import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import Icon from "react-native-vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { getAllInventions } from "../../api/invention";
import InventionList from "../../components/InventionList";
import { ThemeContext } from "../../context/ThemeContext";
import { colors } from "../../../Colors";
import UserContext from "../../context/UserContext";
import { getCategories } from "../../api/categories";
import FilterModal from "../../components/FilterModal";
import { getProfile } from "../../api/user";

const LoadingView = () => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section with adjusted padding */}
        <View style={[styles.headerSection, { paddingTop: 20 }]}>
          <Animated.View
            style={[
              styles.loadingBlock,
              styles.loadingHeaderTitle,
              animatedStyle,
            ]}
          />
          <Animated.View
            style={[
              styles.loadingBlock,
              styles.loadingHeaderSubtitle,
              animatedStyle,
            ]}
          />
        </View>

        {/* Search Section */}
        <View style={styles.stickySection}>
          <View style={styles.searchSection}>
            <Animated.View
              style={[
                styles.loadingBlock,
                styles.loadingSearchBar,
                animatedStyle,
              ]}
            />

            <View style={styles.gridControls}>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Animated.View
                  style={[
                    styles.loadingBlock,
                    styles.loadingGridButton,
                    animatedStyle,
                  ]}
                />
                <Animated.View
                  style={[
                    styles.loadingBlock,
                    styles.loadingGridButton,
                    animatedStyle,
                  ]}
                />
              </View>
              <Animated.View
                style={[
                  styles.loadingBlock,
                  styles.loadingFilterButton,
                  animatedStyle,
                ]}
              />
            </View>
          </View>
        </View>

        {/* Invention Cards */}
        <View style={styles.listContainer}>
          {[1, 2, 3].map((item) => (
            <Animated.View
              key={item}
              style={[
                styles.loadingBlock,
                styles.loadingSingleCard,
                animatedStyle,
              ]}
            >
              <Animated.View
                style={[
                  styles.loadingBlock,
                  styles.loadingSingleImage,
                  animatedStyle,
                ]}
              />
              <View style={styles.loadingSingleContent}>
                <Animated.View
                  style={[
                    styles.loadingBlock,
                    styles.loadingSingleTitle,
                    animatedStyle,
                  ]}
                />
                <Animated.View
                  style={[
                    styles.loadingBlock,
                    styles.loadingSingleDescription,
                    animatedStyle,
                  ]}
                />
                <View style={styles.loadingSingleMeta}>
                  <Animated.View
                    style={[
                      styles.loadingBlock,
                      { width: "30%", height: 16 },
                      animatedStyle,
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.loadingBlock,
                      { width: 50, height: 16 },
                      animatedStyle,
                    ]}
                  />
                </View>
              </View>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useContext(UserContext);
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
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
  const { setBackgroundColor } = useContext(ThemeContext);

  console.log("Full context value:", user);

  useEffect(() => {
    setBackgroundColor("white");
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
    return <LoadingView />;
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* Add decorative elements */}
      <View style={styles.topRightDots}>
        {[...Array(28)].map((_, index) => (
          <View key={`dot-tr-${index}`} style={styles.dot} />
        ))}
      </View>

      <View style={styles.bottomLeftDots}>
        {[...Array(28)].map((_, index) => (
          <View key={`dot-bl-${index}`} style={styles.dot} />
        ))}
      </View>

      <View style={styles.bottomRightCurves}>
        {[...Array(5)].map((_, index) => (
          <View
            key={`curve-${index}`}
            style={[
              styles.curve,
              {
                width: 150 + index * 30,
                height: 150 + index * 30,
                bottom: -75 - index * 15,
                right: -75 - index * 15,
              },
            ]}
          />
        ))}
      </View>

      {/* Existing content */}
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
        <ScrollView style={styles.scrollView} stickyHeaderIndices={[1]}>
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>
              Hello, {profile?.firstName || "there"}!
            </Text>
            <Text style={styles.headerSubtitle}>
              Find your next inspiration
            </Text>
          </View>

          <View style={styles.stickySection}>
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
                <View style={{ flexDirection: "row", gap: 10 }}>
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
          </View>

          <View style={styles.listContainer}>
            <InventionList
              inventions={filteredInventions}
              numColumns={gridColumns}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.page,
  },
  container: {
    flex: 1,
    backgroundColor: colors.page,
  },

  innerContainer: {
    flex: 1,
  },
  headerSection: {
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 28,
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
    justifyContent: "space-between",
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
  scrollView: {
    flex: 1,
  },

  stickySection: {
    backgroundColor: colors.page,
    paddingHorizontal: 20,
    zIndex: 1,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  loadingBlock: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
  },
  loadingHeaderTitle: {
    height: 28,
    width: "70%",
    marginBottom: 8,
  },
  loadingHeaderSubtitle: {
    height: 16,
    width: "50%",
    marginBottom: 20,
  },
  loadingSearchBar: {
    height: 50,
    width: "100%",
    marginBottom: 20,
  },
  loadingGridButton: {
    width: 50,
    height: 50,
    borderRadius: 15,
  },
  loadingFilterButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginBottom: 10,
  },
  loadingInventionCard: {
    height: 200,
    width: "100%",
    marginBottom: 16,
  },
  loadingSingleCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingSingleImage: {
    width: "100%",
    height: 250,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  loadingSingleContent: {
    padding: 16,
  },
  loadingSingleTitle: {
    height: 24,
    width: "80%",
    marginBottom: 8,
  },
  loadingSingleDescription: {
    height: 16,
    width: "100%",
    marginBottom: 12,
  },
  loadingSingleMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  topRightDots: {
    position: "absolute",
    top: 20,
    right: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    width: 100,
    gap: 8,
    opacity: 0.1,
    zIndex: 0,
  },
  bottomLeftDots: {
    position: "absolute",
    bottom: 20,
    left: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    width: 120,
    gap: 8,
    opacity: 0.1,
    zIndex: 0,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  bottomRightCurves: {
    position: "absolute",
    bottom: 0,
    right: 0,
    opacity: 0.05,
    zIndex: 0,
  },
  curve: {
    position: "absolute",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.primary,
  },
});

export default Home;
