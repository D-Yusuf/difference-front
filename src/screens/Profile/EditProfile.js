import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "../../api/profile";
import { BASE_URL } from "../../api";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
const EditProfile = ({ route, navigation }) => {
  const queryClient = useQueryClient();
  const { profile } = route.params;
  const [userInfo, setUserInfo] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    bio: profile.bio,
  });
  const pickDocument = async () => {
    try {
      let result = await DocumentPicker.pick({
        type: DocumentPicker.types.pdf,
      });
      if (!result.canceled) {
        setUserInfo({ ...userInfo, cv: result.assets[0].uri });
      }
    } catch (error) {
      console.log(error);
    }
  };
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
        <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={pickDocument}>
        <Text style={styles.buttonText}>Upload CV</Text>
      </TouchableOpacity>
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
    backgroundColor: "#88B3D4",
  },
  profileContainer: {
    marginTop: 10,
    flex: 1,
    backgroundColor: "#88B3D4",
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
});
