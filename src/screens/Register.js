import React, { useState } from "react";
import {View, Text, Image, TextInput,TouchableOpacity,StyleSheet,KeyboardAvoidingView,Platform,ScrollView,SafeAreaView,Modal,FlatList,} from "react-native";
import { register } from "../api/auth";
import { useContext } from "react";
import UserContext from "../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from 'expo-image-picker';

const Register = () => {
  const roles = [
    { label: "Select Role", value: "" },
    { label: "Admin", value: "admin" },
    { label: "Investor", value: "investor" },
    { label: "Inventor", value: "inventor" },
    { label: "Guest", value: "guest" },
  ];
  const [user, setUser]= useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });


    if (!result.canceled) {
        setImage(result.assets[0].uri)
      setUserInfo({...userInfo, image: result.assets[0].uri});
    }
  };

  const {mutate} = useMutation({
    mutationKey: ["register"],
    mutationFn: ()=> register(userInfo),
    onSuccess: (data)=>{
      setUser(true)
    }
  })

  const renderRoleItem = ({ item }) => (
    <TouchableOpacity
      style={styles.roleItem}
      onPress={() => {
        setUserInfo({...userInfo, role: item.value});
        setModalVisible(false);
      }}
    >
      <Text style={styles.roleItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
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
              {userInfo.role ? roles.find((r) => r.value === userInfo.role).label : "Select Role"}
            </Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            placeholderTextColor="#888"
            value={userInfo.email}
            onChangeText={(text)=> setUserInfo({...userInfo, email: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#888"
            value={userInfo.firstName}
            onChangeText={(text)=> setUserInfo({...userInfo, firstName: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#888"
            value={userInfo.lastName}
            onChangeText={(text)=> setUserInfo({...userInfo, lastName: text})}
          />
          <TouchableOpacity onPress={pickImage}><Text>Pick Image</Text></TouchableOpacity>
          {image && <Image source={{uri: image}} style={{width: 100, height: 100}}/>}
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#888"
            value={userInfo.password}
            onChangeText={(text)=> setUserInfo({...userInfo, password: text})}
            // Add autoCapitalize prop for better UX
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[styles.button, !userInfo.role && styles.buttonDisabled]}
            disabled={!userInfo.role}
            onPress={mutate}
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
    backgroundColor: "#f5f5f5",
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
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  pickerContainer: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 20,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
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
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#A0CFFF",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
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

export default Register;
