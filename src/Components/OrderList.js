import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
} from "react-native";
import { getOrders, updateOrder } from "../api/orders";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../api";
import NAVIGATION from "../navigations";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../Colors";
import getTimeAgo from "../utils/getTimeAgo";

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
    <View style={styles.container}>
      {/* Filter Section Loading */}
      <View style={styles.filterContainer}>
        {["all", "pending", "approved", "declined"].map((_, index) => (
          <Animated.View
            key={`filter-${index}`}
            style={[
              styles.loadingBlock,
              {
                width: 80,
                height: 36,
                borderRadius: 20,
              },
              animatedStyle,
            ]}
          />
        ))}
      </View>

      {/* Order Cards Loading */}
      <ScrollView>
        {[1, 2, 3].map((index) => (
          <View key={`order-${index}`} style={styles.card}>
            <View style={styles.header}>
              <Animated.View
                style={[
                  styles.loadingBlock,
                  { width: 50, height: 50, borderRadius: 12 },
                  animatedStyle,
                ]}
              />
              <Animated.View
                style={[
                  styles.loadingBlock,
                  { width: "40%", height: 20, marginHorizontal: 12 },
                  animatedStyle,
                ]}
              />
              <Animated.View
                style={[
                  styles.loadingBlock,
                  { width: 80, height: 30, borderRadius: 8 },
                  animatedStyle,
                ]}
              />
            </View>

            <View style={styles.details}>
              <Animated.View
                style={[
                  styles.loadingBlock,
                  { width: "60%", height: 20, marginBottom: 8 },
                  animatedStyle,
                ]}
              />
              <Animated.View
                style={[
                  styles.loadingBlock,
                  { width: "70%", height: 20 },
                  animatedStyle,
                ]}
              />
            </View>

            <View style={styles.investorInfo}>
              <View style={styles.investorProfile}>
                <Animated.View
                  style={[
                    styles.loadingBlock,
                    { width: 40, height: 40, borderRadius: 20 },
                    animatedStyle,
                  ]}
                />
                <View style={styles.investorTextContainer}>
                  <Animated.View
                    style={[
                      styles.loadingBlock,
                      { width: "60%", height: 20 },
                      animatedStyle,
                    ]}
                  />
                </View>
                <Animated.View
                  style={[
                    styles.loadingBlock,
                    { width: 60, height: 16 },
                    animatedStyle,
                  ]}
                />
              </View>
              <View style={styles.buttonGroup}>
                <Animated.View
                  style={[
                    styles.loadingBlock,
                    { width: "48%", height: 45, borderRadius: 12 },
                    animatedStyle,
                  ]}
                />
                <Animated.View
                  style={[
                    styles.loadingBlock,
                    { width: "48%", height: 45, borderRadius: 12 },
                    animatedStyle,
                  ]}
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const OrderList = ({ orders, own = false }) => {
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  // Mutation for updating order status
  const { mutate: updateOrderStatus } = useMutation({
    mutationFn: ({ orderId, newStatus }) =>
      updateOrder(orderId, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders", "orders-profile"]);
    },
    onError: (error) => {
      console.error("Failed to update order status:", error);
    },
  });

  const filteredOrders = orders?.filter((order) =>
    statusFilter === "all" ? true : order.status === statusFilter
  );

  const handleStatusUpdate = (orderId, newStatus) => {
    updateOrderStatus({ orderId, newStatus });
  };

  // Add loading state check
  if (!orders) {
    return <LoadingView />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        {["all", "pending", "approved", "declined"].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              statusFilter === status && styles.activeFilter,
            ]}
            onPress={() => setStatusFilter(status)}
          >
            <Text
              style={[
                styles.filterText,
                statusFilter === status && styles.activeFilterText,
              ]}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView>
        {filteredOrders?.map((order) => (
          <View key={order._id} style={styles.card}>
            <View style={styles.header}>
              <Image
                source={{
                  uri: BASE_URL + order.invention?.images[0].replace("\\", "/"),
                }}
                style={styles.inventionImage}
              />
              <Text style={styles.title}>{order.invention?.name}</Text>

              <Text
                style={[
                  styles.status,
                  order.status === "approved" && styles.approvedStatus,
                  order.status === "declined" && styles.declinedStatus,
                  order.status === "pending" && styles.pendingStatus,
                ]}
              >
                {order.status}
              </Text>
            </View>

            <View style={styles.details}>
              <Text style={styles.detailText}>Amount: ${order.amount}</Text>
              <Text style={styles.detailText}>
                Ownership Percentage: %{order.percentage}
              </Text>
            </View>

            <View style={styles.investorInfo}>
              <View style={styles.investorProfile}>
                <Image
                  source={{ uri: BASE_URL + order.investor?.image }}
                  style={styles.profilePic}
                />
                <View style={styles.investorTextContainer}>
                  <Text style={styles.investorText}>
                    {order.investor?.firstName} {order.investor?.lastName}
                  </Text>
                </View>
                <Text style={styles.timeAgo}>
                  {getTimeAgo(order.createdAt)}
                </Text>
              </View>
              <View style={styles.actionButtons}>
                {!own && order.status === "pending" ? (
                  <View style={styles.buttonGroup}>
                    <TouchableOpacity
                      onPress={() => handleStatusUpdate(order._id, "declined")}
                      style={[styles.actionButton, styles.declineButton]}
                    >
                      <Text style={styles.actionButtonText}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleStatusUpdate(order._id, "approved")}
                      style={[styles.actionButton, styles.approveButton]}
                    >
                      <Text style={styles.actionButtonText}>Accept</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  !own && (
                    <TouchableOpacity
                      onPress={() => handleStatusUpdate(order._id, "pending")}
                      style={[styles.actionButton, styles.pendingButton]}
                    >
                      <Text style={styles.actionButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.page,
    padding: 10,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 13,
    width: "98%",
    alignSelf: "center",
    marginVertical: 12,
    padding: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  inventionImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    flex: 1,
  },
  status: {
    fontSize: 14,
    color: colors.page,
    textTransform: "capitalize",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: "hidden",
  },
  approvedStatus: {
    backgroundColor: "green",
    borderRadius: 10,
  },
  declinedStatus: {
    backgroundColor: "red",
    borderRadius: 10,
  },
  pendingStatus: {
    backgroundColor: "orange",
    borderRadius: 10,
  },

  details: {
    padding: 12,
    backgroundColor: colors.page,
    borderRadius: 12,
    gap: 8,
  },
  detailText: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: "500",
    marginBottom: 0,
  },
  investorInfo: {
    padding: 12,
    backgroundColor: colors.page,
    borderRadius: 12,
    gap: 12,
  },
  investorProfile: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  investorText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
    backgroundColor: colors.page,
    borderRadius: 12,
    marginVertical: 12,
    gap: 20,
    width: "100%",
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.secondary,
  },
  activeFilter: {
    backgroundColor: colors.primary,
  },
  filterText: {
    color: colors.page,
  },
  actionButtons: {
    marginTop: 0,
  },
  actionButton: {
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
  },
  approveButton: {
    backgroundColor: "#15803d",
    width: "48%",
  },
  declineButton: {
    backgroundColor: "#b91c1c",
    width: "48%",
  },
  actionButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    gap: 8,
  },
  pendingButton: {
    backgroundColor: "#b91c1c",
    width: "90%",
  },
  timeAgo: {
    fontSize: 12,
    color: colors.primary,
    opacity: 0.8,
    marginLeft: "auto",
  },
  investorTextContainer: {
    flex: 1,
  },
  loadingBlock: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
  },
});

export default OrderList;
