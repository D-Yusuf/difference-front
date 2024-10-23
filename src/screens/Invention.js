import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { createInvention } from "../api/invention";
const Invention = () => {
  const [invention, setInvention] = useState({});
  const [images, setImages] = useState([]);
  const { mutate } = useMutation({
    mutationFn: () => createInvention(invention),
    mutationKey: ["create-invention"],
    onSuccess: () => {
      alert("Invention created successfully");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleImagePicker = async () => {
    // Request permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true, // Allow multiple selection
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
    mutate();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>New Invention</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Invention Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter invention title"
            onChangeText={(text) => setInvention({ ...invention, name: text })}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Describe your invention"
            multiline={true}
            numberOfLines={6}
            textAlignVertical="top"
            onChangeText={(text) =>
              setInvention({ ...invention, description: text })
            }
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Needed Funds</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount in KWD"
            keyboardType="numeric"
            onChangeText={(text) => setInvention({ ...invention, cost: text })}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleImagePicker}>
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
          style={styles.createInventionbutton}
          onPress={handleCreateInvention}
        >
          <Text style={styles.buttonText}>Post Invention</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Invention;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgray",
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "black",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "black",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  descriptionInput: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 150,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "black",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  createInventionbutton: {
    backgroundColor: "#34A853",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
});
