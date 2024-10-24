import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { createInvention } from "../api/inventions";

const Invention = () => {
  const phases = [
    { label: "Idea", value: "idea" },
    { label: "Testing", value: "testing" },
    { label: "Market Ready", value: "market_ready" },
  ];

  const [invention, setInvention] = useState({});
  const [images, setImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState(null);

  const { mutate } = useMutation({
    mutationFn: () => createInvention(invention),
    mutationKey: ["create-invention"],
    onSuccess: () => {
      alert("Invention created successfully");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages(result.assets);
      setInvention({ ...invention, images: result.assets });
    }
  };

  const handleCreateInvention = () => {
    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }
    if (!selectedPhase) {
      alert("Please select a phase for your invention");
      return;
    }
    mutate();
  };

  const renderPhaseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.roleItem}
      onPress={() => {
        setSelectedPhase(item.value);
        setInvention({ ...invention, phase: item.value });
        setModalVisible(false);
      }}
    >
      <Text style={styles.roleItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>New Invention</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Invention Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter invention title"
            onChangeText={(text) => setInvention({ ...invention, name: text })}
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
            onChangeText={(text) =>
              setInvention({ ...invention, description: text })
            }
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Needed Funds</Text>
          <TextInput
            style={styles.input}
            placeholder="Total Costs in KWD"
            keyboardType="numeric"
            onChangeText={(text) => setInvention({ ...invention, cost: text })}
          />
        </View>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.dropdownButtonText}>
            {selectedPhase
              ? phases.find((p) => p.value === selectedPhase).label
              : "Select Phase"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleImagePicker}>
          <Text style={styles.buttonText}>Upload Images</Text>
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          {images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image.uri }}
              style={styles.image}
            />
          ))}
        </View>
        <TouchableOpacity
          style={styles.createInventionbutton}
          onPress={handleCreateInvention}
        >
          <Text style={styles.buttonText}>Post Invention</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <FlatList
            data={phases}
            renderItem={renderPhaseItem}
            keyExtractor={(item) => item.value}
          />
        </View>
      </Modal>
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
    marginVertical: 10,
  },
  createInventionbutton: {
    backgroundColor: "#34A853",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
  dropdownButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#333",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  roleItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
  },
  roleItemText: {
    fontSize: 16,
    color: "#333",
  },
});
