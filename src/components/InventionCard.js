import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { BASE_URL } from "../api/index";
import { useNavigation } from "@react-navigation/native";
import NAVIGATION from "../navigations";
import Icon from "react-native-vector-icons/FontAwesome";
import { colors } from "../../Colors";
import Carousel from "react-native-reanimated-carousel";
import { Dimensions } from "react-native";
import { Pagination } from "react-native-reanimated-carousel";

const InventionCard = ({
  invention,
  compact,
  showInvestButton = true,
  showEditButton = true,
}) => {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const width = Dimensions.get("window").width - 16; // Account for margins

  if (!invention || !invention._id) {
    return null;
  }

  const images =
    invention.images?.length > 0
      ? invention.images.map((img) => `${BASE_URL}${img}`.replace(/\\/g, "/"))
      : ["https://via.placeholder.com/150"];

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate(NAVIGATION.INVENTION.INVENTION_DETAILS, {
          inventionId: invention._id,
          image: images[0],
          showInvestButton: showInvestButton,
          showEditButton: showEditButton,
        })
      }
    >
      <View style={[styles.card, compact && styles.compactCard]}>
        <Carousel
          // loop
          pagingEnabled={true}
          width={width}
          height={compact ? 90 : 180}
          data={images}
          scrollAnimationDuration={1000}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              style={[styles.image, compact && styles.compactImage]}
              resizeMode="cover"
            />
          )}
          onSnapToItem={(index) => setActiveIndex(index)}
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
    borderWidth: 1,
    borderColor: colors.primary,
    marginVertical: 8,
    marginHorizontal: 8,
    shadowColor: "#000",
    overflow: "hidden",
    height: 240,
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
    color: colors.primary,
    marginBottom: 8,
  },
  compactName: {
    fontSize: 14,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.primary,
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
    color: colors.primary,
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
  paginationContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 4,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 1,
    backgroundColor: colors.primary,
  },
});

export default InventionCard;
