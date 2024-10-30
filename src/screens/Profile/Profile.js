import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../api/profile";
import { BASE_URL } from "../../api";
import InventionList from "../../components/InventionList";
import UserContext from "../../context/UserContext";
import { logout } from "../../api/auth";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { colors } from "../../../Colors";

const Profile = ({ navigation }) => {
  const [user, setUser] = useContext(UserContext);
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const signOut = () => {
    logout();
    setUser(false);
  };

  if (profileLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.glassCard}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate("EditProfile", { profile })}
            >
              <Icon name="create-outline" size={24} color="#003863" />
            </TouchableOpacity>

            <Image
              source={profile?.image && { uri: BASE_URL + profile.image }}
              style={styles.profileImage}
            />

            <Text style={styles.name}>
              {profile?.firstName} {profile?.lastName}
            </Text>
            <Text style={styles.email}>{profile?.email}</Text>
            <Text style={styles.roleText}>{profile?.role}</Text>
            <Text style={styles.bio}>{profile?.bio}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.actionButton, styles.cvButton]}>
                <Icon name="document-text-outline" size={20} color="#003863" />
                <Text style={styles.buttonText}>View CV</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.addButton]}
                onPress={() => navigation.navigate("AddInvention")}
              >
                <Icon name="add-circle-outline" size={20} color="#003863" />
                <Text style={styles.buttonText}>Add Invention</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.inventionsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Inventions</Text>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => signOut()}
            >
              <MaterialIcons name="exit-to-app" size={24} color="red" />
            </TouchableOpacity>
          </View>
          <InventionList inventions={profile?.inventions} numColumns={2} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#88B3D4",
  },
  container: {
    flex: 1,
    backgroundColor: "#88B3D4",
  },
  headerContainer: {
    padding: 20,
    paddingTop: 10,
  },
  glassCard: {
    backgroundColor: "#ffffff",
    borderRadius: 25,
    padding: 20,
    alignItems: "center",
    shadowColor: "#003863",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  editButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 8,
    borderRadius: 20,
    shadowColor: "#003863",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#88B3D4",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 5,
  },
  roleText: {
    fontSize: 14,
    color: "#88B3D4",
    fontWeight: "600",
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: colors.primary,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    gap: 8,
    backgroundColor: "rgba(136, 179, 212, 0.1)",
  },
  buttonText: {
    color: "#003863",
    fontSize: 14,
    fontWeight: "600",
  },
  inventionsContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#003863",
  },
  logoutButton: {
    padding: 8,
  },
});

export default Profile;
