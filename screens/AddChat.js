import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { Button, Input } from 'react-native-elements'
import Icon from "react-native-vector-icons/FontAwesome"
import { db } from '../firebase'
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const AddChat = ({ navigation }) => {
    const [input, setInput] = useState("")

    useLayoutEffect(() => {

        navigation.setOptions({
            title: "Add a new Chat"


        })

    }, [navigation])

    const handleSubmit = async () => {
        try {
            await addDoc(collection(db, "chats"), {
                chatName: input,
                timestamp: serverTimestamp()
            }).then(() => {
                navigation.goBack()
            }).catch(() => {
                alert("error")
            })
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <KeyboardAvoidingView behavior='panding' style={style.container}>
            <Input placeholder='Enter chat name' type="text" value={input} leftIcon={() => (<Icon name='wechat' size={22} color="black"></Icon>)} onChangeText={(input) => setInput(input)} onSubmitEditing={handleSubmit} ></Input>

            <Button title={"Add Chat"} disabled={!input} onPress={handleSubmit} />

        </KeyboardAvoidingView>

    )
}

export default AddChat

const style = StyleSheet.create({
    container: {
        height: "100%",
        padding: 20,

    },
    inputContainer: {
        marginTop: 12,
        width: 350
    },
    button: {
        width: 360,
        margin: 5
    }
})