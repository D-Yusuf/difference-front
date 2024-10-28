import { StyleSheet, Text, View, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
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

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.title}>{invention?.name}</Text>
      <Text style={styles.inventor}>
        Inventor:{" "}
        {invention?.inventors
          ?.map((inventor) => inventor.firstName + " " + inventor.lastName)
          .join(", ")}
      </Text>
      <Text style={styles.description}>{invention.description}</Text>
      <Text style={styles.cost}>Funds Needed: {invention.cost} KWD</Text>
      {isOwner && (
        <TouchableOpacity style={styles.button}>
          <Text
            style={styles.buttonText}
            onPress={() => navigation.navigate("EditInvention", { invention })}
          >
            Edit
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InventionDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  inventor: {
    fontSize: 20,
    marginBottom: 6,
    color: "black",
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
    color: "black",
  },
  cost: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
  },
  button: {
    backgroundColor: "#007BFF", // Blue update button
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
