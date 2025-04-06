import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { useRouter } from "expo-router"; 
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); 
  const IP = '192.168.163.19';
  const PORT = '8000';
  // const url = `https://6efc-117-251-114-196.ngrok-free.app`;
  // const url = `http://${IP}:${PORT}`;
  const url = `https://destifybackend.onrender.com`;

  const handleLogin = async () => {
    try {
      const userIDResponse = await axios.get(`${url}/getUserId?userName=${username}`);
      const userID = userIDResponse.data.userID;
      const passwordDB = await axios.get(`${url}/getPassword?userID=${userID}`);
      // const userID = 1;
      if (userID && password === passwordDB.data.password) {
        await AsyncStorage.setItem("userID",JSON.stringify(userID));
        Alert.alert("Login successful!");
        console.log("User: ",username," has successfully logged in!");
        router.replace("/session"); 
      } else {
        Alert.alert("Error", "Invalid username or password");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("./logo.png")} style={styles.logo} />
      <Text style={styles.title}>Welcome Back</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 50,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#1E1E1E",
    color: "#fff",
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#BB86FC",
    padding: 12,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LoginScreen;
