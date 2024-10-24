import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Import the icon library
import { getProfile } from "../api/profile";
import { getInventions } from "../api/invention";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../api";
import InventionList from "../components/InventionList";
import { useNavigation } from "@react-navigation/native";
const Profile = () => {
  const navigation = useNavigation();
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
  });

  const { data: inventions } = useQuery({
    queryKey: ["inventions"],
    queryFn: () => getInventions(),
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled={true}
      >
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate("EditProfile", { userId: profile._id })
            } // Pass the user ID
          >
            <MaterialIcons name="edit" size={24} color="black" />
          </TouchableOpacity>
          <Image
            source={profile?.image && { uri: BASE_URL + profile.image }}
            style={styles.image}
          />
          <Text style={styles.name}>
            {profile?.firstName} {profile?.lastName}
          </Text>
          <Text style={styles.email}>{profile?.email}</Text>
          <Text style={styles.roleText}>
            {`You signed up as `}
            <Text style={styles.role}>{profile?.role}</Text>
          </Text>
          <Text style={styles.bio}>{profile?.bio}</Text>

          <TouchableOpacity style={styles.cvButton}>
            <Text style={styles.actionButtonText}>Go to CV</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addInventionButton}
            onPress={() => navigation.navigate("AddInvention")}
          >
            <Text style={styles.actionButtonText}>Add Invention +</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inventionsSection}>
          <Text style={styles.sectionTitle}>My Inventions</Text>
          <InventionList inventions={inventions || []} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgray",
    paddingHorizontal: 20, // Add horizontal padding for white space
  },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: "gray",
    marginHorizontal: 20,
    position: "relative",
  },
  editButton: {
    position: "absolute", // Position the button absolutely
    top: 10, // Adjust top position
    right: 10, // Adjust right position
    padding: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: "gray",
    marginBottom: 5,
  },
  roleText: {
    fontSize: 14,
    color: "gray",
    marginBottom: 5,
  },
  role: {
    fontWeight: "bold",
    color: "black",
  },
  bio: {
    fontSize: 14,
    color: "black",
    marginBottom: 10,
  },
  cvButton: {
    backgroundColor: "lightgray",
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  addInventionButton: {
    backgroundColor: "lightgreen", // i used this green for add invention button, we can change it to any color we want.
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  actionButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  scrollContent: {
    flexGrow: 1,
  },
  inventionsSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
