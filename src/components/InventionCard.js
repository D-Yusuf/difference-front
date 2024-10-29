import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { BASE_URL } from "../api/index";
import { useNavigation } from "@react-navigation/native";
import NAVIGATION from "../navigations";
import Icon from "react-native-vector-icons/FontAwesome";

const InventionCard = ({ invention, compact }) => {
  const navigation = useNavigation();

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
      <View style={[styles.card, compact && styles.compactCard]}>
        <Image
          source={{ uri: imageUrl }}
          style={[styles.image, compact && styles.compactImage]}
          resizeMode="cover"
        />
        <View style={[styles.content, compact && styles.compactContent]}>
          <Text style={[styles.name, compact && styles.compactName]}>
            {invention.name}
          </Text>
          <Text
            style={[styles.description, compact && styles.compactDescription]}
            numberOfLines={compact ? 1 : 2}
          >
            {invention.description}
          </Text>
          <Text style={[styles.cost, compact && styles.compactCost]}>
            {invention.cost} KWD
          </Text>
          <View style={[styles.icons, compact && styles.compactIcons]}>
            <TouchableOpacity style={styles.likeButton}>
              <Icon name="heart" size={compact ? 16 : 24} color="#FF4D4D" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.thumbsUpButton}>
              <Icon name="thumbs-up" size={compact ? 16 : 24} color="#4D79FF" />
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
    marginHorizontal: 8,
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
  compactCard: {
    marginVertical: 4,
    marginHorizontal: 4,
  },
  image: {
    width: "100%",
    height: 180,
  },
  compactImage: {
    height: 90,
  },
  content: {
    padding: 16,
  },
  compactContent: {
    padding: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  compactName: {
    fontSize: 14,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  compactDescription: {
    fontSize: 12,
    marginBottom: 4,
    lineHeight: 16,
  },
  cost: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E7D32",
    marginBottom: 12,
  },
  compactCost: {
    fontSize: 13,
    marginBottom: 6,
  },
  icons: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
    marginTop: 4,
  },
  compactIcons: {
    paddingTop: 6,
    marginTop: 2,
  },
  likeButton: {
    padding: 8,
  },
  thumbsUpButton: {
    padding: 8,
  },
});

export default InventionCard;
