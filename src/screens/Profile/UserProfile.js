import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import React from "react";
import { getProfileById } from "../../api/profile";
import { useQuery, useQueries } from "@tanstack/react-query";
import { BASE_URL } from "../../api";
import InventionList from "../../components/InventionList";
import { getInventionById } from "../../api/invention";

const UserProfile = ({ route }) => {
  const { userId } = route.params;

  const {
    data: userInfo,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => getProfileById(userId),
  });

  const inventionQueries = useQueries({
    queries: (userInfo?.inventions || []).map((inventionId) => ({
      queryKey: ["invention", inventionId],
      queryFn: async () => {
        try {
          console.log(`Fetching invention with ID: ${inventionId}`);
          const result = await getInventionById(inventionId);
          console.log(`Invention data received for ${inventionId}:`, result);
          return result;
        } catch (error) {
          console.error(`Error fetching invention ${inventionId}:`, error);
          throw error;
        }
      },
      enabled: !!userInfo?.inventions,
    })),
  });

  console.log(
    "Invention Queries Status:",
    inventionQueries.map((q) => ({
      isLoading: q.isLoading,
      isError: q.isError,
      error: q.error,
      data: q.data,
    }))
  );

  const isLoadingInventions = inventionQueries.some((query) => query.isLoading);
  const inventionsData = inventionQueries
    .filter((query) => query.data)
    .map((query) => query.data);

  console.log("Final inventionsData:", inventionsData);

  console.log("UserInfo:", userInfo); // Debug log
  console.log("Inventions:", userInfo?.inventions); // Add this debug log

  if (isLoadingProfile || isLoadingInventions) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (profileError || !userInfo) {
    return (
      <View style={styles.centerContainer}>
        <Text>Could not load profile. Please try again later.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri: userInfo?.image
              ? `${BASE_URL}${userInfo.image}`.replace(/\\/g, "/")
              : "https://via.placeholder.com/150",
          }}
          style={styles.avatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>
            {userInfo?.firstName || ""} {userInfo?.lastName || ""}
          </Text>
          <Text style={styles.role}>{userInfo?.role || "User"}</Text>
        </View>
      </View>

      {/* Bio Section */}
      {userInfo?.bio && (
        <View style={styles.section}>
          <View style={styles.backColor}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bio}>{userInfo.bio}</Text>
          </View>
        </View>
      )}

      {/* Contact Information */}
      <View style={styles.section}>
        <View style={styles.backColor}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoContainer}>
            {userInfo?.email && (
              <InfoItem label="Email" value={userInfo.email} />
            )}
            {userInfo?.phone && (
              <InfoItem label="Phone" value={userInfo.phone} />
            )}
            {userInfo?.location && (
              <InfoItem label="Location" value={userInfo.location} />
            )}
          </View>
        </View>
      </View>

      {/* Inventions Section */}
      {inventionsData.length > 0 && (
        <View style={styles.section}>
          <View>
            <Text style={styles.sectionTitle}>
              {userInfo?.firstName}'s Inventions
            </Text>
          </View>
          <View style={styles.inventionsContainer}>
            <InventionList inventions={inventionsData} />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const InfoItem = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value?.toString() || ""}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#88B3D4",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerInfo: {
    marginLeft: 15,
    flex: 1,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
  },
  backColor: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 20,
    padding: 10,
    display: "flex",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#88B3D4",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
  },

  infoItem: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  label: {
    fontWeight: "600",
    width: 100,
    color: "#666",
  },
  value: {
    flex: 1,
    color: "#333",
  },
  inventionsContainer: {
    marginTop: 10,
  },
});

export default UserProfile;
