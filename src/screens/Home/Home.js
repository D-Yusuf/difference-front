import React, { useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { logout } from "../../api/auth";
import CategoryList from "../../components/CategoryList";
import UserContext from "../../context/UserContext";

const Home = () => {
  const [user, setUser] = useContext(UserContext);
  return (
    <View style={styles.container}>
      <Text>Choose A Category</Text>
      <CategoryList />
      <Button
        title="Logout"
        onPress={() => {
          logout();
          setUser(false);
        }}
      />
      <Text style={styles.title}>Welcome Home</Text>
      <Text style={styles.subtitle}>This is a simple home page</Text>
    </View>
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
