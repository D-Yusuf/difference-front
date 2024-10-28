import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateInvention } from "../api/invention";

const EditInvention = ({ route, navigation }) => {
  const { invention } = route.params;
  const { mutate: editInvention } = useMutation({
    mutationFn: updateInvention,
    mutationKey: ["updateInvention"],
    onSuccess: () => {
      alert("Invention updated successfully");
      navigation.goBack();
    },
  });
  const [name, setName] = useState(invention?.name);
  return (
    <View>
      <TextInput value={name} onChangeText={(text) => setName(text)} />
      <TouchableOpacity onPress={editInvention}>
        <Text>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditInvention;

const styles = StyleSheet.create({});
