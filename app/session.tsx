import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, Modal } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SessionScreen: React.FC = () => {
  const [sessionId, setSessionId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>("");
  const IP = '192.168.0.109';
  const PORT = '8000';
  // const url = `https://6efc-117-251-114-196.ngrok-free.app`;
  // const url = `http://${IP}:${PORT}`;
  const url = `https://destifybackend.onrender.com`;


  useEffect(() => {
    const getUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("userID");
      setUserId(storedUserId);
    };
    getUserId();
  }, []);

  const handleJoinSession = async () => {
    if (sessionId.trim() === "") {
      Alert.alert("Error", "Please enter a session ID");
      return;
    }
    try {
      const sessionExists = await axios.get(`${url}/checkSessionExists?sessionID=${sessionId}`);
      if (sessionExists.data.exists == "true") {
        await fetch(`${url}/addSessionUser`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userID: userId, sessionID: sessionId }),
        });
        setModalVisible(false);
        router.push({ pathname: "/(tabs)/tracking", params: { sessionId } });
      } else {
        Alert.alert("Error", "Session ID doesn't exist!");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to connect to the server.");
    }
  };

  const handleCreateSession = () => {
    router.push({ pathname: "/destination", params: { userId } });
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Join a Session</Text> */}
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Join Session</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>OR</Text>
      <TouchableOpacity style={[styles.button, styles.createButton]} onPress={handleCreateSession}>
        <Text style={styles.buttonText}>Create Session</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Session ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Session ID"
              placeholderTextColor="#888"
              value={sessionId}
              onChangeText={setSessionId}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleJoinSession}>
                <Text style={styles.buttonText}>Join</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#BB86FC",
    padding: 12,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  createButton: {
    marginTop: 10,
    backgroundColor: "#03DAC6",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  orText: {
    color: "#fff",
    marginVertical: 10,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    backgroundColor: "#1E1E1E",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#2E2E2E",
    color: "#fff",
    borderRadius: 5,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#BB86FC",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#FF5252",
  },
});

export default SessionScreen;