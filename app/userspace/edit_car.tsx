import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import api from "../../src/services/api";
import { useTokenContext } from "../../src/contexts/userContext";

export default function EditCar() {
  const { token } = useTokenContext();
  const params = useLocalSearchParams<{
    id: string;
    brand?: string;
    model?: string;
    hp?: string; // 👈 vem como string
  }>();

  const [brand, setBrand] = useState(params.brand ?? "");
  const [model, setModel] = useState(params.model ?? "");
  const [hp, setHp] = useState(params.hp ?? ""); // 👈 string para o TextInput

  const handleSave = async () => {
    if (!params.id) {
      Alert.alert("Error", "Car ID not received.");
      return;
    }

    // converte hp para number antes de enviar
    const hpNumber = Number(hp);
    if (Number.isNaN(hpNumber)) {
      Alert.alert("Error", "HP must be a number.");
      return;
    }

    try {
      await api.patch(
        `/api/collections/cars/records/${params.id}`,
        {
          brand,
          model,
          hp: hpNumber, // 👈 envia como number pro PocketBase
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      Alert.alert("Success", "Car updated.", [
        {
          text: "OK",
          onPress: () => {
            // Se você já tinha colocado isso, mantém:
            router.push("/userspace"); // ou router.back(), como preferir
          },
        },
      ]);
    } catch (error: any) {
      console.log(error);
      Alert.alert("Error", "Error updating car.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Car</Text>

      <Text>ID: {params.id}</Text>

      <TextInput
        style={styles.input}
        placeholder="Brand"
        value={brand}
        onChangeText={setBrand}
      />

      <TextInput
        style={styles.input}
        placeholder="Model"
        value={model}
        onChangeText={setModel}
      />

      <TextInput
        style={styles.input}
        placeholder="HP"
        value={hp}
        onChangeText={setHp}
        keyboardType="numeric"
      />

      <Button title="Save" onPress={() => { handleSave(); router.push("/userspace"); }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
});
