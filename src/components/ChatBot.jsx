import React, {useState} from 'react';
import {FlatList, Keyboard, KeyboardAvoidingView, Platform, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import MessageBubble from './MessageBubble';
import AudioRecorder from "./AudioRecorder";
import axios from 'axios';
import {uniqueNameFile} from "../services/generateNameService";
// import DisplayTrip from './DisplayTrip';

const ChatBot = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    // const data = {"date": "29/01/2025", "depart": "PARIS", "depart_arrival_time": "16:36:00", "depart_departure_time": "16:36:00", "destination": "STRASBOURG", "destination_arrival_time": "21:19:00", "destination_departure_time": "21:19:00", "trip": [{"arrival_time": "16:36:00", "city": "PARIS", "departure_time": "16:36:00"}, {"arrival_time": "17:22:00", "city": "CHÂTEAU-THIERRY", "departure_time": "17:23:00"}, {"arrival_time": "17:35:00", "city": "DORMANS", "departure_time": "17:36:00"}, {"arrival_time": "17:49:00", "city": "ÉPERNAY", "departure_time": "17:50:00"}, {"arrival_time": "18:05:00", "city": "CHÂLONS-EN-CHAMPAGNE", "departure_time": "18:07:00"}, {"arrival_time": "18:22:00", "city": "VITRY-LE-FRANÇOIS", "departure_time": "18:23:00"}, {"arrival_time": "18:46:00", "city": "BAR-LE-DUC", "departure_time": "18:47:00"}, {"arrival_time": "19:08:00", "city": "COMMERCY", "departure_time": "19:09:00"}, {"arrival_time": "19:25:00", "city": "TOUL", "departure_time": "19:26:00"}, {"arrival_time": "19:48:00", "city": "NANCY", "departure_time": "19:54:00"}, {"arrival_time": "20:12:00", "city": "LUNÉVILLE", "departure_time": "20:13:00"}, {"arrival_time": "20:35:00", "city": "SARREBOURG", "departure_time": "20:37:00"}, {"arrival_time": "20:53:00", "city": "SAVERNE", "departure_time": "20:55:00"}, {"arrival_time": "21:19:00", "city": "STRASBOURG", "departure_time": "21:19:00"}]}
    const adressIp = '172.20.10.3';

    const sendMessage = async () => {
        if (message.trim() === '') return;

        const userMessage = { id: Date.now(), text: message, sender: 'user' };
        setMessages([...messages, userMessage]);

        setMessage(''); // Clear input

        const textFileName = uniqueNameFile('text');

        try {
            const response = await axios.post(`http://${adressIp}:8000/upload-text/`, {
                text: userMessage.text,
                filename: textFileName
            });
            console.log(response.data)
            const textResponse = /*await getBotResponse(userMessage.text);*/ "Un trajet a été trouvé!";

            setMessages(prevMessages => [
                ...prevMessages,
                { id: Date.now(), text: textResponse, sender: 'bot', trip: response.data}
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
        console.log(apiResponse)
        if (apiResponse.prediction && apiResponse.prediction === "Non valide") {
            setMessages(prevMessages => [
                ...prevMessages,
                { id: Date.now(), text: "Votre demande n'est pas valide, merci d'indiquer un lieu de départ ainsi qu'un lieu d'arrivée.", sender: 'bot' }
            ]);
        } else if((apiResponse.data == undefined || apiResponse.data.trip == undefined)) {
                console.log(apiResponse.data)
                setMessages(prevMessages => [
                    ...prevMessages,
                    { id: Date.now(), text: "Votre demande n'est pas valide, merci d'indiquer un lieu de départ ainsi qu'un lieu d'arrivée!", sender: 'bot' }
                ]); 
        } else if(apiResponse.data.trip.prediction == "Non valide"){
            setMessages(prevMessages => [
                ...prevMessages,
                { id: Date.now(), text: "Votre demande n'est pas valide, merci d'indiquer un lieu de départ ainsi qu'un lieu d'arrivée!", sender: 'bot' }
            ]); 
        } else {
            setMessages(prevMessages => [
                ...prevMessages,
                { id: Date.now(), text: "Un itinéraire a été trouvé!", sender: 'bot', trip: apiResponse.data }
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
            const response = await axios.post(`http://${adressIp}:8000/upload-file/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("Audio sent to server:", response.data);
            await manageResponse(response.data);
        } catch (error) {
	    console.log(error)
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
