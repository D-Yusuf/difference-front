import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateInvention } from "../api/invention";
import * as ImagePicker from "expo-image-picker";
import { BASE_URL } from "../api";

const EditInvention = ({ route, navigation }) => {
  const queryClient = useQueryClient();
  const { invention } = route.params;
  const [inventionInfo, setInventionInfo] = useState({
    // name: invention.name,
    // description: invention.description,
    // cost: invention.cost.toString(),
    // phase: invention.phase,
    // inventors: invention.inventors,
    // images: invention.images,
    // category: invention.category,
  });
  const [images, setImages] = useState(null);
  const { mutate: editInvention } = useMutation({
    mutationFn: () => updateInvention(invention._id, inventionInfo),
    onSuccess: () => {
      alert("Invention updated successfully");
      queryClient.invalidateQueries(["profile"]);
      queryClient.invalidateQueries(["inventions"]);
      queryClient.invalidateQueries(["invention", invention._id]);
      navigation.goBack();
    },
    onError: (error) => {
      alert(error.response.data.message);
    },
  });
  const validateInputs = () => {
    if (!userInfo.firstName || !userInfo.lastName) {
      alert("Please fill in first name and last name");
      return false;
    }

    return true;
  };
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={inventionInfo.name || invention.name}
          onChangeText={(value) => setInventionInfo({
            ...inventionInfo,
            name: value
          })}
          placeholder="Invention Name"
        />
        <TextInput
          style={styles.input}
          value={inventionInfo.description || invention.description}
          onChangeText={(value) => setInventionInfo({
            ...inventionInfo,
            description: value
          })}
          placeholder="Description"
          multiline
        />
        <TextInput
          style={styles.input}
          value={inventionInfo.cost || invention.cost.toString()}
          onChangeText={(value) => setInventionInfo({
            ...inventionInfo,
            cost: value
          })}
          placeholder="Cost"
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text>Add Images</Text>
        </TouchableOpacity>

        <View style={styles.imageGrid}>
          {images
            ? images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image.uri }}
              style={styles.imagePreview}
                />
              ))
              : invention.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: `${BASE_URL}${image}` }}
                  style={styles.imagePreview}
                />
              ))}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={editInvention}>
          <Text style={styles.submitButtonText}>Update Invention</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditInvention;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  form: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  imageButton: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 15,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 15,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
