import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { updateInvention } from "../api/invention";
import * as ImagePicker from "expo-image-picker";
import { BASE_URL } from "../api";
import { getCategories } from "../api/categories";
import { getInventors } from "../api/user";

const EditInvention = ({ route, navigation }) => {
  const queryClient = useQueryClient();
  const { invention } = route.params;
  const [inventionInfo, setInventionInfo] = useState({
    name: invention.name || "",
    description: invention.description || "",
    cost: invention.cost ? invention.cost.toString() : "",
  });
  const [images, setImages] = useState(null);
  const { mutate: editInvention } = useMutation({
    mutationFn: (updatedData) => updateInvention(invention._id, updatedData),
    onSuccess: () => {
      alert("Invention updated successfully");
      queryClient.invalidateQueries(["profile"]);
      queryClient.invalidateQueries(["inventions"]);
      queryClient.invalidateQueries(["invention", invention._id]);
      navigation.goBack();
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      alert(error.response?.data?.message || "Error updating invention");
    },
  });
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages(result.assets);
      setInventionInfo({
        ...inventionInfo,
        images: result.assets,
      });
    }
  };

  const phases = [
    { label: "Idea", value: "idea" },
    { label: "Testing", value: "testing" },
    { label: "Market Ready", value: "market_ready" },
  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [phaseModalVisible, setPhaseModalVisible] = useState(false);
  const [inventorModalVisible, setInventorModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    invention.category || null
  );
  const [selectedPhase, setSelectedPhase] = useState(invention.phase || null);
  const [selectedInventors, setSelectedInventors] = useState(
    invention.inventors ? invention.inventors.map((inv) => inv._id) : []
  );

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: inventors } = useQuery({
    queryKey: ["inventors"],
    queryFn: getInventors,
  });

  const renderPhaseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.roleItem}
      onPress={() => {
        setSelectedPhase(item.value);
        setInventionInfo({ ...inventionInfo, phase: item.value });
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

  const validateInputs = () => {
    if (!inventionInfo.name && !invention.name) {
      alert("Please enter an invention name");
      return false;
    }
    if (!inventionInfo.description && !invention.description) {
      alert("Please enter a description");
      return false;
    }
    if (!inventionInfo.cost && !invention.cost) {
      alert("Please enter the cost");
      return false;
    }
    if (!selectedPhase) {
      alert("Please select a phase");
      return false;
    }
    if (!selectedCategory) {
      alert("Please select a category");
      return false;
    }
    if (!selectedInventors || selectedInventors.length === 0) {
      alert("Please select at least one inventor");
      return false;
    }
    return true;
  };

  const handleEditInvention = () => {
    if (!validateInputs()) return;

    const updatedInvention = {
      name: inventionInfo.name || invention.name,
      description: inventionInfo.description || invention.description,
      cost: inventionInfo.cost || invention.cost.toString(),
      phase: selectedPhase,
      category: selectedCategory,
      inventors: selectedInventors,
    };

    if (images && images.length > 0) {
      updatedInvention.images = images;
    }

    console.log("Submitting update with:", updatedInvention);
    editInvention(updatedInvention);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={inventionInfo.name || invention.name}
          onChangeText={(value) =>
            setInventionInfo({
              ...inventionInfo,
              name: value,
            })
          }
          placeholder="Invention Name"
        />
        <TextInput
          style={styles.input}
          value={inventionInfo.description || invention.description}
          onChangeText={(value) =>
            setInventionInfo({
              ...inventionInfo,
              description: value,
            })
          }
          placeholder="Description"
          multiline
        />
        <TextInput
          style={styles.input}
          value={inventionInfo.cost || invention.cost.toString()}
          onChangeText={(value) =>
            setInventionInfo({
              ...inventionInfo,
              cost: value,
            })
          }
          placeholder="Cost"
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text>Add Images</Text>
        </TouchableOpacity>

        <View style={styles.imageGrid}>
          {images
            ? images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image.uri }}
                  style={styles.imagePreview}
                />
              ))
            : invention.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: `${BASE_URL}${image}` }}
                  style={styles.imagePreview}
                />
              ))}
        </View>

        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setInventorModalVisible(true)}
        >
          <Text style={styles.dropdownButtonText}>
            {selectedInventors?.length > 0
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
              ? categories?.find((c) => c._id === selectedCategory)?.name
              : "Select Category"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setPhaseModalVisible(true)}
        >
          <Text style={styles.dropdownButtonText}>
            {selectedPhase
              ? phases.find((p) => p.value === selectedPhase)?.label
              : "Select Phase"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleEditInvention}
        >
          <Text style={styles.submitButtonText}>Update Invention</Text>
        </TouchableOpacity>
      </View>

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
          <Text style={styles.modalTitle}>Select Category</Text>
          {categories && categories?.length > 0 ? (
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item._id}
              style={styles.categoriesList}
            />
          ) : (
            <Text style={styles.noDataText}>No categories available</Text>
          )}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => setCategoryModalVisible(false)}
          >
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={phaseModalVisible}
        onRequestClose={() => setPhaseModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Select Phase</Text>
          {phases.map((phase, index) => (
            <TouchableOpacity
              key={index}
              style={styles.roleItem}
              onPress={() => {
                setSelectedPhase(phase.value);
                setPhaseModalVisible(false);
              }}
            >
              <Text style={styles.roleItemText}>{phase.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => setPhaseModalVisible(false)}
          >
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default EditInvention;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  form: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  imageButton: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 15,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 15,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  dropdownButton: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
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
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  inventorsList: {
    width: "100%",
    maxHeight: "80%",
  },
  noDataText: {
    fontSize: 16,
    color: "#888",
    marginBottom: 15,
  },
  doneButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  categoriesList: {
    width: "100%",
  },
  selectedItem: {
    backgroundColor: "#f0f0f0",
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
  checkmark: {
    color: "#34A853",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
