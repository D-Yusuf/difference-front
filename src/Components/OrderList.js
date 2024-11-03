import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { getOrders, updateOrder } from "../api/orders";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../api";
import NAVIGATION from "../navigations";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../Colors";

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
                <Text style={styles.investorText}>
                  {order.investor?.firstName} {order.investor?.lastName}
                </Text>
              </View>
              <View style={styles.actionButtons}>
                {!own && order.status === "pending" ? (
                  <View style={styles.buttonGroup}>
                    <TouchableOpacity
                      onPress={() => handleStatusUpdate(order._id, "approved")}
                      style={[styles.actionButton, styles.approveButton]}
                    >
                      <Text style={styles.actionButtonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleStatusUpdate(order._id, "declined")}
                      style={[styles.actionButton, styles.declineButton]}
                    >
                      <Text style={styles.actionButtonText}>Reject</Text>
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
    marginVertical: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  inventionImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
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
    backgroundColor: "orange",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  approvedStatus: {
    backgroundColor: "green",
  },
  declinedStatus: {
    backgroundColor: "red",
  },
  pendingStatus: {
    backgroundColor: "orange",
  },
  details: {
    padding: 16,
  },
  detailText: {
    fontSize: 15,
    color: colors.primary,
    marginBottom: 8,
  },
  investorInfo: {
    borderTopWidth: 1,
    borderTopColor: colors.secondary,
    padding: 16,
    backgroundColor: colors.page,
  },
  investorProfile: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  investorText: {
    fontSize: 14,
    color: colors.primary,
    opacity: 0.8,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
    backgroundColor: colors.page,
    borderRadius: 12,
    marginVertical: 12,
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
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  actionButton: {
    width: 80,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  approveButton: {
    backgroundColor: "green",
  },
  declineButton: {
    backgroundColor: "red",
  },
  actionButtonText: {
    color: "white",
    fontSize: 14,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pendingButton: {
    backgroundColor: "red",
    width: "100%",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OrderList;
