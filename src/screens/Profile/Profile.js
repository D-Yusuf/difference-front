import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../api/profile";
import { BASE_URL } from "../../api";
import InventionList from "../../components/InventionList";
import UserContext from "../../context/UserContext";
import { logout } from "../../api/auth";
import { colors } from "../../../Colors";
import { getOrders } from "../../api/orders";
import NAVIGATION from "../../navigations";
import OrderList from "../../components/OrderList";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

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
          <View style={styles.navButtons}>
            <Animated.View
              style={[
                styles.loadingBlock,
                { width: 40, height: 40, borderRadius: 20 },
                animatedStyle,
              ]}
            />
            <Animated.View
              style={[
                styles.loadingBlock,
                { width: 40, height: 40, borderRadius: 20 },
                animatedStyle,
              ]}
            />
          </View>
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
          <View style={styles.buttonContainer}>
            <Animated.View
              style={[
                styles.loadingBlock,
                { width: "45%", height: 50, borderRadius: 10 },
                animatedStyle,
              ]}
            />
            <Animated.View
              style={[
                styles.loadingBlock,
                { width: "45%", height: 50, borderRadius: 10 },
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

const Profile = ({ navigation }) => {
  const [user, setUser] = useContext(UserContext);
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
  const { data: allOrders, isLoading: allOrdersLoading } = useQuery({
    queryKey: ["allOrders"],
    queryFn: getOrders,
  });

  const signOut = () => {
    logout();
    setUser(false);
  };

  if (profileLoading) {
    return <LoadingView />;
  }
  console.log(`${BASE_URL}${profile.cv}`);
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.glassCard}>
          <View style={styles.navButtons}>
            <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
              <Icon name="log-out-outline" size={25} color="red" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate("EditProfile", { profile })}
            >
              <Icon name="create-outline" size={25} color={colors.primary} />
            </TouchableOpacity>
          </View>
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

          <View
            style={[
              styles.buttonContainer,
              {
                flexWrap: "wrap",
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              },
            ]}
          >
            {(user.role === "inventor" || user.role === "admin") && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() =>
                  navigation.navigate(NAVIGATION.PROFILE.ORDERS, {
                    inventions: profile?.inventions.map(
                      (invention) => invention._id
                    ),
                  })
                }
              >
                <Icon name="document-text-outline" size={20} color="#003863" />
                <Text style={styles.buttonText}>Orders</Text>
              </TouchableOpacity>
            )}
            <View style={styles.buttonContainer}>
              {profile?.cv && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.cvButton]}
                  onPress={() => Linking.openURL(BASE_URL + profile.cv)}
                >
                  <Icon
                    name="document-text-outline"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.buttonText}>View CV</Text>
                </TouchableOpacity>
              )}
            </View>
            {user.role === "inventor" && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate("AddInvention")}
              >
                <Icon
                  name="add-circle-outline"
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.buttonText}>Add Invention</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {(user.role === "inventor" || user.role === "admin") && (
          <View style={styles.inventionsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Inventions</Text>
            </View>
            <InventionList inventions={profile?.inventions} numColumns={2} />
          </View>
        )}

        {user.role === "investor" && (
          <View>
            <View style={styles.investorHeader}>
              <Text style={styles.ordersTitle}>Number of Orders:</Text>
              <Text style={styles.ordersTitle}>
                {allOrders?.filter(
                  (order) => order?.investor?._id === profile?._id
                ).length || 0}
              </Text>
            </View>
            {allOrders && (
              <OrderList
                orders={allOrders.filter(
                  (order) => order?.investor?._id === profile?._id
                )}
                own={true}
              />
            )}
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
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  logoutButton: {
    padding: 8,
  },
  editButton: {
    padding: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "rgba(136, 179, 212, 0.1)",
    flex: 1,
    marginHorizontal: 5,
    gap: 7,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
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
  inventionsContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 2,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    marginLeft: 20,
    marginTop: 20,

    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
  },
  ordersTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
    marginLeft: 20,
  },
  investorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  loadingBlock: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
  },
});

export default Profile;
