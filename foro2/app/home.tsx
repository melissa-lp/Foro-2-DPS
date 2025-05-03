import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../src/firebase/config";
import { signOut } from "firebase/auth";

export default function Home() {
  const router = useRouter();
  const [userChecked, setUserChecked] = useState(false);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (!firebaseUser) {
        router.replace("/");
      } else {
        setUser(firebaseUser);
      }
      setUserChecked(true);
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    signOut(auth);
    router.replace("/");
  };

  if (!userChecked || !user) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: "https://img.icons8.com/clouds/500/user.png" }}
          style={styles.avatar}
        />
        <Text style={styles.welcome}>¡Bienvenido,</Text>
        <Text style={styles.username}>{user.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen de Actividad</Text>
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Pedidos</Text>
            <Text style={styles.cardValue}>28</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Clientes</Text>
            <Text style={styles.cardValue}>12</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Ventas</Text>
            <Text style={styles.cardValue}>$4,580</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Últimos 7 días</Text>
        <View style={styles.chart}>
          {[60, 80, 45, 70, 55, 95, 50].map((height, i) => (
            <View key={i} style={[styles.bar, { height }]} />
          ))}
        </View>
        <View style={styles.chartLabels}>
          <Text>L</Text>
          <Text>M</Text>
          <Text>X</Text>
          <Text>J</Text>
          <Text>V</Text>
          <Text>S</Text>
          <Text>D</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f6f9fc",
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  welcome: {
    fontSize: 18,
    color: "#333",
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#222",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
  },
  chart: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 100,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  bar: {
    width: 20,
    backgroundColor: "#007AFF",
    borderRadius: 4,
  },
  chartLabels: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 5,
    paddingHorizontal: 10,
  },
  logoutButton: {
    backgroundColor: "#ff3b30",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
