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
  Pressable,
  Animated,
} from "react-native";
import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { updateInvention } from "../api/invention";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { BASE_URL } from "../api";
import { getCategories } from "../api/categories";
import { getInventors } from "../api/user";
import Icon from "react-native-vector-icons/Ionicons";
import { colors } from "../../Colors";

const EditInvention = ({ route, navigation }) => {
  const queryClient = useQueryClient();
  const { invention } = route.params;
  const [inventionInfo, setInventionInfo] = useState({
    name: invention.name || "",
    description: invention.description || "",
    cost: invention.cost ? invention.cost.toString() : "",
  });
  const [images, setImages] = useState(
    invention.images
      ? invention.images.map((img) => ({
          uri: `${BASE_URL}${img}`,
          isExisting: true,
          path: img, // Keep the original path for existing images
        }))
      : []
  );
  const [documents, setDocuments] = useState(invention.documents || []);
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
  

  const handleInputChange = (field, value) => {
    setInventionInfo((prev) => ({
      ...prev,
      [field]: value === "" ? null : value,
    }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      const newImages = result.assets.map(img => ({
        uri: img.uri,
        isExisting: false,
      }));
      setImages([...images, ...newImages]);
    }
  };

  // Update the removeImage function
  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    setInventionInfo({
      ...inventionInfo,
      images: updatedImages,
    });
  };

  const handleDocumentPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const newDocuments = result.assets.map((doc) => ({
          ...doc,
          displayName: doc.name,
        }));
        setDocuments([...documents, ...newDocuments]);
        setInventionInfo({
          ...inventionInfo,
          documents: [...documents, ...newDocuments],
        });
      }
    } catch (err) {
      console.log("Document picker error:", err);
      alert("Error picking document");
    }
  };

  const removeDocument = (index) => {
    const updatedDocs = documents.filter((_, i) => i !== index);
    setDocuments(updatedDocs);
    setInventionInfo({
      ...inventionInfo,
      documents: updatedDocs,
    });
  };

  const phases = [
    { label: "Idea", value: "idea" },
    { label: "Testing", value: "testing" },
    { label: "Market Ready", value: "market_ready" },
  ];

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: inventors } = useQuery({
    queryKey: ["inventors"],
    queryFn: getInventors,
  });
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
      documents: documents,
    };
  
    // Handle both existing and new images
    if (images.length > 0) {
      updatedInvention.images = images.map(img => {
        if (img.isExisting) {
          return img.path;
        }
        return img;
      });
    }
  
    console.log("Submitting update with:", updatedInvention);
    editInvention(updatedInvention);
  };

  const animatedValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Name</Text>
            <View style={styles.inputWrapper}>
              <Icon
                name="create-outline"
                size={20}
                color={colors.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={inventionInfo.name ?? ""}
                onChangeText={(value) => handleInputChange("name", value)}
                placeholder="Enter invention name"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
              <Icon
                name="document-text-outline"
                size={20}
                color={colors.primary}
                style={[styles.inputIcon, { marginTop: 12 }]}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                value={inventionInfo.description ?? ""}
                onChangeText={(value) =>
                  handleInputChange("description", value)
                }
                placeholder="Describe your invention"
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Cost</Text>
            <View style={styles.inputWrapper}>
              <Icon
                name="cash-outline"
                size={20}
                color={colors.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={inventionInfo.cost ?? ""}
                onChangeText={(value) => handleInputChange("cost", value)}
                placeholder="Enter cost in KWD"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.selectionButton}
            onPress={() => setInventorModalVisible(true)}
          >
            <Icon name="people-outline" size={20} color={colors.primary} />
            <Text style={styles.selectionButtonText}>
              {selectedInventors.length > 0
                ? `${selectedInventors.length} Inventor${
                    selectedInventors.length > 1 ? "s" : ""
                  } Selected`
                : "Select Inventors"}
            </Text>
            <Icon name="chevron-forward" size={20} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.selectionButton}
            onPress={() => setCategoryModalVisible(true)}
          >
            <Icon name="grid-outline" size={20} color={colors.primary} />
            <Text style={styles.selectionButtonText}>
              {selectedCategory
                ? categories?.find((c) => c._id === selectedCategory)?.name
                : "Select Category"}
            </Text>
            <Icon name="chevron-forward" size={20} color={colors.primary} />
          </TouchableOpacity>

          {selectedCategory && (
            <TouchableOpacity
              style={styles.selectionButton}
              onPress={() => setPhaseModalVisible(true)}
            >
              <Icon name="flag-outline" size={20} color={colors.primary} />
              <Text style={styles.selectionButtonText}>
                {selectedPhase || "Select Phase"}
              </Text>
              <Icon name="chevron-forward" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Icon name="images-outline" size={24} color={colors.primary} />
            <Text style={styles.uploadButtonText}>Upload Images</Text>
          </TouchableOpacity>

          <View style={styles.imageContainer}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image
                  source={{ uri: image.uri }}
                  style={styles.uploadedImage}
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Icon name="close-circle" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.documentsSection}>
            <Text style={styles.sectionTitle}>Documents</Text>

            {documents.length > 0 && (
              <View style={styles.documentsList}>
                {documents.map((doc, index) => (
                  <View key={index} style={styles.documentItem}>
                    <View style={styles.documentInfo}>
                      <Icon
                        name="document-text-outline"
                        size={24}
                        color={colors.primary}
                      />
                      <Text style={styles.documentName}>
                        {doc.displayName || `Document ${index + 1}`}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeDocButton}
                      onPress={() => removeDocument(index)}
                    >
                      <Icon
                        name="close-circle"
                        size={20}
                        color={colors.primary}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={styles.addDocumentButton}
              onPress={handleDocumentPicker}
            >
              <Icon
                name="add-circle-outline"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.addDocumentText}>
                {documents.length > 0 ? "Add More Documents" : "Add Documents"}
              </Text>
            </TouchableOpacity>
          </View>

          <Animated.View
            style={[
              styles.submitButtonContainer,
              { transform: [{ scale: animatedValue }] },
            ]}
          >
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleEditInvention}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Text style={styles.submitButtonText}>Update Invention</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      {/* Modals */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={inventorModalVisible}
        onRequestClose={() => setInventorModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Inventors</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setInventorModalVisible(false)}
              >
                <Icon name="close" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={inventors}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    selectedInventors.includes(item._id) &&
                      styles.selectedModalItem,
                  ]}
                  onPress={() => {
                    const updatedInventors = selectedInventors.includes(
                      item._id
                    )
                      ? selectedInventors.filter((id) => id !== item._id)
                      : [...selectedInventors, item._id];
                    setSelectedInventors(updatedInventors);
                  }}
                >
                  <View style={styles.inventorItemContent}>
                    {item.image && (
                      <Image
                        source={{ uri: `${BASE_URL}${item.image}` }}
                        style={styles.inventorImage}
                      />
                    )}
                    <Text style={styles.inventorName}>
                      {item.firstName} {item.lastName}
                    </Text>
                  </View>
                  {selectedInventors.includes(item._id) && (
                    <Icon
                      name="checkmark-circle"
                      size={24}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={categoryModalVisible}
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setCategoryModalVisible(false)}
              >
                <Icon name="close" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={categories}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    selectedCategory === item._id && styles.selectedModalItem,
                  ]}
                  onPress={() => {
                    setSelectedCategory(item._id);
                    setCategoryModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                  {selectedCategory === item._id && (
                    <Icon
                      name="checkmark-circle"
                      size={24}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={phaseModalVisible}
        onRequestClose={() => setPhaseModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Phase</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setPhaseModalVisible(false)}
              >
                <Icon name="close" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={phases}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    selectedPhase === item.value && styles.selectedModalItem,
                  ]}
                  onPress={() => {
                    setSelectedPhase(item.value);
                    setPhaseModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.label}</Text>
                  {selectedPhase === item.value && (
                    <Icon
                      name="checkmark-circle"
                      size={24}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.page,
  },
  form: {
    padding: 16,
  },
  formSection: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  textAreaWrapper: {
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: colors.primary,
    fontSize: 15,
    padding: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  selectionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  selectionButtonText: {
    flex: 1,
    color: colors.primary,
    fontSize: 15,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.secondary,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  uploadButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "500",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  imageWrapper: {
    position: "relative",
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: colors.page,
    borderRadius: 12,
    padding: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: colors.page,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary,
  },
  closeButton: {
    padding: 4,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  selectedModalItem: {
    backgroundColor: colors.secondary,
  },
  modalItemText: {
    fontSize: 16,
    color: colors.primary,
  },
  inventorItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  inventorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  inventorName: {
    fontSize: 16,
    color: colors.primary,
  },
  submitButtonContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: colors.page,
    fontSize: 16,
    fontWeight: "600",
  },
  documentsSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
    marginLeft: 4,
  },
  documentsList: {
    gap: 8,
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 12,
  },
  documentInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    color: colors.primary,
    flex: 1,
  },
  removeDocButton: {
    padding: 4,
  },
  addDocumentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 12,
  },
  addDocumentText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
});

export default EditInvention;
