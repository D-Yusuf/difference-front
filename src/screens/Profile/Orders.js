import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import OrderList from '../../components/OrderList';
import { getOrders } from '../../api/orders';
import { useQuery } from '@tanstack/react-query';

const Orders = ({route}) => {
    const {data: allOrders, isPending} = useQuery({
        queryKey: ["orders"],
        queryFn: () => getOrders()
    })
    if(isPending) return <Text>Loading...</Text>
    const {inventions} = route.params; // these are the user's inventions
    const orders = allOrders?.filter(order => inventions?.includes(order.invention?._id));
  console.log("orders-iusihewbf", orders)
  return (
    <View style={styles.container}>
      <OrderList orders={orders} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  }
});

export default Orders;