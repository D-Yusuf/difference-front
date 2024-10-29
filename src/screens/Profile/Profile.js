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
import { getProfile } from "../../api/profile";
import { getInventions } from "../../api/invention";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../api";
import InventionList from "../../components/InventionList";
import { useNavigation } from "@react-navigation/native";
import { logout } from "../../api/auth";
import { useContext } from "react";
import UserContext from "../../context/UserContext";
import Icon from "react-native-vector-icons/FontAwesome";
const Profile = () => {
  const navigation = useNavigation();
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    onSuccess: (data) => {
      console.log("found");
    },
  });
  const [user, setUser] = useContext(UserContext);

  console.log("Profile:", profile);
  // console.log("Inventions:", inventions);

  if (profileLoading) {
    return <Text>Loading...</Text>;
  }
  const signOut = () => {
    logout();
    setUser(false);
  };
  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      nestedScrollEnabled={true}
    >
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditProfile", { profile })} // Pass the user ID
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

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cvButton}>
            <Text style={styles.actionButtonText}>Go to CV</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addInventionButton}
            onPress={() => navigation.navigate("AddInvention")}
          >
            <MaterialIcons name="add" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => signOut()}
          >
            <MaterialIcons name="exit-to-app" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inventionsSection}>
        <Text style={styles.sectionTitle}>My Inventions</Text>
        <InventionList inventions={profile?.inventions} />
      </View>
    </ScrollView>
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
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 3,
    borderWidth: 2,
    borderColor: "gray",
    marginHorizontal: 20,
    position: "relative",
    marginTop: 20,
    shadowColor: "blue",
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
    backgroundColor: "skyblue",
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    marginTop: 10,
    alignItems: "center",
  },
  addInventionButton: {
    backgroundColor: "skyblue", // i used this green for add invention button, we can change it to any color we want.
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    width: "28%",
    marginTop: 10,
  },
  actionButtonText: {
    color: "black",
    fontSize: 15,
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
  logoutButton: {
    backgroundColor: "red", // i used this green for add invention button, we can change it to any color we want.
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    width: "28%",
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
});
