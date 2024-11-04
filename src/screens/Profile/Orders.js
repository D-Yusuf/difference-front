import React, { useEffect } from "react";
import { View, StyleSheet, Text, SafeAreaView, ScrollView } from "react-native";
import OrderList from "../../components/OrderList";
import { getOrders } from "../../api/orders";
import { useQuery } from "@tanstack/react-query";
import { colors } from "../../../Colors";
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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {[1, 2, 3].map((item) => (
          <Animated.View
            key={item}
            style={[styles.loadingOrderCard, animatedStyle]}
          >
            <View style={styles.loadingOrderContent}>
              <Animated.View
                style={[
                  styles.loadingBlock,
                  { width: "60%", height: 24, marginBottom: 8 },
                  animatedStyle,
                ]}
              />
              <Animated.View
                style={[
                  styles.loadingBlock,
                  { width: "40%", height: 18, marginBottom: 12 },
                  animatedStyle,
                ]}
              />
              <View style={styles.loadingOrderMeta}>
                <Animated.View
                  style={[
                    styles.loadingBlock,
                    { width: "30%", height: 16 },
                    animatedStyle,
                  ]}
                />
                <Animated.View
                  style={[
                    styles.loadingBlock,
                    { width: "20%", height: 16 },
                    animatedStyle,
                  ]}
                />
              </View>
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const Orders = ({ route }) => {
  const {
    data: allOrders,
    isPending,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });

  if (isPending) return <LoadingView />;
  if (error)
    return (
      <Text style={styles.errorText}>
        Error loading orders: {error.message}
      </Text>
    );

  const { inventions = [] } = route.params || {};

  const orders =
    allOrders?.filter(
      (order) => order?.invention && inventions?.includes(order.invention._id)
    ) || [];

  return (
    <SafeAreaView style={styles.container}>
      {orders.length > 0 ? (
        <OrderList orders={orders} />
      ) : (
        <Text style={styles.noOrders}>No orders found</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.page,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  noOrders: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: colors.primary,
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "red",
  },
  loadingBlock: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
  },
  loadingOrderCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingOrderContent: {
    gap: 8,
  },
  loadingOrderMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
});

export default Orders;
