import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Image,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "../../api/profile";
import { BASE_URL } from "../../api";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { colors } from "../../../Colors";
const EditProfile = ({ route, navigation }) => {
  const queryClient = useQueryClient();
  const { profile } = route.params;
  const [userInfo, setUserInfo] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    bio: profile.bio,
    cv: profile.cv,
  });

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: false,
        copyToCacheDirectory: true,
      });
      if (!result.canceled) {
        setUserInfo({
          ...userInfo,
          cv: result.assets[0],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCvPress = () => {
    // console.log(userInfo.cv);
    // if (userInfo.cv) {
    //   Linking.openURL(BASE_URL + userInfo.cv[0]);
    // } else {
    pickDocument();
    // }
  };
  const [image, setImage] = useState(null);
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const fileName = imageUri.split("/").pop();
      setImage(imageUri);
      setUserInfo({
        ...userInfo,
        image: {
          uri:
            Platform.OS === "ios" ? imageUri.replace("file://", "") : imageUri,
          name: fileName,
          type: "image/jpeg",
        },
      });
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
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={image ? { uri: image } : { uri: BASE_URL + profile.image }}
            style={styles.image}
          />
          <Text style={styles.imageText}>Change Image</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={userInfo.firstName}
          onChangeText={(text) => setUserInfo({ ...userInfo, firstName: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={userInfo.lastName}
          onChangeText={(text) => setUserInfo({ ...userInfo, lastName: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Bio"
          value={userInfo.bio}
          onChangeText={(text) => setUserInfo({ ...userInfo, bio: text })}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleCvPress}>
            <Text style={styles.buttonText}>Upload CV</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
            <Text style={styles.buttonText}>Update Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.page,
  },
  profileContainer: {
    marginTop: 30,
    flex: 1,
    backgroundColor: colors.page,
    padding: 20,
    borderRadius: 10,
    width: "100%",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#003863",
    alignSelf: "center",
  },
  imageText: {
    color: "#003863",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: "#003863",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#003863",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonContainer: {
    gap: 10,
  },
});
