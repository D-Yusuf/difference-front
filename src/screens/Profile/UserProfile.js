import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React from "react";
import { getProfileById } from "../../api/profile";
import { useQuery, useQueries } from "@tanstack/react-query";
import { BASE_URL } from "../../api";
import InventionList from "../../components/InventionList";
import { getInventionById } from "../../api/invention";
import { colors } from "../../../Colors";
import Icon from "react-native-vector-icons/Ionicons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

const LoadingView = () => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.glassCard}>
          <Animated.View
            style={[
              styles.loadingBlock,
              { width: 120, height: 120, borderRadius: 60, marginBottom: 15 },
              animatedStyle,
            ]}
          />

          <Animated.View
            style={[
              styles.loadingBlock,
              { width: "60%", height: 30, marginBottom: 5 },
              animatedStyle,
            ]}
          />

          <Animated.View
            style={[
              styles.loadingBlock,
              { width: "40%", height: 24, marginBottom: 5 },
              animatedStyle,
            ]}
          />

          <Animated.View
            style={[
              styles.loadingBlock,
              { width: "30%", height: 20, marginBottom: 10 },
              animatedStyle,
            ]}
          />

          <Animated.View
            style={[
              styles.loadingBlock,
              { width: "90%", height: 60, marginBottom: 20 },
              animatedStyle,
            ]}
          />

          <View style={styles.contactContainer}>
            <Animated.View
              style={[
                styles.loadingBlock,
                {
                  width: "100%",
                  height: 44,
                  borderRadius: 10,
                  marginBottom: 12,
                },
                animatedStyle,
              ]}
            />
            <Animated.View
              style={[
                styles.loadingBlock,
                { width: "100%", height: 44, borderRadius: 10 },
                animatedStyle,
              ]}
            />
          </View>
        </View>

        <View style={styles.inventionsContainer}>
          <View style={styles.sectionHeader}>
            <Animated.View
              style={[
                styles.loadingBlock,
                { width: "50%", height: 24, marginBottom: 20 },
                animatedStyle,
              ]}
            />
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {[1, 2, 3, 4].map((item) => (
              <Animated.View
                key={item}
                style={[
                  styles.loadingBlock,
                  { width: "48%", height: 200, borderRadius: 12 },
                  animatedStyle,
                ]}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const UserProfile = ({ route }) => {
  const { userId } = route.params;

  const { data: userInfo, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => getProfileById(userId),
  });

  const inventionQueries = useQueries({
    queries: (userInfo?.inventions || []).map((inventionId) => ({
      queryKey: ["invention", inventionId],
      queryFn: () => getInventionById(inventionId),
      enabled: !!userInfo?.inventions,
    })),
  });

  const isLoadingInventions = inventionQueries.some((query) => query.isLoading);
  const inventionsData = inventionQueries
    .filter((query) => query.data)
    .map((query) => query.data);

  if (isLoadingProfile || isLoadingInventions) {
    return <LoadingView />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.glassCard}>
          <Image
            source={{
              uri: userInfo?.image
                ? `${BASE_URL}${userInfo.image}`.replace(/\\/g, "/")
                : "https://via.placeholder.com/150",
            }}
            style={styles.profileImage}
          />

          <Text style={styles.name}>
            {userInfo?.firstName || ""} {userInfo?.lastName || ""}
          </Text>
          <Text style={styles.email}>{userInfo?.email}</Text>
          <Text style={styles.roleText}>{userInfo?.role || "User"}</Text>
          {userInfo?.bio && <Text style={styles.bio}>{userInfo.bio}</Text>}

          {/* Contact Information */}
          {(userInfo?.phone || userInfo?.location) && (
            <View style={styles.contactContainer}>
              {userInfo?.phone && (
                <View style={styles.contactItem}>
                  <Icon name="call-outline" size={20} color={colors.primary} />
                  <Text style={styles.contactText}>{userInfo.phone}</Text>
                </View>
              )}
              {userInfo?.location && (
                <View style={styles.contactItem}>
                  <Icon
                    name="location-outline"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.contactText}>{userInfo.location}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Inventions Section */}
        {inventionsData.length > 0 && (
          <View style={styles.inventionsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {userInfo?.firstName}'s Inventions
              </Text>
            </View>
            <InventionList inventions={inventionsData} numColumns={2} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.page,
  },
  container: {
    flex: 1,
    backgroundColor: colors.page,
    padding: 10,
  },
  glassCard: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 20,
    alignItems: "center",
    shadowColor: "#003863",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.primary,
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
  contactContainer: {
    width: "100%",
    gap: 12,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(136, 179, 212, 0.1)",
    padding: 12,
    borderRadius: 10,
  },
  contactText: {
    color: colors.primary,
    fontSize: 14,
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
    color: colors.primary,
  },
  loadingBlock: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
  },
});

export default UserProfile;
