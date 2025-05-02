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
} from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "TU_WEB_CLIENT_ID.apps.googleusercontent.com",
    iosClientId: "TU_IOS_CLIENT_ID.apps.googleusercontent.com",
    androidClientId: "TU_ANDROID_CLIENT_ID.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success" && response.authentication) {
      const idToken = (response.authentication as any).idToken as string;
      if (!idToken) return;

      const credential = GoogleAuthProvider.credential(idToken);
      signInWithCredential(auth, credential)
        .then(({ user }) => {
          Alert.alert("¡Bienvenido con Google!", user.email ?? "");
        })
        .catch((err) => Alert.alert("Error Google", err.message));
    }
  }, [response]);

  const loginWithEmail = () => {
    signInWithEmailAndPassword(auth, email.trim(), password)
      .then(({ user }) => {
        Alert.alert("¡Bienvenido!", user.email ?? "");
      })
      .catch((err) => Alert.alert("Error", err.message));
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
        onPress={() => promptAsync()}
        disabled={!request}
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
