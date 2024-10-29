import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { BASE_URL } from "../api/index";
import { useNavigation } from "@react-navigation/native";
import NAVIGATION from "../navigations";
import Icon from "react-native-vector-icons/FontAwesome";

const InventionCard = ({ invention }) => {
  const navigation = useNavigation();
  console.log("Invention data in card:", invention); // Debug log

  if (!invention || !invention._id) {
    return null;
  }

  const imageUrl = invention.images?.[0]
    ? `${BASE_URL}${invention.images[0]}`.replace(/\\/g, "/")
    : "https://via.placeholder.com/150";

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate(NAVIGATION.INVENTION.INVENTION_DETAILS, {
          inventionId: invention._id,
          image: imageUrl,
        })
      }
    >
      <View style={styles.card}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.content}>
          <Text style={styles.name}>{invention.name}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {invention.description}
          </Text>
          <Text style={styles.cost}>Funding needed: {invention.cost} KWD</Text>
          <View style={styles.icons}>
            <TouchableOpacity style={styles.likeButton}>
              <Icon name="heart" size={24} color="#FF4D4D" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.thumbsUpButton}>
              <Icon name="thumbs-up" size={24} color="#4D79FF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 180,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  cost: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E7D32",
    marginBottom: 12,
  },
  icons: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
    marginTop: 4,
  },
  likeButton: {
    padding: 8,
  },
  thumbsUpButton: {
    padding: 8,
  },
});

export default InventionCard;
