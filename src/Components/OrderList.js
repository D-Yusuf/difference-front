import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { getOrders, updateOrder } from '../api/orders';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '../api';
import NAVIGATION from '../navigations';
import { useNavigation } from '@react-navigation/native';

const OrderList = ({ orders, own = false }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  console.log("orders", orders)
  // Mutation for updating order status
  const { mutate: updateOrderStatus } = useMutation({
    mutationFn: ({ orderId, newStatus }) => updateOrder(orderId, { status: newStatus }),
    onSuccess: () => {
      // Invalidate and refetch orders after successful update
      queryClient.invalidateQueries(['orders', 'orders-profile']);
    },
    onError: (error) => {
      console.error('Failed to update order status:', error);
      // Implement your error handling here (e.g., show toast message)
    },
  });

  const filteredOrders = orders?.filter(order => 
    statusFilter === 'all' ? true : order.status === statusFilter
  );

  const handleStatusUpdate = (orderId, newStatus) => {
    updateOrderStatus({ orderId, newStatus });
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, statusFilter === 'all' && styles.activeFilter]}
          onPress={() => setStatusFilter('all')}>
          <Text style={[styles.filterText, statusFilter === 'all' && styles.activeFilterText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, statusFilter === 'pending' && styles.activeFilter]}
          onPress={() => setStatusFilter('pending')}>
          <Text style={[styles.filterText, statusFilter === 'pending' && styles.activeFilterText]}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, statusFilter === 'approved' && styles.activeFilter]}
          onPress={() => setStatusFilter('approved')}>
          <Text style={[styles.filterText, statusFilter === 'approved' && styles.activeFilterText]}>Approved</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, statusFilter === 'declined' && styles.activeFilter]}
          onPress={() => setStatusFilter('declined')}>
          <Text style={[styles.filterText, statusFilter === 'declined' && styles.activeFilterText]}>Declined</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {filteredOrders?.map((order) => (
          <View key={order._id} style={styles.card}>
            {/* <TouchableOpacity style={styles.header} onPress={() => navigation.navigate(NAVIGATION.INVENTION.INVENTION_DETAILS, { inventionId: order.invention })}> */}
              {/* </TouchableOpacity> */}
              <View style={styles.header}>
              <Image 
                source={{ uri: BASE_URL + order.invention?.image }}
                style={styles.inventionImage}
              />
              <Text style={styles.title}>{order.invention?.name}</Text>
              <Text style={[
                  styles.status,
                  order.status === 'approved' && styles.approvedStatus,
                  order.status === 'declined' && styles.declinedStatus,
                  order.status === 'pending' && styles.pendingStatus,
                ]}>{order.status}</Text>
              </View>
            
            <View style={styles.details}>
              <Text style={styles.detailText}>
                Amount: {order.amount} KWD
              </Text>
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
                {!own && order.status === 'pending' ? (
                  <View style={styles.buttonGroup}>
                    <TouchableOpacity 
                      onPress={() => handleStatusUpdate(order._id, 'approved')}
                      style={[styles.actionButton, styles.approveButton]}>
                      <Text style={styles.actionButtonText}>✓</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => handleStatusUpdate(order._id, 'declined')}
                      style={[styles.actionButton, styles.declineButton]}>
                      <Text style={styles.actionButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ) : !own && (
                  <TouchableOpacity 
                    onPress={() => handleStatusUpdate(order._id, 'pending')}
                    style={[styles.actionButton, styles.pendingButton]}>
                    <Text style={styles.actionButtonText}>←</Text>
                  </TouchableOpacity>
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
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  inventionImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  status: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  details: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 4,
  },
  investorInfo: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  investorText: {
    fontSize: 14,
    color: '#666',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  activeFilter: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    color: '#333',
  },
  investorProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  declineButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 20,
  },
  activeFilterText: {
    color: 'white',
  },
  approvedStatus: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  declinedStatus: {
    backgroundColor: '#F44336',
    color: 'white',
  },
  pendingStatus: {
    backgroundColor: '#FFC107',
    color: 'black',
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  pendingButton: {
    backgroundColor: '#FFC107',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',  // Align buttons to the right
    marginTop: 8,
  },
});

export default OrderList;