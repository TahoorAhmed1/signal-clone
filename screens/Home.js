import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { auth, db } from '../firebase';
import CustomeListItem from '../components/CustomeListItem';
import { Avatar } from '@rneui/themed';
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { collection, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";

const Home = ({ navigation }) => {

    const [chat, setChat] = useState([])
    const SignOut = () => {
        auth.signOut().then(() => {
            navigation.replace("Login")
        })
    }

    useLayoutEffect(() => {

        navigation.setOptions({
            title: "Signal",
            headerStyle: {
                backgroundColor: "white",
                marginBottom: 0,
                paddingBottom: 0

            },
            headerTitleStyle: {
                color: "black",
            },
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerLeft: () => (
                <View style={{ marginLeft: 5 }}>
                    <TouchableOpacity onPress={SignOut} activeOpacity={0.5}>

                        <Avatar
                            size={38}
                            rounded
                            source={{ uri: auth?.currentUser?.photoURL }}
                        />
                    </TouchableOpacity>
                </View>
            ),
            headerRight: () => (
                <View style={{ flexDirection: "row", justifyContent: "space-between", width: 80, marginRight: 5 }}>
                    <TouchableOpacity activeOpacity={0.5}>

                        <AntDesign name='camerao' size={22} color={"black"}></AntDesign>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("AddChat")} activeOpacity={0.5}>

                        <SimpleLineIcons name='pencil' size={22} color={"black"}></SimpleLineIcons>
                    </TouchableOpacity>
                </View>

            )

        })

    }, [navigation])
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {

            if (authUser == null) {
                navigation.replace("Login");
            }
        });
        return unsubscribe
    }, []);


    useEffect(() => {
        const fetchChat = async () => {
            try {
                let ref = collection(db, 'chats')
                let q = query(ref, orderBy("timestamp", "asc"))

                const querySnapshot = await getDocs(q);
                const result = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }));
                setChat(result);
            } catch (error) {
                console.error('Error fetching chat:', error);
            }
        };

        fetchChat();
        let ref = collection(db, 'chats')
        let q = query(ref, orderBy("timestamp", "asc"))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const updatedChat = snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
            }));
            setChat(updatedChat);
        });

        return unsubscribe
    }, [navigation]);

    const enterToChat = (id, chatName) => {
        navigation.navigate("Chat", {
            id: id,
            chatName: chatName
        })
    }

    return (
        <View>

            <FlatList

                showsVerticalScrollIndicator={true}
                automaticallyAdjustsScrollIndicatorInsets={true}

                keyExtractor={(item, index) => index.toString()}
                data={chat}
                renderItem={({ item: { data, id } }) => (
                    <CustomeListItem chatName={data.chatName} id={id} key={id} enterToChat={enterToChat} />

                )}
            />


        </View>


    )
}

export default Home

const styles = StyleSheet.create({

    container: {
        height: "100%"
    }
})