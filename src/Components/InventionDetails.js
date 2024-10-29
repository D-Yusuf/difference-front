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

const InventionDetails = ({route}) => {
  const navigation = useNavigation();
  const [user, setUser] = useContext(UserContext);
  
  const { inventionId, image } = route.params;
  console.log("Image URI:", image); // Add this to debug
  const { data: invention, isPending: inventionPending } = useQuery({
    queryKey: ["invention"],
    queryFn: () => getInvention(inventionId),
  });
  if (inventionPending) {
    return <Text>Loading...</Text>;
  }

  // We will check if the user is the inventor or admin appear the edit button for him.
  const isOwner =
    invention.inventors.find((inventor) => inventor._id === user._id) ||
    user.role === "admin";
  const canInvest = user.role === "investor" || user.role === "admin";

  // Add these state variables after other useState declarations
  const [isLiked, setIsLiked] = useState(false);
  const [isInterested, setIsInterested] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <Image source={{ uri: image }} style={styles.image} />
        <Text style={styles.title}>{invention?.name}</Text>
        <View style={styles.inventorContainer}>
          {invention?.inventors?.map((inventor) => (
            <View key={inventor._id} style={styles.inventorRow}>
              <Image
                source={{ uri: BASE_URL + inventor.image }}
                style={styles.inventorImage}
              />
              <Text style={styles.inventor}>
                {inventor.firstName + " " + inventor.lastName}
              </Text>
            </View>
          ))}
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
              navigation.navigate(NAVIGATION.INVENTION.EDIT_INVENTION, {invention})
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
});
