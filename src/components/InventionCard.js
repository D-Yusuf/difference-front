import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { BASE_URL } from "../api/index";

const InventionCard = ({ invention }) => {
  console.log("inv", `${BASE_URL}${invention.images[0]?.replace(/\\/g, "/")}`);
  return (
    <View style={styles.card}>
      <Image
        source={{
          uri: `${BASE_URL}${invention.images[0]?.replace(/\\/g, "/")}`,
        }}
        style={styles.image}
        width={100}
        height={100}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.name}>{invention.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {invention.description}
        </Text>
        <Text style={styles.cost}>Funding needed: ${invention.cost}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  cost: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  shares: {
    fontSize: 14,
    color: "#444",
  },
});

export default InventionCard;
