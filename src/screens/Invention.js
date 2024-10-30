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
  StatusBar,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { createInvention } from "../api/invention";
import { getCategories } from "../api/categories";
import { colors } from "../../Colors";
import Icon from "react-native-vector-icons/Ionicons";
import { ThemeContext } from "../context/ThemeContext";

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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />

      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.titleContainer}>
          <Icon name="bulb" size={30} color="orange" />
          <Text style={styles.title}>New Invention</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter invention title"
            placeholderTextColor="white"
            onChangeText={(text) => setInvention({ ...invention, name: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Describe your invention"
            placeholderTextColor="white"
            multiline={true}
            numberOfLines={6}
            textAlignVertical="top"
            onChangeText={(text) =>
              setInvention({ ...invention, description: text })
            }
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Total Costs in KWD"
            placeholderTextColor="white"
            keyboardType="numeric"
            onChangeText={(text) => setInvention({ ...invention, cost: text })}
          />
        </View>

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

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleImagePicker}
        >
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
          style={styles.createButton}
          onPress={handleCreateInvention}
        >
          <Text style={styles.buttonText}>Post Invention</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={categoryModalVisible}
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setCategoryModalVisible(false)}
          >
            <Icon name="close" size={24} color="#FF7F50" />
          </TouchableOpacity>
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
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setPhaseModalVisible(false)}
          >
            <Icon name="close" size={24} color="#FF7F50" />
          </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 10,
  },
  bgCircle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.secondary,
    top: -50,
    right: -50,
    opacity: 0.2,
  },
  bgCircle2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.secondary,
    top: 100,
    left: -100,
    opacity: 0.2,
  },
  bgCircle3: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: colors.secondary,
    bottom: -50,
    right: -50,
    opacity: 0.2,
  },
  scrollView: {
    flexGrow: 1,
    padding: 24,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 29,
    fontWeight: "800",
    color: "white",
    marginLeft: 10,
    lineHeight: 56,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(241, 245, 249, 0.3)",
    padding: 12,
    fontSize: 16,
    color: "#ffffff",
    height: 50,
  },
  descriptionInput: {
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(241, 245, 249, 0.3)",
    padding: 12,
    fontSize: 16,
    color: "#ffffff",
    height: 120,
    textAlignVertical: "top",
  },
  dropdownButton: {
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(241, 245, 249, 0.3)",
    padding: 15,
    marginBottom: 20,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "white",
  },
  uploadButton: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  createButton: {
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
  },
  buttonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  createButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "700",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
    gap: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
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
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
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

export default Invention;
