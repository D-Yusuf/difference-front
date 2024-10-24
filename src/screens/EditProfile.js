import { StyleSheet, Text, View, SafeAreaView, TextInput } from "react-native";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { TouchableOpacity } from "react-native";
import { updateProfile } from "../api/profile";

const EditProfile = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    bio: "",
  });

  const { mutate: updateProfileMutate } = useMutation({
    mutationFn: () => updateProfile(userInfo),
    mutationKey: ["update-profile"],
    onSuccess: () => {
      alert("Profile updated successfully");
    },
    onError: (error) => {
      console.log(userInfo);
      console.log(error);
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Update First Name"
          maxLength={20}
          onChangeText={(text) => setUserInfo({ ...userInfo, firstName: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Update Last Name"
          maxLength={20}
          onChangeText={(text) => setUserInfo({ ...userInfo, lastName: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Add Bio"
          maxLength={50}
          onChangeText={(text) => setUserInfo({ ...userInfo, bio: text })}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => updateProfileMutate()}
      >
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgray", // Light background color
    paddingHorizontal: 20, // Add horizontal padding for white space
    paddingTop: 20, // Optional: Add some top padding
  },
  inputContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  input: {
    height: 50,
    borderColor: "black", // Light border color
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#007BFF", // Blue update button
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
