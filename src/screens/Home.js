import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
<<<<<<< HEAD
import { logout } from "../api/auth";
import CategoryList from "../Components/CategoryList";
=======
import Register from "./Register";
>>>>>>> 79bdc2d54d35c0eb7987a8ae4e6259b7cd7abb75

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Choose A Category</Text>
      <CategoryList />
      <Text style={styles.title}>Welcome Home</Text>
      <Text style={styles.subtitle}>This is a simple home page</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
});

export default Home;
