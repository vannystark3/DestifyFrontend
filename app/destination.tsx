import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";

interface Location {
    name: string;
    lat: string;
    lon: string;
}

const locations: Location[] = [
    { name: "Chandigarh", lat: "30.7333", lon: "76.7794" },
    { name: "Mohali", lat: "30.7046", lon: "76.7179" },
    { name: "Chandigarh University", lat: "30.7703", lon: "76.5740" },
    { name: "Delhi", lat: "28.7041", lon: "77.1025" }
];
const url = `https://destifybackend.onrender.com`;
const API_URL = `${url}/createSession`;

export default function Destination() {
    const { userId } = useLocalSearchParams();
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<Location[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

    const handleSearch = (text: string) => {
        setQuery(text);
        if (text.length > 1) {
            const filteredLocations = locations.filter(location =>
                location.name.toLowerCase().includes(text.toLowerCase())
            );
            setSuggestions(filteredLocations);
        } else {
            setSuggestions([]);
        }
    };

    const handleSelect = async (location: Location) => {
        setSelectedLocation(location);
        setQuery(location.name);
        setSuggestions([]);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    name: location.name,
                    lat: location.lat,
                    lon: location.lon
                }),
            });

            if (response.ok) {
                router.push({ pathname: "/(tabs)/tracking", params: { userId } });
            } else {
                Alert.alert("Error", "Failed to store location");
            }
        } catch (error) {
            console.error("API Error:", error);
            Alert.alert("Error", "Failed to connect to server");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Enter location"
                value={query}
                onChangeText={handleSearch}
                placeholderTextColor="#888"
            />
            <FlatList
                data={suggestions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleSelect(item)} style={styles.suggestionItem}>
                        <Text style={styles.suggestionText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
            {selectedLocation && (
                <View style={styles.selectedContainer}>
                    <Text style={styles.selectedText}>Selected: {selectedLocation.name}</Text>
                    <Text style={styles.selectedText}>Lat: {selectedLocation.lat}, Lon: {selectedLocation.lon}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#121212",
    },
    input: {
        backgroundColor: "#1E1E1E",
        color: "#fff",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    suggestionText: {
        color: "#fff",
    },
    selectedContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#222",
        borderRadius: 5,
    },
    selectedText: {
        color: "#fff",
    },
});
