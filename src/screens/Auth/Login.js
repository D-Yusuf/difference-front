import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { login } from "../../api/auth";
import UserContext from "../../context/UserContext";
import { useMutation } from "@tanstack/react-query";
import NAVIGATION from "../../navigations/index";

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useContext(UserContext);
  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: () => login(email, password),
    onSuccess: (data) => {
      console.log(data.message)
      setUser(true);
      // if(data){

      // }
    },
    onError: (error) => {
      alert("Login Error", error);
    },
  });

  const handleLogin = () => {
    if (validateInputs()) {
      mutate();
    }
  };

  const validateInputs = () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address");
      return false;
    }
    // if (password.length < 6) {
    //   alert("Password must be at least 6 characters long");
    //   return false;
    // }
    return true;
  };

  return (
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(NAVIGATION.AUTH.REGISTER)}
          >
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgray",
    paddingHorizontal: 20, // Add horizontal padding for white space
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "80%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "white",
  },
  loginButton: {
    width: "100%",
    backgroundColor: "skyblue",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "black",
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  registerText: {
    marginRight: 5,
  },
  registerLink: {
    color: "skyblue",
    fontWeight: "bold",
  },
});

export default Login;