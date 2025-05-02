// foro2\app\home.tsx
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../src/firebase/config";
import { signOut } from "firebase/auth";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido, {auth.currentUser?.email}!</Text>
      <Button
        title="Cerrar sesión"
        onPress={() => {
          signOut(auth);
          router.replace("/");
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});
