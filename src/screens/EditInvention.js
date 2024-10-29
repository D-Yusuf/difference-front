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

const EditInvention = ({ route, navigation }) => {
  const queryClient = useQueryClient();
  const { invention } = route.params;
  const [inventionInfo, setInventionInfo] = useState({
    name: invention?.name || "",
    description: invention?.description || "",
    cost: invention?.cost?.toString() || "",
    images: invention?.images || [],
  });

  const { mutate: editInvention } = useMutation({
    mutationFn: () => updateInvention(invention._id, inventionInfo),
    onSuccess: () => {
      alert("Invention updated successfully");
      queryClient.invalidateQueries({ queryKey: ["profile", "inventions"] });
      navigation.goBack();
    },
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      setInventionInfo({
        ...inventionInfo,
        images: [...inventionInfo.images, ...newImages],
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={inventionInfo.name}
          onChangeText={(value) => setInventionInfo({
            ...inventionInfo,
            name: value
          })}
          placeholder="Invention Name"
        />
        <TextInput
          style={styles.input}
          value={inventionInfo.description}
          onChangeText={(value) => setInventionInfo({
            ...inventionInfo,
            description: value
          })}
          placeholder="Description"
          multiline
        />
        <TextInput
          style={styles.input}
          value={inventionInfo.cost}
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
          {inventionInfo.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
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
