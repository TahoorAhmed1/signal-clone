import React, { useEffect, useLayoutEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Button, Input, Text } from "react-native-elements";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

const Register = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Back to Login",
    });
  }, [navigation]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser !== null) {
        navigation.replace("Home");
      }
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password)

      updateProfile(auth.currentUser, {
        displayName: name,
        photoURL:
          imageUrl ||
          "https://tse3.mm.bing.net/th?id=OIP.s3RJ4bcuEf9d2BBzCCB_0wHaHa&pid=Api&P=0&h=220",
      }).then((user) => {
        console.log(user);
      }).catch((error) => console.log(error))
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  return (
    <KeyboardAvoidingView behavior="panding" style={style.container}>
      <StatusBar style="light" />
      <Text h3 style={{ marginBottom: 12 }}>
        Create a Signal Account
      </Text>
      <View style={style.inputContainer}>
        <Input
          placeholder="Name"
          autoFocus
          type="text"
          value={name}
          onChangeText={(name) => setName(name)}
        ></Input>
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChangeText={(email) => setEmail(email)}
        ></Input>
        <Input
          placeholder="Password"
          secureTextEntry
          type="password"
          value={password}
          onChangeText={(password) => setPassword(password)}
        ></Input>
        <Input
          placeholder="Image Url (optional)"
          type="file"
          value={imageUrl}
          onChangeText={(url) => setImageUrl(url)}
          onSubmitEditing={handleSubmit}
        ></Input>
      </View>
      <Button
        containerStyle={style.button}
        title={"Register"}
        raised
        onPress={handleSubmit}
      />
    </KeyboardAvoidingView>
  );
};

export default Register;

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  inputContainer: {
    marginTop: 12,
    width: 350,
  },
  button: {
    width: 200,
    margin: 12,
  },
});
