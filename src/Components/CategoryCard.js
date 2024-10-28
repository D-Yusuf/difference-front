import React from "react";
import { View, Text, StyleSheet } from "react-native";
export const CategoryCard = ({ category }) => {
  const { name, _id } = category;
  return (
    <View>
      <Text>{name}</Text>
    </View>
  );
};
