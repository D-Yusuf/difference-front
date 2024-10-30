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
import { useMutation, useQuery } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { createInvention } from "../api/invention";
import { getCategories } from "../api/categories";
import { getInventors } from "../api/user";
import { BASE_URL } from "../api";
const Invention = ({ navigation }) => {
  const phases = [
    { label: "Idea", value: "idea" },
    { label: "Testing", value: "testing" },
    { label: "Market Ready", value: "market_ready" },
  ];

  const [invention, setInvention] = useState({});
  const [images, setImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [phaseModalVisible, setPhaseModalVisible] = useState(false);
  const [selectedInventors, setSelectedInventors] = useState([]);
  const [inventorModalVisible, setInventorModalVisible] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { mutate } = useMutation({
    mutationFn: () => createInvention(invention),
    mutationKey: ["create-invention"],
    onSuccess: () => {
      alert("Invention created successfully");
      navigation.goBack();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { data: inventors } = useQuery({
    queryKey: ["inventors"],
    queryFn: getInventors,
    onError: (error) => {
      console.log("Error fetching inventors:", error);
      alert("Failed to load inventors");
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
    if (!selectedCategory) {
      alert("Please select a category for your invention");
      return;
    }
    if (!selectedPhase) {
      alert("Please select a phase for your invention");
      return;
    }
    if (selectedInventors.length === 0) {
      alert("Please select at least one inventor");
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
        setPhaseModalVisible(false);
      }}
    >
      <Text style={styles.roleItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.roleItem}
      onPress={() => {
        setSelectedCategory(item._id);
        setInvention({ ...invention, category: item._id });
        setCategoryModalVisible(false);
      }}
    >
      <Text style={styles.roleItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderInventorItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.roleItem,
        selectedInventors.includes(item._id) && styles.selectedItem,
      ]}
      onPress={() => {
        const updatedInventors = selectedInventors.includes(item._id)
          ? selectedInventors.filter((id) => id !== item._id)
          : [...selectedInventors, item._id];

        setSelectedInventors(updatedInventors);
        setInvention({ ...invention, inventors: updatedInventors });
      }}
    >
      <View style={styles.inventorItemContainer}>
        {item.image && (
          <Image
            source={{ uri: `${BASE_URL}${item.image}` }}
            style={styles.inventorImage}
          />
        )}
        <View style={styles.inventorInfo}>
          <Text style={styles.roleItemText}>
            {item.firstName} {item.lastName}
          </Text>
          {item.bio && <Text style={styles.inventorBio}>{item.bio}</Text>}
        </View>
        {selectedInventors.includes(item._id) && (
          <Text style={styles.checkmark}>✓</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
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
          onPress={() => setInventorModalVisible(true)}
        >
          <Text style={styles.dropdownButtonText}>
            {selectedInventors.length > 0
              ? `${selectedInventors.length} Inventor${
                  selectedInventors.length > 1 ? "s" : ""
                } Selected`
              : "Select Inventors"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setCategoryModalVisible(true)}
        >
          <Text style={styles.dropdownButtonText}>
            {selectedCategory
              ? categories.find((c) => c._id === selectedCategory).name
              : "Select Category"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setPhaseModalVisible(true)}
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
        visible={inventorModalVisible}
        onRequestClose={() => setInventorModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Select Inventors</Text>
          {inventors && inventors?.length > 0 ? (
            <FlatList
              data={inventors}
              renderItem={renderInventorItem}
              keyExtractor={(item) => item._id}
              style={styles.inventorsList}
            />
          ) : (
            <Text style={styles.noDataText}>No inventors available</Text>
          )}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => setInventorModalVisible(false)}
          >
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={categoryModalVisible}
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalView}>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item._id}
          />
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={phaseModalVisible}
        onRequestClose={() => setPhaseModalVisible(false)}
      >
        <View style={styles.modalView}>
          <FlatList
            data={phases}
            renderItem={renderPhaseItem}
            keyExtractor={(item) => item.value}
          />
        </View>
      </Modal>
    </View>
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
  inventorsContainer: {
    marginBottom: 20,
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
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
  },
  roleItemText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  selectedItem: {
    backgroundColor: "#f0f0f0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkmark: {
    color: "#34A853",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  doneButton: {
    backgroundColor: "#34A853",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    width: "100%",
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 20,
  },
  inventorItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  inventorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  inventorInfo: {
    flex: 1,
  },
  inventorBio: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  inventorsList: {
    width: "100%",
    maxHeight: "80%",
  },
});
