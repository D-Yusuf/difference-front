import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  StatusBar,
  Platform,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { createInvention } from "../api/invention";
import { getCategories } from "../api/categories";
import { colors } from "../../Colors";
import Icon from "react-native-vector-icons/Ionicons";
import { ThemeContext } from "../context/ThemeContext";

import { getInventors } from "../api/user";
import { BASE_URL, invalidateInventionQueries } from "../api";
const Invention = ({ navigation }) => {
  const [phases, setPhases] = useState(["idea", "development", "market"]);
  const queryClient = useQueryClient();
  const [invention, setInvention] = useState({});
  const [images, setImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [phaseModalVisible, setPhaseModalVisible] = useState(false);
  const [selectedInventors, setSelectedInventors] = useState([]);
  const [inventorModalVisible, setInventorModalVisible] = useState(false);
  const [documents, setDocuments] = useState([]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { mutate } = useMutation({
    mutationFn: () => createInvention(invention),
    mutationKey: ["create-invention"],
    onSuccess: () => {
      invalidateInventionQueries(queryClient);
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

  useEffect(() => {
    const category = categories?.find((c) => c._id === selectedCategory);
    setPhases(category?.phases);
  }, [selectedCategory, categories]);

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

  const handleDocumentPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const namedDocuments = result.assets.map((doc) => ({
          ...doc,
          displayName: doc.name, // Default to original name, will be editable
        }));
        setDocuments(namedDocuments);
        setInvention({ ...invention, documents: namedDocuments });
      }
    } catch (err) {
      console.log("Document picker error:", err);
      alert("Error picking document");
    }
  };

  const updateDocumentName = (index, newName) => {
    const updatedDocs = [...documents];
    updatedDocs[index] = {
      ...updatedDocs[index],
      displayName: newName,
    };
    setDocuments(updatedDocs);
    setInvention({ ...invention, documents: updatedDocs });
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
  const { setBackgroundColor } = useContext(ThemeContext);

  useEffect(() => {
    setBackgroundColor(colors.primary); // Set color when component mounts
  }, []);

  const renderPhaseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.roleItem}
      onPress={() => {
        setSelectedPhase(item);
        setInvention({ ...invention, phase: item });
        setPhaseModalVisible(false);
      }}
    >
      <Text style={styles.roleItemText}>{item}</Text>
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
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />

      {/* Enhanced Decorative Elements */}
      <View style={styles.topLeftCurve}>
        <View style={styles.curve1} />
      </View>

      <View style={styles.topRightDots}>
        {[...Array(35)].map((_, index) => (
          <View key={`dot-tr-${index}`} style={styles.dot} />
        ))}
      </View>

      <View style={styles.centerDots}>
        {[...Array(20)].map((_, index) => (
          <View key={`dot-c-${index}`} style={styles.dot} />
        ))}
      </View>

      <View style={styles.bottomLeftDots}>
        {[...Array(28)].map((_, index) => (
          <View key={`dot-bl-${index}`} style={styles.dot} />
        ))}
      </View>

      <View style={styles.bottomRightCurves}>
        {[...Array(6)].map((_, index) => (
          <View
            key={`curve-${index}`}
            style={[
              styles.curve,
              {
                width: 180 + index * 35,
                height: 180 + index * 35,
                bottom: -90 - index * 17.5,
                right: -90 - index * 17.5,
              },
            ]}
          />
        ))}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.contentContainer}>
          {/* Header Section */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>New Invention</Text>
            <Text style={styles.subtitle}>
              Share your innovation with the world
            </Text>
          </View>

          {/* Input Card */}
          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter invention title"
                placeholderTextColor={colors.secondary}
                onChangeText={(text) =>
                  setInvention({ ...invention, name: text })
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={styles.descriptionInput}
                placeholder="Describe your invention"
                placeholderTextColor={colors.secondary}
                multiline={true}
                numberOfLines={6}
                textAlignVertical="top"
                onChangeText={(text) =>
                  setInvention({ ...invention, description: text })
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Cost (KWD)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter total cost"
                placeholderTextColor={colors.secondary}
                keyboardType="numeric"
                onChangeText={(text) =>
                  setInvention({ ...invention, cost: text })
                }
              />
            </View>
          </View>

          {/* Selection Card */}
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.selectionButton}
              onPress={() => setInventorModalVisible(true)}
            >
              <Text style={styles.selectionLabel}>Inventors</Text>
              <Text style={styles.selectionValue}>
                {selectedInventors.length > 0
                  ? `${selectedInventors.length} Selected`
                  : "Select Inventors"}
              </Text>
              <Icon name="chevron-forward" size={24} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.selectionButton}
              onPress={() => setCategoryModalVisible(true)}
            >
              <Text style={styles.selectionLabel}>Category</Text>
              <Text style={styles.selectionValue}>
                {selectedCategory
                  ? categories.find((c) => c._id === selectedCategory).name
                  : "Select Category"}
              </Text>
              <Icon name="chevron-forward" size={24} color={colors.primary} />
            </TouchableOpacity>

            {selectedCategory && (
              <TouchableOpacity
                style={styles.selectionButton}
                onPress={() => setPhaseModalVisible(true)}
              >
                <Text style={styles.selectionLabel}>Phase</Text>
                <Text style={styles.selectionValue}>
                  {selectedPhase || "Select Phase"}
                </Text>
                <Icon name="chevron-forward" size={24} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Upload Card */}
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleImagePicker}
            >
              <Icon name="images-outline" size={24} color={colors.primary} />
              <Text style={styles.uploadButtonText}>Upload Images</Text>
            </TouchableOpacity>

            <View style={styles.imageContainer}>
              {images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image.uri }}
                  style={styles.uploadedImage}
                />
              ))}
            </View>

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleDocumentPicker}
            >
              <Icon
                name="document-text-outline"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.uploadButtonText}>Upload Documents</Text>
            </TouchableOpacity>

            <View style={styles.documentContainer}>
              {documents.map((doc, index) => (
                <View key={index} style={styles.documentItem}>
                  <Icon
                    name="document-text-outline"
                    size={24}
                    color={colors.primary}
                  />
                  <TextInput
                    style={styles.documentNameInput}
                    value={doc.displayName}
                    onChangeText={(newName) =>
                      updateDocumentName(index, newName)
                    }
                    placeholder="Enter document name"
                    placeholderTextColor={colors.secondary}
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleCreateInvention}
          >
            <Icon name="checkmark-circle-outline" size={24} color="white" />
            <Text style={styles.submitButtonText}>Post Invention</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={inventorModalVisible}
        onRequestClose={() => setInventorModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setInventorModalVisible(false)}
            >
              <Icon name="close" size={24} color="red" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Inventors</Text>
            {inventors && inventors?.length > 0 ? (
              <FlatList
                scrollEnabled={false}
                data={inventors?.sort((a, b) =>
                  `${a.firstName} ${a.lastName}`.localeCompare(
                    `${b.firstName} ${b.lastName}`
                  )
                )}
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
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={categoryModalVisible}
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCategoryModalVisible(false)}
            >
              <Icon name="close" size={24} color="red" />
            </TouchableOpacity>
            <FlatList
              scrollEnabled={false}
              data={categories?.sort((a, b) => a.name.localeCompare(b.name))}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item._id}
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
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setPhaseModalVisible(false)}
            >
              <Icon name="close" size={24} color="red" />
            </TouchableOpacity>
            <FlatList
              scrollEnabled={false}
              data={phases}
              renderItem={renderPhaseItem}
              keyExtractor={(item) => item}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  contentContainer: {
    position: "relative",
    zIndex: 1,
  },
  titleContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.primary,
    opacity: 0.8,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: `${colors.primary}10`,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
    paddingVertical: 8,
    fontSize: 16,
    color: colors.primary,
  },
  descriptionInput: {
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
    paddingVertical: 8,
    fontSize: 16,
    color: colors.primary,
    height: 120,
    textAlignVertical: "top",
  },
  selectionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  selectionLabel: {
    fontSize: 16,
    color: colors.primary,
  },
  selectionValue: {
    flex: 1,
    fontSize: 16,
    color: colors.secondary,
    textAlign: "right",
    marginRight: 8,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.secondary,
    marginBottom: 16,
  },
  uploadButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "600",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  documentNameInput: {
    flex: 1,
    fontSize: 16,
    color: colors.primary,
  },
  submitButton: {
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
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  modalView: {
    margin: 20,
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
  },
  roleItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
    width: "100%",
  },
  roleItemText: {
    fontSize: 20,
    color: colors.primary,
    paddingVertical: 10,
    fontWeight: "500",
    textTransform: "capitalize",
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
    color: colors.primary,
  },
  doneButton: {
    backgroundColor: colors.secondary,
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
  documentContainer: {
    marginVertical: 10,
  },
  decorativeDots: {
    position: "absolute",
    top: 100,
    right: 30,
    flexDirection: "row",
    flexWrap: "wrap",
    width: 120,
    gap: 8,
    opacity: 0.15,
    zIndex: 0,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "white",
  },
  decorativeCurves: {
    position: "absolute",
    bottom: 0,
    right: 0,
    opacity: 0.1,
    zIndex: 0,
  },
  curve: {
    position: "absolute",
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  topLeftCurve: {
    position: "absolute",
    top: 0,
    left: 0,
    opacity: 0.15,
    zIndex: 0,
  },
  curve1: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 20,
    borderColor: colors.primary,
    position: "absolute",
    top: -100,
    left: -100,
  },
  topRightDots: {
    position: "absolute",
    top: 40,
    right: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    width: 140,
    gap: 8,
    opacity: 0.15,
    zIndex: 0,
  },
  centerDots: {
    position: "absolute",
    top: "40%",
    left: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    width: 80,
    gap: 8,
    opacity: 0.1,
    zIndex: 0,
    transform: [{ rotate: "45deg" }],
  },
  bottomLeftDots: {
    position: "absolute",
    bottom: 40,
    left: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    width: 120,
    gap: 8,
    opacity: 0.15,
    zIndex: 0,
  },
  bottomRightCurves: {
    position: "absolute",
    bottom: 0,
    right: 0,
    opacity: 0.1,
    zIndex: 0,
  },
});

export default Invention;
