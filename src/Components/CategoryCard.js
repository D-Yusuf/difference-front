import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CategoryCard = ({ name, _id }) => {
  return (
    <View>
      <Text>{name}</Text>
    </View>
  );
};

export default CategoryCard;
