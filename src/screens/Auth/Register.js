import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Modal,
  FlatList,
} from "react-native";
import { register } from "../../api/auth";
import UserContext from "../../context/UserContext";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { validateEmail, validatePassword } from "../../utils/validation";
import Icon from "react-native-vector-icons/Ionicons";
import { colors } from "../../../Colors";

const Register = () => {
  const roles = [
    { label: "Select Role", value: "" },
    { label: "Admin", value: "admin" },
    { label: "Investor", value: "investor" },
    { label: "Inventor", value: "inventor" },
    { label: "Guest", value: "guest" },
  ];
  const [user, setUser] = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setUserInfo({ ...userInfo, image: result.assets[0].uri });
    }
  };

  const { mutate } = useMutation({
    mutationKey: ["register"],
    mutationFn: () => register(userInfo),
    onSuccess: (data) => {
      setUser({ ...user, loggedIn: true, _id: data._id, role: data.role });
    },
    onError: (error) => {
      alert(error);
    },
  });

  const validateInputs = () => {
    let newErrors = {};

    if (!userInfo.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(userInfo.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!userInfo.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(userInfo.password)) {
      newErrors.password =
        "Password must be at least 8 characters long and contain at least one number, one lowercase and one uppercase letter";
    }

    if (!userInfo.firstName) {
      newErrors.firstName = "First name is required";
    }

    if (!userInfo.lastName) {
      newErrors.lastName = "Last name is required";
    }

    if (!userInfo.role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (validateInputs()) {
      mutate();
    }
  };

  const renderRoleItem = ({ item }) => (
    <TouchableOpacity
      style={styles.roleItem}
      onPress={() => {
        setUserInfo({ ...userInfo, role: item.value });
        setModalVisible(false);
      }}
    >
      <Text style={styles.roleItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.title}>Create Account</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.dropdownButtonText}>
              {userInfo.role
                ? roles.find((r) => r.value === userInfo.role).label
                : "Select Role"}
            </Text>
          </TouchableOpacity>
          {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}

          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Email"
            keyboardType="email-address"
            placeholderTextColor="#888"
            onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <View style={styles.nameContainer}>
            <TextInput
              style={[styles.nameInput, errors.firstName && styles.inputError]}
              placeholder="First Name"
              placeholderTextColor="#888"
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, firstName: text })
              }
            />
            {errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            )}

            <TextInput
              style={[styles.nameInput, errors.lastName && styles.inputError]}
              placeholder="Last Name"
              placeholderTextColor="#888"
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, lastName: text })
              }
            />
            {errors.lastName && (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            )}
          </View>

          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <Text style={styles.imagePickerText}>Pick Profile Image</Text>
            )}
          </TouchableOpacity>

          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#888"
            onChangeText={(text) =>
              setUserInfo({ ...userInfo, password: text })
            }
            autoCapitalize="none"
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Icon name="close" size={24} color="#FF7F50" />
          </TouchableOpacity>
          <FlatList
            data={roles}
            renderItem={renderRoleItem}
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
  },
  bgCircle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.secondary, // Soft cool gray overlay
    top: -50,
    right: -50,
    opacity: 0.2,
  },

  bgCircle2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.secondary, // Matching coral
    top: 100,
    left: -100,
    opacity: 0.2,
  },
  bgCircle3: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: colors.secondary, // Light slate gray
    bottom: -50,
    right: -50,
    opacity: 0.2,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#ffffff",
  },
  input: {
    backgroundColor: "#fff",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  registerButton: {
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
    gap: 12,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "700",
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
    color: colors.primary,
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
    backgroundColor: "white",
  },
  roleItemText: {
    fontSize: 16,
    color: "#333",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },
  imagePicker: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePickerText: {
    color: colors.primary,
    textAlign: "center",
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  nameInput: {
    backgroundColor: "#fff",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    width: "48%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#FF7F50",
  },
});

export default Register;
