import React from "react";
import { View, StyleSheet, Text } from "react-native";
import OrderList from "../../components/OrderList";
import { getOrders } from "../../api/orders";
import { useQuery } from "@tanstack/react-query";

const Orders = ({ route }) => {
  const {
    data: allOrders,
    isPending,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });

  if (isPending) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading orders: {error.message}</Text>;

  const { inventions = [] } = route.params || {}; // Provide default empty array

  const orders =
    allOrders?.filter(
      (order) => order?.invention && inventions?.includes(order.invention._id)
    ) || [];

  return (
    <View style={styles.container}>
      {orders.length > 0 ? (
        <OrderList orders={orders} />
      ) : (
        <Text style={styles.noOrders}>No orders found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  noOrders: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});

export default Orders;
