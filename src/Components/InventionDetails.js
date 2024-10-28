
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";

import { useNavigation, useRoute } from "@react-navigation/native";
import { getInvention } from "../api/invention";
import { useQuery } from "@tanstack/react-query";
import { TouchableOpacity } from "react-native";
import { getProfile } from "../api/profile"; // Import the getProfile function
import UserContext from "../context/UserContext";

const InventionDetails = () => {
  const navigation = useNavigation();
  const [user, setUser] = useContext(UserContext);
  const route = useRoute();
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

  const conditionalEdit =
    userProfile?._id === invention?.inventors[0]?._id ||
    userProfile?.role === "admin";

  // Add this check alongside the existing conditionalEdit
  const canInvest =
    userProfile?.role === "investor" ||
    (userProfile?.role === "admin" &&
      userProfile?._id !== invention?.inventors[0]?._id); // Ensure inventor can't invest in their own invention

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <Image source={{ uri: image }} style={styles.image} />
        <Text style={styles.title}>{invention?.name}</Text>
        <View style={styles.inventorContainer}>
          {invention?.inventors?.map((inventor) => (
            <View key={inventor._id} style={styles.inventorRow}>
              <Image
                source={{ uri: inventor.image }}
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
        {conditionalEdit && (
          <TouchableOpacity
            style={styles.button}

            onPress={() => navigation.navigate("EditInvention", { invention })}
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
});
