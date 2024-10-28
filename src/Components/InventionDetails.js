import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getInvention } from "../api/invention";
import { useQuery } from "@tanstack/react-query";
import { TouchableOpacity } from "react-native";
import { getProfile } from "../api/profile"; // Import the getProfile function

const InventionDetails = () => {
  const navigation = useNavigation();

  const route = useRoute();
  const { inventionId, image } = route.params;

  const { data: invention } = useQuery({
    queryKey: ["invention"],
    queryFn: () => getInvention(inventionId),
  });

  const [userProfile, setUserProfile] = useState(null);
  console.log(`here is the user profile id ${userProfile?._id}`);

  useEffect(() => {
    const fetchProfile = async () => {
      const profileData = await getProfile();
      setUserProfile(profileData);
    };
    fetchProfile();
  }, []);

  // We will check if the user is the inventor or admin appear the edit button for him.
  const conditionalEdit =
    userProfile?._id === invention?.inventors[0]?._id ||
    userProfile?.role === "admin";
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
      <Text style={styles.description}>{invention?.description}</Text>
      <Text style={styles.cost}>Funds Needed: {invention?.cost} KWD</Text>
      {conditionalEdit && (
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
