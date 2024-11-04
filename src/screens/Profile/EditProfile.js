import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
} from "react-native";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../../api/profile";
import { BASE_URL } from "../../api";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { colors } from "../../../Colors";
import Icon from "react-native-vector-icons/Ionicons";

const EditProfile = ({ route, navigation }) => {
  const queryClient = useQueryClient();
  const { profile } = route.params;
  const [userInfo, setUserInfo] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    bio: profile.bio,
    cv: profile.cv,
  });
  const [image, setImage] = useState(null);

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
    pickDocument();
  };

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

  const { mutate: updateProfileMutate } = useMutation({
    mutationFn: () => updateProfile(userInfo),
    mutationKey: ["update-profile"],
    onSuccess: () => {
      alert("Profile updated successfully");
      queryClient.invalidateQueries(["profile"]);
      navigation.goBack();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Image Section */}
        <View style={styles.imageSection}>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            <Image
              source={
                image ? { uri: image } : { uri: BASE_URL + profile.image }
              }
              style={styles.profileImage}
            />
            <View style={styles.imageOverlay}>
              <Icon name="camera" size={24} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>Change Profile Photo</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor={colors.primary + "80"}
              value={userInfo.firstName}
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, firstName: text })
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor={colors.primary + "80"}
              value={userInfo.lastName}
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, lastName: text })
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, styles.bioInput]}
              placeholder="Bio"
              placeholderTextColor={colors.primary + "80"}
              value={userInfo.bio}
              onChangeText={(text) => setUserInfo({ ...userInfo, bio: text })}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* CV Upload Button */}
          <TouchableOpacity style={styles.cvButton} onPress={handleCvPress}>
            <Icon
              name="document-text-outline"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.cvButtonText}>
              {userInfo.cv ? "Update CV" : "Upload CV"}
            </Text>
          </TouchableOpacity>
          {userInfo.cv && (
            <Text style={styles.cvFileName}>
              {typeof userInfo.cv === "string"
                ? userInfo.cv.split("/").pop()
                : userInfo.cv.name}
            </Text>
          )}
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleUpdateProfile}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.page,
  },
  scrollContent: {
    padding: 20,
  },
  imageSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 8,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 20,
  },
  changePhotoText: {
    color: colors.primary,
    fontSize: 14,
    marginTop: 8,
  },
  formSection: {
    gap: 16,
    marginTop: 20,
  },
  inputGroup: {
    width: "100%",
  },
  input: {
    backgroundColor: "white",
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.primary,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  bioInput: {
    height: 120,
    paddingTop: 16,
    textAlignVertical: "top",
  },
  cvButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "white",
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  cvButtonText: {
    fontSize: 16,
    color: colors.primary,
  },
  cvFileName: {
    fontSize: 14,
    color: colors.primary,
    opacity: 0.7,
    marginLeft: 4,
  },
  saveButton: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default EditProfile;
