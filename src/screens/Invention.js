import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createInvention } from "../api/Auth/InventionApi"; // Assuming this is the correct path

const Invention = () => {
  const [invention, setInvention] = useState({});
  const { mutate } = useMutation({
    mutationFn: () => createInvention(invention),
    mutationKey: ["create-invention"],
    onSuccess: () => {
      console.log("Invention created successfully");
      console.log(invention);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleChange = (key) => (text) => {
    setInvention((prev) => ({ ...prev, [key]: text }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>New Invention</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter invention title"
            onChangeText={handleChange("name")}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Describe your invention"
            multiline={true}
            numberOfLines={6}
            textAlignVertical="top"
            onChangeText={handleChange("description")}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Needed Funds</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount in KWD"
            keyboardType="numeric"
            onChangeText={handleChange("price")}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={mutate}>
          <Text style={styles.buttonText}>Create Invention</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Invention;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgray",
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "black",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "black",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  descriptionInput: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 150,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "black",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
