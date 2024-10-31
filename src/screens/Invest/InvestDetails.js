import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { createOrder } from "../../api/orders";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { colors } from "../../../Colors";
import { invalidateOrderQueries } from "../../api";
const InvestDetails = ({ route, navigation }) => {
  const queryClient = useQueryClient();

  const { invention } = route.params;
  const [percentage, setPercentage] = useState("");
  const [amount, setAmount] = useState(0);
  const { mutate } = useMutation({
    mutationKey: ["create-order"],
    mutationFn: () => createOrder(invention._id, amount, Number(percentage)),
    onSuccess: () => {
      invalidateOrderQueries(queryClient);
      alert("Success", "Investment order created successfully!");
      navigation.goBack();
    },
    onError: (error) => {
      alert("Error", "Failed to create investment order. Please try again.");
    },
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
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>{invention.name}</Text>
        {/* <Text style={styles.description}>{invention.description}</Text> */}
        <Text style={styles.cost}>Cost: ${invention.cost}</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Investment %:</Text>
          <TextInput
            style={styles.input}
            value={percentage}
            onChangeText={handlePercentageChange}
            keyboardType="numeric"
            placeholder="Enter percentage (e.g., 1.5)"
            placeholderTextColor="white"
          />
        </View>

        <Text style={styles.amountText}>Investment Amount: ${amount}</Text>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirm}
          disabled={!percentage || parseFloat(percentage) <= 0}
        >
          <Text style={styles.confirmButtonText}>Confirm Investment</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: colors.primary,
    padding: 10,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 20,
    lineHeight: 24,
  },
  cost: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(241, 245, 249, 0.3)",
    paddingVertical: 12,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "white",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  amountText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 20,
  },
  confirmButton: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginHorizontal: 4,
    paddingHorizontal: 24,
    shadowColor: "#475569",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    gap: 12,
  },
  confirmButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "700",
    paddingHorizontal: 8,
  },
});

export default InvestDetails;
