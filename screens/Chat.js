import {
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Avatar } from "react-native-elements";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { auth, db } from "../firebase";
import {
    addDoc,
    collection,
    getDocs,
    onSnapshot,
    serverTimestamp,
    orderBy,
    query,
} from "firebase/firestore";

const Chat = ({
    navigation,
    route: {
        params: { chatName, id },
    },
}) => {
    const [input, setInput] = useState("");
    const [message, setMessage] = useState([]);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitleVisible: false,
            headerTitleAlign: "left",
            headerTitle: () => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Avatar
                        size={38}
                        rounded
                        source={{ uri: message[0]?.data?.photoURL || auth.currentUser.photoURL }}
                    />
                    <Text style={{ color: "white", marginLeft: 15, fontWeight: "700" }}>
                        {chatName}
                    </Text>
                </View>
            ),
            // headerLeft: () => (
            //     <TouchableOpacity
            //         style={{ marginLeft: 10 }}
            //         onPress={() => {
            //             // Your custom back button functionality
            //             console.log('Custom back button pressed');
            //             navigation.goBack(); // Or any other navigation action
            //         }}
            //     >
            //         <View style={{ flexDirection: "row", alignItems: "center" }}>
            //             <AntDesign name="arrowleft" size={22} color={"white"} />
            //             {/* You can customize further within this component */}
            //         </View>
            //     </TouchableOpacity>
            // ),
            headerRight: () => (
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: 80,
                        marginRight: 10,
                    }}
                >
                    <TouchableOpacity>
                        <FontAwesome name="video-camera" size={22} color={"white"} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="call" size={22} color={"white"} />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);
    const sendMessage = async () => {
        Keyboard.dismiss();
        await addDoc(collection(db, "chats", id, "messages"), {
            timestamp: serverTimestamp(),
            message: input,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL,
        });
        setInput("");
    };

    useEffect(() => {
        const fetchChat = async () => {
            try {

                const ref = collection(db, "chats", id, "messages")
                let q = query(ref, orderBy("timestamp", "asc"))
                const querySnapshot = await getDocs(q);
                setMessage(
                    querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
                );
            } catch (error) {
                console.error("Error fetching chat:", error);
            }
        };

        fetchChat();
        const ref = collection(db, "chats", id, "messages")
        let q = query(ref, orderBy("timestamp", "asc"))
        const unsubscribe = onSnapshot(
            q,
            orderBy("timestamp", "asc"),
            (snapshot) => {
                setMessage(
                    snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
                );
            }
        );

        return unsubscribe;
    }, [navigation]);

    const renderItem = ({ item: { id, data } }) => (
        data.email === auth.currentUser.email ? (
            <View key={id} style={styles.reciver}>
                <Avatar
                    position="absolute"
                    bottom={-15}
                    rounded
                    right={-5}
                    source={{
                        uri: data.photoURL,
                    }}
                    size={30}
                />
                <Text style={styles.reciverText}>{data.message}</Text>
            </View>
        ) : (
            <View key={id} style={styles.sender}>
                <Avatar
                    position="absolute"
                    bottom={-15}
                    rounded
                    left={-5}
                    source={{
                        uri: data.photoURL,
                    }}
                    size={30}
                />
                <Text style={styles.senderText}>{data.message}</Text>
            </View>
        )

    )
    const flatListRef = useRef(null);

    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [message]);


    return (
        <View style={{ flex: 1 }}>
            <FlatList
                ref={flatListRef}
                showsVerticalScrollIndicator={true}
                automaticallyAdjustsScrollIndicatorInsets={true}
                keyExtractor={(item, index) => index.toString()}
                data={message}
                renderItem={renderItem}
            />
            <View style={styles.footer}>
                <TextInput
                    value={input}
                    onChangeText={(text) => setInput(text)}
                    placeholder="Enter Message..."
                    onSubmitEditing={sendMessage}
                    style={styles.textInput}
                ></TextInput>
                <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                    <Ionicons name="send" size={24} color={"#2B68E6"} />
                </TouchableOpacity>
            </View>

        </View >
    );
};

export default Chat;

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        flex: 1,
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 15,
    },
    textInput: {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        backgroundColor: "#ECECEC",
        padding: 10,
        color: "gray",
        borderRadius: 30,
    },
    reciver: {
        padding: 14,
        backgroundColor: "#ECECEC",
        alignSelf: "flex-end",
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: "80%",
        position: "relative"
    },
    sender: {
        padding: 14,
        backgroundColor: "#2B68E6",
        alignSelf: "flex-start",
        borderRadius: 20,
        margin: 15,
        maxWidth: "80%",
        position: "relative"
    },
    reciverText: {
        color: "black",
        fontWeight: "500",
        marginLeft: 10
    },
    senderText: {
        color: "white",
        fontWeight: "500",
        marginBottom: 15,
        marginLeft: 10
    },
});
