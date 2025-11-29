import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View, Button } from "react-native";
import { useTokenContext } from "../../src/contexts/userContext";
import api from "../../src/services/api";
import { Car } from "../../src/types/Car";
import { router } from "expo-router";

export default function Home() {
  const { token } = useTokenContext();
  const [cars, setCars] = useState<Car[]>([]);
  const [status, setStatus] = useState<string>("");

  const loadCars = async () => {
    try {
      const response = await api.get("/api/collections/cars/records", {
        headers: {
          Authorization: token,
        },
      });

      setCars(response.data.items);
      setStatus("Cars loaded.");
    } catch (error: any) {
      const msg =
        error?.response?.data ??
        error?.message ??
        "Error loading cars list.";
      setStatus(`Load error: ${JSON.stringify(msg)}`);
      Alert.alert("Error", "Error loading cars list.");
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  const handleDelete = async (id: string) => {
    // “Log” visível na tela
    setStatus(`Deleting car ${id}...`);

    try {
      await api.delete(`/api/collections/cars/records/${id}`, {
        headers: { Authorization: token },
      });

      // Atualiza lista localmente
      setCars((prev) => prev.filter((car) => car.id !== id));

      setStatus(`Deleted car ${id}.`);

    } catch (error: any) {
      const msg =
        error?.response?.data ??
        error?.message ??
        "Unknown error deleting car.";
      setStatus(`Delete error: ${JSON.stringify(msg)}`);
      Alert.alert("Error deleting car", JSON.stringify(msg));
    }
  };

  const handleEdit = (car: Car) => {
    router.push({
      pathname: "/userspace/edit_car",
      params: {
        id: car.id,
        brand: car.brand,
        model: car.model,
        hp: String(car.hp),
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cars API LIST</Text>

      <Link href="/userspace/create_car">Create a new Car</Link>

      <Button
        title="Go to Search Car"
        onPress={() => router.push("/userspace/search_car")}
      />

      <Button
        title="Show Powerful Cars"
        onPress={() => router.push("/userspace/powerful_cars")}
      />

      <Text style={styles.status}>Status: {status}</Text>

      <FlatList
        data={cars}
        keyExtractor={(car) => car.id}
        style={styles.flatlist}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.id}</Text>
            <Text>{item.brand}</Text>
            <Text>{item.model}</Text>
            <Text>{item.hp}</Text>

            <View style={styles.actionsRow}>
              <Button title="Edit" onPress={() => handleEdit(item)} />
              <View style={{ width: 8 }} />
              <Button
                title="Delete"
                color="red"
                onPress={() => handleDelete(item.id)}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  flatlist: {
    padding: 16,
    width: "100%",
    flex: 1,
  },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 16 },
  item: {
    flexDirection: "column",
    marginTop: 8,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
  },
  actionsRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  status: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 12,
    color: "#555",
  },
});
