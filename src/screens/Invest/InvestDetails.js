import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { createOrder } from "../../api/orders";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { colors } from "../../../Colors";
import { invalidateOrderQueries } from "../../api";
import Icon from "react-native-vector-icons/Ionicons";
import CustomAlert from "../../components/CustomAlert";

const InvestDetails = ({ route, navigation }) => {
  const queryClient = useQueryClient();
  const { invention, remainingFunds } = route.params;
  const [percentage, setPercentage] = useState("");
  const [amount, setAmount] = useState(0);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "success",
  });

  // Calculate remaining percentage
  const remainingPercentage = Math.floor(
    (remainingFunds / invention.cost) * 100
  );

  const { mutate } = useMutation({
    mutationKey: ["create-order"],
    mutationFn: () => createOrder(invention._id, amount, Number(percentage)),
    onSuccess: () => {
      invalidateOrderQueries(queryClient);
      setAlertConfig({
        visible: true,
        title: "Investment Request Sent",
        message: `Your investment request of ${percentage}% (${amount} KWD) in ${invention.name} has been sent to the inventor. You will be notified once they review your request.`,
        type: "success",
      });
    },
    onError: (error) => {
      setAlertConfig({
        visible: true,
        title: "Request Failed",
        message:
          "There was an error sending your investment request. Please try again later.",
        type: "error",
      });
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
    } else {
      setAmount(0);
    }
  };

  const handlePercentageChange = (text) => {
    // Allow only whole numbers
    const regex = /^\d*$/;
    const numValue = parseInt(text);

    if (
      regex.test(text) && // Must be whole number
      (!numValue || (numValue > 0 && numValue <= remainingPercentage)) // Must be within remaining percentage
    ) {
      setPercentage(text);
    }
  };

  const handleConfirm = async () => {
    // Add validation before sending request
    if (!percentage || parseFloat(percentage) <= 0) {
      setAlertConfig({
        visible: true,
        title: "Invalid Input",
        message: "Please enter a valid investment percentage.",
        type: "error",
      });
      return;
    }

    if (parseFloat(percentage) > remainingPercentage) {
      setAlertConfig({
        visible: true,
        title: "Invalid Amount",
        message: `The maximum available percentage for investment is ${remainingPercentage}%.`,
        type: "error",
      });
      return;
    }

    mutate();
  };

  const handleAlertClose = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
    if (alertConfig.type === "success") {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.contentContainer}>
            {/* Header Section */}
            <Text style={styles.title}>{invention.name}</Text>

            {/* Investment Details Card */}
            <View style={styles.detailsCard}>
              <View style={styles.costRow}>
                <View style={styles.costItem}>
                  <Text style={styles.costLabel}>Total Cost</Text>
                  <Text style={styles.costValue}>${invention.cost}</Text>
                </View>
                <View style={styles.costItem}>
                  <Text style={styles.costLabel}>Available Funds</Text>
                  <Text style={styles.costValue}>${remainingFunds}</Text>
                </View>
              </View>

              <View style={styles.percentageContainer}>
                <Text style={styles.percentageLabel}>Available Percentage</Text>
                <View style={styles.percentageCircle}>
                  <Text style={styles.percentageValue}>
                    {remainingPercentage}%
                  </Text>
                </View>
              </View>
            </View>

            {/* Investment Input Section */}
            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Investment Percentage</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={percentage}
                  onChangeText={handlePercentageChange}
                  keyboardType="numeric"
                  placeholder={`Enter percentage (max ${remainingPercentage}%)`}
                  placeholderTextColor={colors.secondary}
                />
                <Text style={styles.percentageSymbol}>%</Text>
              </View>

              <View style={styles.amountContainer}>
                <Text style={styles.amountLabel}>Investment Amount:</Text>
                <Text style={styles.amountValue}>${amount}</Text>
              </View>
            </View>

            {/* Confirm Button */}
            <TouchableOpacity
              style={[
                styles.confirmButton,
                (!percentage || parseFloat(percentage) <= 0) &&
                  styles.disabledButton,
              ]}
              onPress={handleConfirm}
              disabled={!percentage || parseFloat(percentage) <= 0}
            >
              <Icon name="checkmark-circle-outline" size={24} color="white" />
              <Text style={styles.confirmButtonText}>Confirm Investment</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={handleAlertClose}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.page,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.page,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 40,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  detailsCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  costItem: {
    flex: 1,
    alignItems: "center",
  },
  costLabel: {
    fontSize: 14,
    color: colors.primary,
    opacity: 0.8,
    marginBottom: 4,
  },
  costValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
  },
  percentageContainer: {
    alignItems: "center",
  },
  percentageLabel: {
    fontSize: 14,
    color: colors.primary,
    opacity: 0.8,
    marginBottom: 8,
  },
  percentageCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  percentageValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
  },
  inputCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
    paddingBottom: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.primary,
    paddingVertical: 8,
  },
  percentageSymbol: {
    fontSize: 16,
    color: colors.primary,
    marginLeft: 8,
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.secondary,
  },
  amountLabel: {
    fontSize: 16,
    color: colors.primary,
  },
  amountValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
  },
  confirmButton: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    gap: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

export default InvestDetails;
