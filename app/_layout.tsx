import { Stack } from "expo-router";
import { useEffect,useState } from "react";
import { Button, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Layout() {
  const IP = '192.168.221.216';
  const PORT = '8000';
  const [userId,setUserId] = useState<string | null>('');

  useEffect(()=>{
      const getUserId = async()=>{
        const storedUserId = await AsyncStorage.getItem("userID");
        setUserId(storedUserId);
      }
      getUserId(); 
    },[]);
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#121212" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontSize: 20, fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="session" options={{ headerTitle: "Join/Create Session" }} />
      <Stack.Screen name="destination" options={{ headerTitle: "Select Destination" }} />
      <Stack.Screen 
        name="(tabs)" 
        options={({ navigation }) => ({
          headerShown: false,
          headerLeft: () => (
            <Button
              title="←"
              color="#121212"
              onPress={async () => {
                try {
                  await axios.delete(`http://${IP}:${PORT}/removeSessionUser?userID=${userId}`);
                  navigation.goBack(); 
                } catch (error) {
                  Alert.alert("Error", "Failed to make API call");
                  console.error(error);
                }
              }}
            />
          ),
        })} 
      />
    </Stack>
  );
}
