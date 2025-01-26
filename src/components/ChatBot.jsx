import React, {useState} from 'react';
import {FlatList, Keyboard, KeyboardAvoidingView, Platform, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import MessageBubble from './MessageBubble';
import AudioRecorder from "./AudioRecorder";
import axios from 'axios';
import {uniqueNameFile} from "../services/generateNameService";

const ChatBot = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const adressIp = '10.74.255.70';

    const sendMessage = async () => {
        if (message.trim() === '') return;

        const userMessage = { id: Date.now(), text: message, sender: 'user' };
        setMessages([...messages, userMessage]);

        setMessage(''); // Clear input

        const textFileName = uniqueNameFile('text');

        try {
            const response = await axios.post(`http://${adressIp}:8086/upload-text/`, {
                text: userMessage.text,
                filename: textFileName
            });

            const botResponse = /*await getBotResponse(userMessage.text);*/ "Hello, I am a bot!";

            setMessages(prevMessages => [
                ...prevMessages,
                { id: Date.now(), text: botResponse, sender: 'bot' }
            ]);
        } catch (error) {
            console.error("Erreur lors de l'envoi du message à l'API :", error);
            // Ajouter un message d'erreur dans l'interface
            setMessages(prevMessages => [
                ...prevMessages,
                { id: Date.now(), text: "Erreur lors de l'envoi du message", sender: 'bot' }
            ]);
        }
    };

    const handleAudioRecorded = (audioUri) => {
        const userMessage = {
            id: Date.now(),
            text: 'Audio message',
            sender: 'user',
            type: 'audio',
            uri: audioUri
        };
        setMessages([...messages, userMessage]);

        // Envoyer l'audio au serveur ou le traiter ici
        sendAudioToServer(audioUri);
    };

    const manageResponse = async (apiResponse) => {
        if (apiResponse.prediction === "Non valide") {
            setMessages(prevMessages => [
                ...prevMessages,
                { id: Date.now(), text: "Votre demande n'est pas valide, merci d'indiquer un lieu de départ ainsi qu'un lieu d'arrivée.", sender: 'bot' }
            ]);
        }
    }

    const sendAudioToServer = async (audioUri) => {
        console.log("Audio sent to server:", audioUri);
        const formData = new FormData();

        const audioFileName = uniqueNameFile('audio');

        formData.append('file', {
            uri: audioUri,
            type: 'audio/wav',
            name: audioFileName
        });

        try {
            const response = await axios.post(`http://${adressIp}:8086/upload-file/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("Audio sent to server:", response.data);
            await manageResponse(response.data);
        } catch (error) {
            console.error("Error sending audio:", error);
        }


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
