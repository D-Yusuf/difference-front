import { View, Text } from "react-native";
import React from "react";
import { getCategories } from "../api/categories";
import { useQuery } from "@tanstack/react-query";
import { CategoryCard } from "./CategoryCard";

const CategoryList = ({categories}) => {
  


  return (
    <View>
      {categories.map((category) => (
        <CategoryCard
          key={category._id}
          category={category}
        />
      ))}
    </View>
  );
};

export default CategoryList;
