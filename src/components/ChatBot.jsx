import React, { useState } from 'react';
import {View, FlatList, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Keyboard} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import MessageBubble from './MessageBubble';
import AudioRecorder from "./AudioRecorder";
//import { getBotResponse } from './api'; // Import de la fonction API

const ChatBot = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const sendMessage = async () => {
        if (message.trim() === '') return;

        const userMessage = { id: Date.now(), text: message, sender: 'user' };
        setMessages([...messages, userMessage]);

        setMessage(''); // Clear input

        const botResponse = /*await getBotResponse(userMessage.text);*/ "Hello, I am a bot!";

        setMessages(prevMessages => [
            ...prevMessages,
            { id: Date.now(), text: botResponse, sender: 'bot' }
        ]);
    };

    const handleAudioRecorded = (audioUri) => {
        const userMessage = { id: Date.now(), text: 'Audio message', sender: 'user', type: 'audio', uri: audioUri };
        setMessages([...messages, userMessage]);

        // Envoyer l'audio au serveur ou le traiter ici
        sendAudioToServer(audioUri);
    };

    const sendAudioToServer = async (audioUri) => {
        // Logique d'envoi du fichier audio au backend
        console.log("Audio sent to server:", audioUri);
        // Ajoute ici la logique pour l'envoyer via FormData à ton backend.
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 15 : 0}
        >
            <View style={{ flex: 1, padding: 16, marginTop: 50 }}>
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <MessageBubble message={item} />}
                    contentContainerStyle={{ paddingBottom: 80 }}
                />
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TextInput
                        label="Votre message"
                        value={message}
                        onChangeText={setMessage}
                        style={{ marginBottom: 8 , width: '80%'}}
                    />
                    <AudioRecorder onAudioRecorded={handleAudioRecorded} />
                </View>
                <Button mode="contained" onPress={sendMessage}>
                    Envoyer
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
};

export default ChatBot;
