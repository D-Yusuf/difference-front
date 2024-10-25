import { View, Text } from "react-native";
import React from "react";
import { getCategories } from "../api/categories";
import { useQuery } from "@tanstack/react-query";

const CategoryList = () => {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      {categories.map((category) => (
        <CategoryCard
          key={category._id}
          name={category.name}
          _id={category._id}
        />
      ))}
    </View>
  );
};

export default CategoryList;
