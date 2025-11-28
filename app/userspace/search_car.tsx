import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useTokenContext } from "../../src/contexts/userContext";
import api from "../../src/services/api";
import { Car } from "../../src/types/Car";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { FlatList } from "react-native";
import { PocketBaseListResult } from "../../src/types/PocketBaseListResult";

const SearchCar = () => {
  const router = useRouter();
  const { token } = useTokenContext();
  const [brand, setBrand] = useState("");
  const [searchResults, setSearchResults] = useState<Car[]>([]);

  const handleSearch = async () => {

    try {
      const response = await api.get<PocketBaseListResult<Car>>(
        "/api/collections/cars/records",
        {
          headers: { Authorization: token },
          params: {
            // se quiser "contém", use ~, se quiser exato, use =
            filter: brand ? `brand ~ "${brand}"` : "", 
            perPage: 50,
          },
        }
      );

      setSearchResults(response.data.items);
    } catch (error) {
      console.error(error);
      Alert.alert("Error!", "Error Searching Cars!");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} value={brand} onChangeText={setBrand} placeholder="brand" />
      <Button title="Search Cars" onPress={handleSearch} />

      <Text>Search Results:</Text>
       <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id} // assumindo que Car tem id
        renderItem={({ item }) => (
          <Text>{`${item.brand} - ${item.model} (${item.hp}hp)`}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, gap: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  title: {
    marginTop: 16,
    fontWeight: "bold",
  },
});

export default SearchCar;