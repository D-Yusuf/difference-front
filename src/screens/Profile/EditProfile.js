import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TouchableOpacity } from "react-native";
import { getProfile, updateProfile } from "../../api/profile";
import { BASE_URL } from "../../api";
import * as ImagePicker from "expo-image-picker";
const EditProfile = ({ route, navigation }) => {
  const queryClient = useQueryClient();
  const { profile } = route.params;
  const [userInfo, setUserInfo] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    bio: profile.bio,
  });
  const [image, setImage] = useState(null);
  // const { data: profile } = useQuery({
  //   queryKey: ["profile-image"],
  //   queryFn: () => getProfile(),
  // }); // do navbigate and put user image inside of it noo need to do new usequery
  const { mutate: updateProfileMutate } = useMutation({
    mutationFn: () => updateProfile(userInfo),
    mutationKey: ["update-profile"],
    onSuccess: () => {
      alert("Profile updated successfully");
      queryClient.invalidateQueries(["profile"]);
      navigation.goBack();
    },
    onError: (error) => {
      alert(userInfo);
      // alert(error);
    },
  });
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
  const handleUpdateProfile = () => {
    if (validateInputs()) {
      updateProfileMutate();
    }
  };

  const validateInputs = () => {
    if (!userInfo.firstName || !userInfo.lastName) {
      alert("Please fill in first name and last name");
      return false;
    }

    return true;
  };
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              image
                ? { uri: image }
                : profile?.image && { uri: BASE_URL + profile.image }
            }
            style={styles.image}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Update First Name"
          value={userInfo.firstName}
          maxLength={20}
          onChangeText={(text) => setUserInfo({ ...userInfo, firstName: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Update Last Name"
          value={userInfo.lastName}
          maxLength={20}
          onChangeText={(text) => setUserInfo({ ...userInfo, lastName: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Add or Update Bio"
          value={userInfo.bio}
          maxLength={50}
          onChangeText={(text) => setUserInfo({ ...userInfo, bio: text })}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </View>
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
  image: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 10,
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "black",
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
