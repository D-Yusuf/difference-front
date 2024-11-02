import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import Carousel from "react-native-reanimated-carousel";
import { Dimensions } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getInvention } from "../api/invention";
import { useQuery } from "@tanstack/react-query";
import { TouchableOpacity } from "react-native";
import { getProfile } from "../api/profile"; // Import the getProfile function
import UserContext from "../context/UserContext";
import { BASE_URL } from "../api";
import NAVIGATION from "../navigations";
import { getCategory } from "../api/category"; // You'll need to create this API function
import { colors } from "../../Colors";
const PHASES = ["idea", "work-in-progress", "prototype", "market-ready"];

const normalizePhase = (phase) => {
  const phaseMap = {
    testing: "prototype", // Map 'testing' to 'prototype' phase
    // Add other mappings if needed
  };
  return phaseMap[phase] || phase;
};

const getPhaseProgress = (currentPhase) => {
  const normalizedPhase = normalizePhase(currentPhase);
  const index = PHASES.indexOf(normalizedPhase);
  if (index === -1) return 0;
  return ((index + 1) / PHASES.length) * 100;
};

const InventionDetails = ({ route }) => {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);

  const [user, setUser] = useContext(UserContext);
  const { inventionId, image, showInvestButton, showEditButton } = route.params;

  const [isLiked, setIsLiked] = useState(false);
  console.log("Image URI:", image); // Add this to debug

  console.log("Received inventionId:", inventionId);

  const { data: invention, isPending: inventionPending } = useQuery({
    queryKey: ["invention", inventionId],

    queryFn: () => getInvention(inventionId),
  });
  const formatPhase = (phase) => {
    return phase
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  console.log("Invention ID:", inventionId);
  console.log("Invention pending:", inventionPending);
  console.log("Raw invention data:", invention);
  console.log("Current phase:", invention?.phase);

  const { data: category, isPending: categoryPending } = useQuery({
    queryKey: ["category", invention?.category],
    queryFn: () => getCategory(invention?.category),
    enabled: !!invention?.category,
  });

  console.log("Category data:", category);

  if (inventionPending || categoryPending) {
    return <Text>Loading...</Text>;
  }

  if (!invention) {
    console.log("No invention data available");
    return <Text>No invention data available</Text>;
  }

  console.log("Rendering with invention:", {
    id: invention._id,
    name: invention.name,
    phase: invention.phase,
  });

  // We will check if the user is the inventor or admin appear the edit button for him.
  const isOwner =
    invention.inventors.find((inventor) => inventor._id === user._id) ||
    user.role === "admin";

  // Update the phase display to look nicer (capitalize first letter)
  const canInvest = user.role === "investor" || user.role === "admin";

  const width = Dimensions.get("window").width;
  console.log("IMAGES", invention?.images);
  const FAKEIMAGES = [
    "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    "https://img.freepik.com/premium-photo/chameleon-with-red-spot-its-head_924629-217761.jpg",
    "https://img.freepik.com/premium-photo/frog-with-symbol-its-face-is-rope_956363-21877.jpg?semt=ais_hybrid",
  ];
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={{ width: width }}>
          <Carousel
            width={width}
            height={300}
            autoPlay={false}
            data={FAKEIMAGES}
            scrollAnimationDuration={1000}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.carouselImage}
                resizeMode="cover"
              />
            )}
            onSnapToItem={(index) => setActiveIndex(index)}
          />
          <View style={styles.paginationContainer}>
            {FAKEIMAGES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  {
                    opacity: index === activeIndex ? 1 : 0.4,
                    transform: [{ scale: index === activeIndex ? 1 : 0.6 }],
                  },
                ]}
              />
            ))}
          </View>
        </View>
        <Text style={styles.title}>{invention?.name}</Text>

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Category</Text>
            <Text style={styles.metaValue}>
              {category?.name || "Loading..."}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Phase</Text>
            <Text style={styles.metaValue}>
              {formatPhase(invention?.phase)}
            </Text>
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${getPhaseProgress(invention?.phase)}%` },
                ]}
              />
              <View style={styles.phaseMarkers}>
                {PHASES.map((phase, index) => (
                  <View
                    key={phase}
                    style={[
                      styles.phaseDot,
                      PHASES.indexOf(normalizePhase(invention?.phase)) >=
                        index && styles.phaseDotActive,
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.inventorContainer}>
          {invention?.inventors?.map((inventor) => {
            console.log("Inventor ID:", inventor._id); // Debug log
            return (
              <TouchableOpacity
                key={inventor._id}
                style={styles.inventorRow}
                onPress={() => {
                  console.log("Navigating to profile with ID:", inventor._id); // Debug log
                  navigation.navigate(NAVIGATION.PROFILE.INDEX, {
                    screen: NAVIGATION.PROFILE.USER_PROFILE,
                    params: {
                      userId: inventor._id,
                    },
                  });
                }}
              >
                <Image
                  source={{ uri: BASE_URL + inventor.image }}
                  style={styles.inventorImage}
                />
                <Text style={styles.inventor}>
                  {inventor.firstName + " " + inventor.lastName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.description}>{invention?.description}</Text>
        <Text style={styles.cost}>Funds Needed: {invention?.cost} KWD</Text>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, isLiked && styles.actionButtonActive]}
            onPress={() => setIsLiked(!isLiked)}
          >
            <Text
              style={[
                styles.actionButtonText,
                isLiked && styles.actionButtonTextActive,
              ]}
            >
              {isLiked ? "Liked" : "Like"}
            </Text>
          </TouchableOpacity>
        </View>

        {showEditButton && isOwner && (
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate(NAVIGATION.INVENTION.EDIT_INVENTION, {
                invention,
              })
            }
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        )}

        {showInvestButton && canInvest && (
          <TouchableOpacity
            style={[styles.button, styles.investButton]}
            onPress={() =>
              navigation.navigate(NAVIGATION.HOME.INVEST_DETAILS, { invention })
            }
          >
            <Text style={styles.buttonText}>Invest</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default InventionDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.page,
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28, // Increased size
    fontWeight: "800", // Made font bolder
    marginBottom: 16,
    color: colors.primary,
    letterSpacing: 0.5, // Added letter spacing for better readability
  },
  inventorContainer: {
    marginBottom: 20,
    backgroundColor: "#f8f9fa", // Light background for inventor section
    padding: 12,
    borderRadius: 12,
  },
  inventorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  inventorImage: {
    width: 50, // Made avatar slightly larger
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2, // Added border to avatar
    borderColor: "#ffffff",
  },
  inventor: {
    fontSize: 18,
    color: "#2c3e50", // Softer color
    fontWeight: "600",
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: colors.primary,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  cost: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary, // Changed to a more modern blue
    padding: 12,
    alignSelf: "flex-start", // Makes the container fit the content
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  investButton: {
    backgroundColor: "#16a34a",
    marginTop: 12,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2563eb",
  },
  actionButtonActive: {
    backgroundColor: "#2563eb",
  },
  actionButtonText: {
    color: "#2563eb",
    fontSize: 16,
    fontWeight: "600",
  },
  actionButtonTextActive: {
    color: "#ffffff",
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 12,
  },
  metaItem: {
    flex: 1,
    backgroundColor: colors.secondary,

    padding: 12,
    borderRadius: 10,
  },
  metaLabel: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  progressContainer: {
    marginTop: 8,
    height: 24,
    position: "relative",
    backgroundColor: colors.secondary,
    borderRadius: 5,
    width: "100%",
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
    position: "absolute",
    top: 10,
    left: 0,
    zIndex: 1,
  },
  phaseMarkers: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    width: "100%",
    height: "100%",
    paddingHorizontal: 4,
    alignItems: "center",
    zIndex: 2,
  },
  phaseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  phaseDotActive: {
    backgroundColor: "#2563eb",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: colors.primary,
  },
});
