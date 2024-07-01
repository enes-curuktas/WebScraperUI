import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');

    useEffect(() => {
        const loadMessages = async () => {
            try {
                const storedMessages = await AsyncStorage.getItem('messages');
                if (storedMessages) {
                    setMessages(JSON.parse(storedMessages));
                }
            } catch (error) {
                console.error('Error loading messages:', error);
            }
        };

        loadMessages();
    }, []);

    const handleSend = async () => {
        const newMessage = { text: inputText, sender: 'me' };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setInputText('');
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(updatedMessages));
        } catch (error) {
            console.error('Error saving message:', error);
        }
        try {
            const response = await fetch('https://localhost:7159/api/ChatBot/get-answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: inputText }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();
            const botMessage = { text: data.answer, sender: 'bot' };
            const updatedMessagesWithBot = [...updatedMessages, botMessage];

            setMessages(updatedMessagesWithBot);
            await AsyncStorage.setItem('messages', JSON.stringify(updatedMessagesWithBot));
        } catch (error) {
            console.error('Error sending message to API:', error);
        }
    };

    const handleClearStorage = async () => {
        try {
            // await AsyncStorage.removeItem('messages');
            await AsyncStorage.clear();
            setMessages([]);
            console.log('Messages cleared successfully.');
        } catch (error) {
            console.error('Error clearing messages:', error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={[styles.messageContainer, item.sender === 'me' ? styles.myMessage : styles.theirMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type a message"
                />
                <Button mode="contained" onPress={handleSend} style={styles.sendButton}>
                    Send
                </Button>
                <Button mode="contained" onPress={handleClearStorage} style={styles.clearButton}>
                    Clear
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        flex: 1,
        justifyContent: 'center',
        padding: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    sendButton: {
        marginRight: 5,
    },
    clearButton: {
        backgroundColor: 'red',
    },
    messageContainer: {
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#d1e7dd',
    },
    theirMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#f8d7da',
    },
    messageText: {
        fontSize: 16,
    },
});

export default Chat;
