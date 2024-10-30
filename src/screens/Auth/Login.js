import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { login } from "../../api/auth";
import UserContext from "../../context/UserContext";
import { useMutation } from "@tanstack/react-query";
import NAVIGATION from "../../navigations/index";
import Icon from "react-native-vector-icons/Ionicons";
import { ThemeContext } from "../../context/ThemeContext";

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useContext(UserContext);
  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: () => login(email, password),
    onSuccess: (data) => {
      console.log(data.message);
      setUser({ ...user, loggedIn: true, _id: data._id, role: data.role });
    },
    onError: (error) => {
      alert("Login Error", error);
    },
  });
  const { setBackgroundColor } = useContext(ThemeContext);

  useEffect(() => {
    setBackgroundColor("#FF7F50"); // Keeping the coral base
  }, []);

  const handleLogin = () => {
    if (validateInputs()) {
      console.log("first");
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
    return true;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Decorative Background Elements */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />

      <SafeAreaView style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.welcomeText}>Welcome{"\n"}Back</Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Icon name="mail-outline" size={24} color="#fff" />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="rgba(255,255,255,0.7)"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock-closed-outline" size={24} color="#fff" />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="rgba(255,255,255,0.7)"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.loginButton,
              isPending && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color="#003863" />
            ) : (
              <>
                <Text style={styles.loginButtonText}>Sign In</Text>
                <Icon name="arrow-forward" size={24} color="#003863" />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(NAVIGATION.AUTH.REGISTER)}
              style={styles.registerButton}
            >
              <Text style={styles.registerButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF7F50", // Coral base
  },
  bgCircle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(241, 245, 249, 0.15)", // Soft cool gray overlay
    top: -50,
    right: -50,
  },
  bgCircle2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 127, 80, 0.25)", // Matching coral
    top: 100,
    left: -100,
  },
  bgCircle3: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(226, 232, 240, 0.2)", // Light slate gray
    bottom: -50,
    right: -50,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  headerSection: {
    marginTop: 40,
    marginBottom: 60,
  },

  welcomeText: {
    fontSize: 48,
    fontWeight: "800",
    color: "#ffffff",
    lineHeight: 56,
    paddingHorizontal: 8,
  },
  formSection: {
    flex: 1,
  },
  inputGroup: {
    gap: 20,
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(241, 245, 249, 0.3)",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  loginButton: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginHorizontal: 4,
    paddingHorizontal: 24,
    shadowColor: "#475569",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    gap: 12,
  },
  loginButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  loginButtonText: {
    color: "#FF7F50",
    fontSize: 18,
    fontWeight: "700",
    paddingHorizontal: 8,
  },
  forgotPassword: {
    alignSelf: "center",
    marginTop: 20,
    padding: 16,
  },
  forgotPasswordText: {
    color: "#F1F5F9",
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 8,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  footerText: {
    color: "rgba(241, 245, 249, 0.7)",
    fontSize: 14,
    paddingHorizontal: 4,
  },
  registerButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  registerButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    paddingHorizontal: 4,
  },
});

export default Login;
