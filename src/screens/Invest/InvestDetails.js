import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import {createOrder} from '../../api/orders';
import { useMutation } from '@tanstack/react-query';
const InvestDetails = ({ route, navigation }) => {
  const { invention } = route.params;
  const [percentage, setPercentage] = useState('');
  const [amount, setAmount] = useState(0);
  const {mutate} = useMutation({
    mutationKey: ['create-order'],
    mutationFn: () => createOrder(invention._id, amount, Number(percentage)),
    onSuccess: () => {
      alert('Success', 'Investment order created successfully!');
      navigation.goBack();
    },
    onError: (error) => {
      alert('Error', 'Failed to create investment order. Please try again.');
    }
  });
  useEffect(() => {
    calculateAmount();
  }, [percentage]);

  const calculateAmount = () => {
    const parsedPercentage = Number(percentage);
    if (!isNaN(parsedPercentage) && parsedPercentage > 0) {
      const calculatedAmount = (parsedPercentage / 100) * invention.cost;
      setAmount(calculatedAmount.toFixed(2));
      // will do later that the number turned to fixed will be accurate to percentage
    } else {
      setAmount(0);
    }
  };

  const handlePercentageChange = (text) => {
    // Allow only numbers with up to one decimal place
    const regex = /^\d*\.?\d{0,1}$/;
    if (regex.test(text) && Number(text) <= 100) {
      setPercentage(text);
    }
  };

  const handleConfirm = async () => {
    mutate();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{invention.name}</Text>
      <Text style={styles.description}>{invention.description}</Text>
      <Text style={styles.cost}>Cost: ${invention.cost}</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Investment Percentage:</Text>
        <TextInput
          style={styles.input}
          value={percentage}
          onChangeText={handlePercentageChange}
          keyboardType="numeric"
          placeholder="Enter percentage (e.g., 1.5)"
        />
      </View>

      <Text style={styles.amountText}>
        Investment Amount: ${amount}
      </Text>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirm}
        disabled={!percentage || parseFloat(percentage) <= 0}
      >
        <Text style={styles.confirmButtonText}>Confirm Investment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  cost: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default InvestDetails;
