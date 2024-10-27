import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import { getInvention } from "../api/invention";
import { useQuery } from "@tanstack/react-query";

const InventionDetails = () => {
  const route = useRoute();
  const { inventionId, image } = route.params;

  const { data: invention } = useQuery({
    queryKey: ["invention"],
    queryFn: () => getInvention(inventionId),
  });
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
      <Text style={styles.cost}>Funds Needed: {invention?.cost}</Text>
    </View>
  );
};

export default InventionDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  image: {
    width: "100%",
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  inventor: {
    fontSize: 18,
    marginBottom: 4,
  },
  year: {
    fontSize: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
  },
});
