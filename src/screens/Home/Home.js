import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  ScrollView,
} from "react-native";
import { logout } from "../../api/auth";
import CategoryList from "../../components/CategoryList";
import UserContext from "../../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { getAllInventions } from "../../api/invention";
import { getCategories } from "../../api/categories";
import { SafeAreaView } from "react-native-safe-area-context";
import InventionList from "../../components/InventionList";
import { getProfile } from "../../api/profile";

const Home = () => {
  const [user, setUser] = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: profile, isPending: profilePending } = useQuery({
    queryKey: ["home-profile"],

    queryFn: () => getProfile(),
    onSuccess: (data) => {
      alert("daaaaa");
      setUser({ ...user, _id: data._id, role: data.role });
      console.log("SET USER");
    },
    onError: (error) => {
      alert(error);
    },
  });
  const { data: inventions, isPending: inventionsPending } = useQuery({
    queryKey: ["inventions"],
    queryFn: getAllInventions,
  });
  const { data: categories, isPending: categoriesPending } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Filter inventions based on the search term
  const filteredInventions = inventions?.filter((invention) =>
    invention.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (inventionsPending) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingTop: 20,
          paddingHorizontal: 10,
          gap: 10,
        }}
      >
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Search"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <ScrollView horizontal>
          {categories ? (
            <CategoryList categories={categories} />
          ) : (
            <Text style={{ fontSize: 8 }}>Loading Categories...</Text>
          )}
        </ScrollView>

        {/* <Button
        title="Logout"
        onPress={() => {
          logout();
          setUser(false);
        }}
      /> */}

        <ScrollView vertical>
          {filteredInventions.length > 0 ? (
            <InventionList inventions={filteredInventions} />
          ) : (
            <Text style={{ fontSize: 16 }}>No inventions found.</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    fontSize: 16,
    color: "#888",
    marginRight: 10,
    backgroundColor: "#fff",
    padding: 10,
    paddingLeft: 20,
    borderRadius: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
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
