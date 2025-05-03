import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
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
  const [errorMessage, setErrorMessage] = useState("");
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
        .then(() => {
          setErrorMessage("");
          router.replace("/home");
        })
        .catch((err) => setErrorMessage("Error con Google: " + err.message));
    }
  }, [response, router]);

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  const loginWithEmail = () => {
    if (!email || !password) {
      setErrorMessage("Por favor, completa todos los campos.");
      return;
    }
  
    if (!isValidEmail(email)) {
      setErrorMessage("Correo electrónico inválido.");
      return;
    }
  
    signInWithEmailAndPassword(auth, email.trim(), password)
      .then(() => {
        setErrorMessage("");
        router.replace("/home");
      })
      .catch(() =>
        setErrorMessage(
          "Credenciales incorrectas o cuenta no registrada. Intenta nuevamente."
        )
      );
  };
  

  const loginWithGoogle = async () => {
    if (Platform.OS === "web") {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
        setErrorMessage("");
        router.replace("/home");
      } catch (err: any) {
        setErrorMessage("Error con Google (web): " + err.message);
      }
    } else {
      if (!request) {
        setErrorMessage("Google Auth no está listo.");
      } else {
        promptAsync();
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Image
          source={{ uri: "https://img.icons8.com/clouds/500/user.png" }}
          style={styles.logo}
        />
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Correo electrónico"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>

        {errorMessage !== "" && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}

        <TouchableOpacity style={styles.loginButton} onPress={loginWithEmail}>
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <Text style={styles.or}>o</Text>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={loginWithGoogle}
          disabled={Platform.OS !== "web" && !request}
        >
          <AntDesign name="google" size={24} color="#DB4437" />
          <Text style={styles.googleButtonText}>Iniciar con Google</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f9fc",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    borderColor: "#ddd",
    borderWidth: 1,
    fontSize: 16,
  },
  errorText: {
    color: "#ff3b30",
    marginBottom: 15,
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  or: {
    color: "#999",
    marginVertical: 10,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    borderColor: "#ddd",
    borderWidth: 1,
    width: "100%",
    justifyContent: "center",
  },
  googleButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
});
