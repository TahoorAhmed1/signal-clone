import { StyleSheet, Text, View } from 'react-native'
import { ListItem } from 'react-native-elements'
import { Avatar } from '@rneui/themed'
import { useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';
import { auth, db } from '../firebase';

const CustomeListItem = ({ id, chatName, enterToChat }) => {
    const [chatMessage, setChatMessage] = useState("")
    useEffect(() => {
        const fetchChat = async () => {
            try {

                const ref = collection(db, "chats", id, "messages")
                let q = query(ref, orderBy("timestamp", "desc"))
                const querySnapshot = await getDocs(q);
                setChatMessage(
                    querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
                );
            } catch (error) {
                console.error("Error fetching chat:", error);
            }
        };

        fetchChat();
        const ref = collection(db, "chats", id, "messages")
        let q = query(ref, orderBy("timestamp", "desc"))
        const unsubscribe = onSnapshot(
            q,
            orderBy("timestamp", "asc"),
            (snapshot) => {
                setChatMessage(
                    snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
                );
            }
        );

        return unsubscribe;
    });
    return (
        <ListItem key={id} bottomDivider onPress={() => enterToChat(id, chatName)} style={{ paddingHorizontal: 5 }}>
            <Avatar
                size={38}
                rounded
                source={{ uri: chatMessage[0]?.data.photoURL || auth.currentUser.photoURL }}
            />
            <ListItem.Content>
                <ListItem.Title style={{ fontWeight: "800" }} >
                    {chatName}
                </ListItem.Title>
                <ListItem.Subtitle numberOfLines={1} ellipsizeMode='tail'>
                    {chatMessage[0]?.data?.displayName ? chatMessage[0]?.data?.displayName + ":" : ""}  {chatMessage[0]?.data?.message}
                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    )
}

export default CustomeListItem

const styles = StyleSheet.create({})