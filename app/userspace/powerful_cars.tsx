import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Button, Alert } from "react-native";
import { useRouter } from "expo-router";
import api from "../../src/services/api";
import { useTokenContext } from "../../src/contexts/userContext";
import { Car } from "../../src/types/Car";
import { PocketBaseListResult } from "../../src/types/PocketBaseListResult"; // ajuste o caminho se precisar

export default function PowerfulCars() {
  const { token } = useTokenContext();
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [status, setStatus] = useState("");

  const loadPowerfulCars = async () => {
    try {
      setStatus("Loading powerful cars...");

      const response = await api.get<PocketBaseListResult<Car>>(
        "/api/collections/cars/records",
        {
          headers: {
            Authorization: token,
          },
          params: {
            // hp numérico, sem aspas
            filter: "hp >= 200",
            sort: "-hp", // do mais potente para o menos potente
          },
        }
      );

      setCars(response.data.items);
      setStatus(`Loaded ${response.data.items.length} powerful cars.`);
    } catch (error: any) {
      const msg =
        error?.response?.data ??
        error?.message ??
        "Error loading powerful cars.";
      setStatus(`Error: ${JSON.stringify(msg)}`);
      Alert.alert("Error", "Error loading powerful cars.");
    }
  };

  useEffect(() => {
    loadPowerfulCars();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Powerful Cars (HP ≥ 200)</Text>

      <Text style={styles.status}>Status: {status}</Text>

      <Button title="Back to Home" onPress={() => router.push("/userspace")} />

      <FlatList
        data={cars}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.model}>{item.brand} - {item.model}</Text>
            <Text>HP: {item.hp}</Text>
            <Text>ID: {item.id}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  status: { fontSize: 12, color: "#555", marginBottom: 8 },
  list: { marginTop: 8 },
  item: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  model: {
    fontWeight: "bold",
  },
});
