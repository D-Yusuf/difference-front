import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Picker,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useQuery, useMutation } from "@tanstack/react-query";
import { createOrder } from "../../api/orders";
import { getAllInventions } from "../../api/invention";
import { BASE_URL } from "../../api";
import { useNavigation } from "@react-navigation/native";
import NAVIGATION from "../../navigations";
import { colors } from "../../../Colors";
const Invest = () => {
  const [selectedInvention, setSelectedInvention] = useState("");
  const [amount, setAmount] = useState("");
  const navigation = useNavigation();
  const { data: inventions, isLoading } = useQuery({
    queryKey: ["inventions"],
    queryFn: getAllInventions,
  });

  const { mutate } = useMutation({
    mutationKey: ["create-order"],
    mutationFn: () => createOrder(selectedInvention, amount),
    onSuccess: () => {
      alert("Success", "Order created successfully!");
    },
    onError: (error) => {
      alert("Error", "Error creating order: " + error.message);
    },
  });

  const handleSubmit = () => {
    mutate();
  };
  if (isLoading) return <Text>Loading...</Text>;

  // console.log(inventions)
  return (
    <ScrollView style={{ flex: 1 }}>
      <Text style={styles.title}>Invest in an Invention</Text>
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {inventions?.map((invention) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(NAVIGATION.INVEST.INVENTION_DETAILS, {
                invention,
              })
            }
            key={invention._id}
            style={{
              backgroundColor:
                selectedInvention === invention._id ? "orange" : "#f0f0f0",
            }}
          >
            <View
              style={{
                width: 200,
                height: 300,
                borderRadius: 10,
                paddingBottom: 10,
              }}
            >
              <Image
                source={{ uri: `${BASE_URL}${invention.images[0]}` }}
                style={{ flex: 2, width: "100%", height: "100%" }}
              />
              <View style={{ padding: 10, flex: 1 }}>
                {/* <Image source={{uri: `${BASE_URL}${invention.images[0]}`}} style={{flex: 1, width: '100%', height: '100%'}} /> */}
                <Text
                  style={
                    selectedInvention === invention._id
                      ? { textColor: "white" }
                      : { textColor: "black" }
                  }
                >
                  {invention.name}
                </Text>
                {invention.inventors.map((inventor) => (
                  // <Text style={selectedInvention === invention._id ? {textColor: 'white'} : {textColor: 'black'}}>{inventor.name}</Text>
                  <Image
                    key={inventor._id}
                    source={{ uri: `${BASE_URL}${inventor.image}` }}
                    style={{ width: 50, height: 50, borderRadius: 50 }}
                  />
                ))}
                <Text
                  style={
                    selectedInvention === invention._id
                      ? { textColor: "white" }
                      : { textColor: "black" }
                  }
                >
                  Cost: {invention.cost} KWD
                </Text>
                <Text
                  style={
                    selectedInvention === invention._id
                      ? { textColor: "white" }
                      : { textColor: "black" }
                  }
                >
                  Phase: {invention.phase}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Amount to pay"
        keyboardType="numeric"
        onChangeText={(text) => setAmount(text)}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  picker: {
    height: 50,
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default Invest;
