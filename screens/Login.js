import { View, StyleSheet, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Button, Image, Input } from 'react-native-elements'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from "firebase/auth";
const Login = ({ navigation }) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser !== null) {
                navigation.replace("Home");
            }
        });
        return unsubscribe
    }, []);

    const handleSubmit = async () => {
        try {
            signInWithEmailAndPassword(auth, email, password).then((user) => {
                console.log('user', user)
            }).catch((error) => {
                console.log(error);
            })
        } catch (error) {
            console.error("Error creating user:", error);
        }
    }
    return (
        <KeyboardAvoidingView behavior='panding' style={style.container}>
            <StatusBar style='light' />
            <View>
                <Image source={{
                    uri: "https://www.pngarts.com/files/11/Signal-App-Logo-PNG-Image-Background.png"
                }} style={{
                    height: 160, width: 160
                }} />
            </View>
            <View style={style.inputContainer}>
                <Input placeholder='Email' autoFocus type="email" value={email} onChangeText={(email) => setEmail(email)}></Input>
                <Input placeholder='password' secureTextEntry type="password" value={password} onChangeText={(password) => setPassword(password)} onSubmitEditing={handleSubmit}></Input>
            </View>
            <Button raised containerStyle={style.button} title={"Login"} onPress={handleSubmit} />
            <Button containerStyle={style.button} type='outline' title={"Register"} onPress={() => navigation.navigate("Register")} />
        </KeyboardAvoidingView>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 8

    },
    inputContainer: {
        marginTop: 12,
        width: 350
    },
    button: {
        width: 200,
        margin: 8
    }
})

export default Login