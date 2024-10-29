import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import React, { useEffect, useState, useContext } from "react";

import { useNavigation, useRoute } from "@react-navigation/native";
import { getInvention } from "../api/invention";
import { useQuery } from "@tanstack/react-query";
import { TouchableOpacity } from "react-native";
import { getProfile } from "../api/profile"; // Import the getProfile function
import UserContext from "../context/UserContext";
import { BASE_URL } from "../api";
import NAVIGATION from "../navigations";
import { getCategory } from "../api/category"; // You'll need to create this API function

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
  const [user, setUser] = useContext(UserContext);
  const [isLiked, setIsLiked] = useState(false);
  const [isInterested, setIsInterested] = useState(false);

  const { inventionId, image } = route.params;
  console.log("Received inventionId:", inventionId);

  const { data: invention, isPending: inventionPending } = useQuery({
    queryKey: ["invention", inventionId],
    queryFn: async () => {
      try {
        console.log("Fetching invention with ID:", inventionId);
        const response = await getInvention(inventionId);
        console.log("Invention API response:", response);
        return response;
      } catch (error) {
        console.error("Error fetching invention:", error);
        throw error;
      }
    },
  });

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
  const canInvest = user.role === "investor" || user.role === "admin";

  // Update the phase display to look nicer (capitalize first letter)
  const formatPhase = (phase) => {
    return phase
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <Image source={{ uri: image }} style={styles.image} />
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
                  navigation.navigate(NAVIGATION.PROFILE.USER_PROFILE, {
                    userId: inventor._id,
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

          <TouchableOpacity
            style={[
              styles.actionButton,
              isInterested && styles.actionButtonActive,
            ]}
            onPress={() => setIsInterested(!isInterested)}
          >
            <Text
              style={[
                styles.actionButtonText,
                isInterested && styles.actionButtonTextActive,
              ]}
            >
              {isInterested ? "Interested" : "Interest"}
            </Text>
          </TouchableOpacity>
        </View>

        {isOwner && (
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

        {canInvest && (
          <TouchableOpacity
            style={[styles.button, styles.investButton]}
            onPress={() => navigation.navigate("Invest")}
          >
            <Text style={styles.buttonText}>Invest</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default InventionDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // Changed to pure white for cleaner look
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 30, // Added extra padding at bottom for better scroll experience
  },
  image: {
    width: "100%",
    height: 300, // Made image taller
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000", // Added shadow to image
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
    color: "#1a1a1a",
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
    color: "#4a4a4a", // Softer color for better readability
    lineHeight: 24, // Added line height for better readability
    letterSpacing: 0.3,
  },
  cost: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2563eb", // Changed to a more modern blue
    backgroundColor: "#eff6ff", // Light blue background
    padding: 12,
    borderRadius: 10,
    alignSelf: "flex-start", // Makes the container fit the content
  },
  button: {
    backgroundColor: "#2563eb", // Matching blue
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    shadowColor: "#000", // Added shadow to button
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
    backgroundColor: "#16a34a", // Green color for invest button
    marginTop: 12, // Smaller margin since it follows another button
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
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 10,
  },
  metaLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  progressContainer: {
    marginTop: 8,
    height: 24,
    position: "relative",
    backgroundColor: "#f0f0f0",
    borderRadius: 2,
    width: "100%",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#2563eb",
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
    backgroundColor: "#e5e7eb",
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
    backgroundColor: "#2563eb", // Make sure this color is visibly different
  },
});
