// src/screens/LoginScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { auth } from "../firebase/config";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
} from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "1092404268201-37s3b3kpjjlcmkipo01jd7tnbndiaed6.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success" && response.authentication) {
      const { idToken } = response.authentication;
      const credential = GoogleAuthProvider.credential(idToken);
      signInWithCredential(auth, credential)
        .then(() => router.replace("/home"))
        .catch((err) => Alert.alert("Error Google", err.message));
    }
  }, [response, router]);

  const loginWithEmail = () => {
    signInWithEmailAndPassword(auth, email.trim(), password)
      .then(() => router.replace("/home"))
      .catch((err) => Alert.alert("Error", err.message));
  };

  const loginWithGoogle = async () => {
    if (Platform.OS === "web") {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
        router.replace("/home");
      } catch (err: any) {
        Alert.alert("Error Google (web)", err.message);
      }
    } else {
      if (!request) {
        Alert.alert("Error", "Google Auth no está listo");
      } else {
        promptAsync();
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Foro2 - Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Entrar con Email" onPress={loginWithEmail} />

      <View style={{ height: 20 }} />

      <Button
        title="Entrar con Google"
        onPress={loginWithGoogle}
        disabled={Platform.OS !== "web" && !request}
        color={Platform.OS === "ios" ? undefined : "#dd4b39"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});
