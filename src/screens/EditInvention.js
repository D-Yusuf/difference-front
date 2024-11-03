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
                value={inventionInfo.name || invention.name}
                onChangeText={(value) =>
                  setInventionInfo({
                    ...inventionInfo,
                    name: value,
                  })
                }
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
                value={inventionInfo.description || invention.description}
                onChangeText={(value) =>
                  setInventionInfo({
                    ...inventionInfo,
                    description: value,
                  })
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
                value={inventionInfo.cost || invention.cost.toString()}
                onChangeText={(value) =>
                  setInventionInfo({
                    ...inventionInfo,
                    cost: value,
                  })
                }
                placeholder="Enter cost in KWD"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.selectionSection}>
            <TouchableOpacity
              style={styles.selectionButton}
              onPress={() => setInventorModalVisible(true)}
            >
              <View style={styles.selectionContent}>
                <View style={styles.iconContainer}>
                  <Icon name="people" size={20} color={colors.primary} />
                </View>
                <View style={styles.selectionTextContainer}>
                  <Text style={styles.selectionLabel}>Inventors</Text>
                  <Text style={styles.selectionValue}>
                    {selectedInventors?.length > 0
                      ? `${selectedInventors.length} Selected`
                      : "Select inventors"}
                  </Text>
                </View>
              </View>
              <Icon name="chevron-forward" size={20} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.selectionButton}
              onPress={() => setCategoryModalVisible(true)}
            >
              <View style={styles.selectionContent}>
                <View style={styles.iconContainer}>
                  <Icon name="pricetag" size={20} color={colors.primary} />
                </View>
                <View style={styles.selectionTextContainer}>
                  <Text style={styles.selectionLabel}>Category</Text>
                  <Text style={styles.selectionValue}>
                    {selectedCategory
                      ? categories?.find((c) => c._id === selectedCategory)
                          ?.name
                      : "Select category"}
                  </Text>
                </View>
              </View>
              <Icon name="chevron-forward" size={20} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.selectionButton}
              onPress={() => setPhaseModalVisible(true)}
            >
              <View style={styles.selectionContent}>
                <View style={styles.iconContainer}>
                  <Icon name="trending-up" size={20} color={colors.primary} />
                </View>
                <View style={styles.selectionTextContainer}>
                  <Text style={styles.selectionLabel}>Phase</Text>
                  <Text style={styles.selectionValue}>
                    {selectedPhase
                      ? phases.find((p) => p.value === selectedPhase)?.label
                      : "Select phase"}
                  </Text>
                </View>
              </View>
              <Icon name="chevron-forward" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.imagesSection}>
          {!images && !invention.images ? (
            <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
              <View style={styles.addImageContent}>
                <Icon name="camera-outline" size={24} color={colors.primary} />
                <Text style={styles.addImageText}>Add Images</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imagesContainer}
            >
              {(images || invention.images).map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image
                    source={{
                      uri: images ? image.uri : `${BASE_URL}${image}`,
                    }}
                    style={styles.image}
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => {
                      /* Add remove image handler */
                    }}
                  >
                    <Icon
                      name="close-circle"
                      size={20}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                style={styles.addMoreButton}
                onPress={pickImage}
              >
                <Icon name="add-circle" size={24} color={colors.primary} />
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </View>

      <View style={styles.submitButtonContainer}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handleEditInvention}
        >
          <Animated.View
            style={[
              styles.submitButton,
              {
                transform: [{ scale: animatedValue }],
              },
            ]}
          >
            <Text style={styles.submitButtonText}>Save Changes</Text>
          </Animated.View>
        </Pressable>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={inventorModalVisible}
        onRequestClose={() => setInventorModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Inventors</Text>
              <TouchableOpacity
                onPress={() => setInventorModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContent}>
              {inventors && inventors?.length > 0 ? (
                inventors.map((inventor) => (
                  <TouchableOpacity
                    key={inventor._id}
                    style={[
                      styles.inventorItemButton,
                      selectedInventors.includes(inventor._id) &&
                        styles.selectedOption,
                    ]}
                    onPress={() => {
                      const updatedInventors = selectedInventors.includes(
                        inventor._id
                      )
                        ? selectedInventors.filter((id) => id !== inventor._id)
                        : [...selectedInventors, inventor._id];
                      setSelectedInventors(updatedInventors);
                    }}
                  >
                    <View style={styles.inventorItemContainer}>
                      {inventor.image && (
                        <Image
                          source={{ uri: `${BASE_URL}${inventor.image}` }}
                          style={styles.inventorImage}
                        />
                      )}
                      <View style={styles.inventorInfo}>
                        <Text
                          style={[
                            styles.inventorName,
                            selectedInventors.includes(inventor._id) &&
                              styles.selectedOptionText,
                          ]}
                        >
                          {inventor.firstName} {inventor.lastName}
                        </Text>
                        {inventor.bio && (
                          <Text
                            style={[
                              styles.inventorBio,
                              selectedInventors.includes(inventor._id) &&
                                styles.selectedOptionText,
                            ]}
                          >
                            {inventor.bio}
                          </Text>
                        )}
                      </View>
                      {selectedInventors.includes(inventor._id) && (
                        <Icon
                          name="checkmark-circle"
                          size={24}
                          color="#FFFFFF"
                          style={styles.checkmark}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noDataText}>No inventors available</Text>
              )}
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setInventorModalVisible(false)}
              >
                <Text style={styles.applyButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={categoryModalVisible}
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity
                onPress={() => setCategoryModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContent}>
              {categories && categories?.length > 0 ? (
                categories.map((category) => (
                  <TouchableOpacity
                    key={category._id}
                    style={[
                      styles.optionButton,
                      selectedCategory === category._id &&
                        styles.selectedOption,
                    ]}
                    onPress={() => {
                      setSelectedCategory(category._id);
                      setCategoryModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedCategory === category._id &&
                          styles.selectedOptionText,
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noDataText}>No categories available</Text>
              )}
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setCategoryModalVisible(false)}
              >
                <Text style={styles.applyButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={phaseModalVisible}
        onRequestClose={() => setPhaseModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Phase</Text>
              <TouchableOpacity
                onPress={() => setPhaseModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContent}>
              {phases.map((phase, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedPhase === phase.value && styles.selectedOption,
                  ]}
                  onPress={() => {
                    setSelectedPhase(phase.value);
                    setPhaseModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedPhase === phase.value &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {phase.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setPhaseModalVisible(false)}
              >
                <Text style={styles.applyButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
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
    flex: 1,
    padding: 20,
  },
  formSection: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primary,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 15,
    color: colors.primary,
  },
  textAreaWrapper: {
    alignItems: "flex-start",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  selectionSection: {
    gap: 16,
  },
  selectionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  selectionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  selectionTextContainer: {
    gap: 2,
  },
  selectionLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primary,
  },
  selectionValue: {
    fontSize: 13,
    color: colors.primary,
    opacity: 0.7,
  },
  imagesSection: {
    marginTop: 20,
  },
  addImageButton: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: "dashed",
    height: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  addImageContent: {
    alignItems: "center",
    gap: 6,
  },
  addImageText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  imagesContainer: {
    gap: 10,
    padding: 4,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  removeImageButton: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: colors.page,
    borderRadius: 10,
  },
  addMoreButton: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: "dashed",
  },
  submitButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.page,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  submitButton: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    height: 56,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  submitIcon: {
    marginRight: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    maxHeight: "70%",
    width: "100%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.primary,
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 20,
  },
  optionButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.secondary,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    color: colors.primary,
    fontSize: 15,
  },
  selectedOptionText: {
    color: "white",
    fontWeight: "500",
  },
  noDataText: {
    fontSize: 16,
    color: colors.primary,
    opacity: 0.7,
    textAlign: "center",
    marginTop: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.secondary,
  },
  applyButton: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
  },
  applyButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },
  inventorItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  inventorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  inventorInfo: {
    flex: 1,
  },
  inventorName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 4,
  },
  inventorBio: {
    fontSize: 14,
    color: colors.primary,
    opacity: 0.7,
  },
  checkmark: {
    marginLeft: 8,
  },
  inventorItemButton: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.secondary,
    marginBottom: 8,
    backgroundColor: colors.secondary,
  },
});

export default EditInvention;
