import React, {useState, useEffect} from 'react';
import { Card, Text, IconButton } from 'react-native-paper';
import { Audio } from 'expo-av';
import DisplayTrip from './DisplayTrip';

const MessageBubble = ({ message }) => {
    const [sound, setSound] = useState(null);
    console.log(message)
    const playSound = async () => {
        if (!message.uri) return;

        console.log('Loading sound from', message.uri);
        const { sound } = await Audio.Sound.createAsync(
            { uri: message.uri },
            { shouldPlay: true }
        );
        setSound(sound);

        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
                sound.unloadAsync();
            }
        });

        await sound.playAsync();
    };

    useEffect(() => {
        console.log('Unloading sound');
        return sound ? () => sound.unloadAsync() : undefined;
    }, [sound]);

    return (
        <Card style={{
            margin: 8,
            alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: message.sender === 'user' ? '#E1FFC7' : '#FFF',
        }}>
            <Card.Content>
                {message.type === 'audio' ? (
                    <IconButton icon="play" onPress={playSound} size={28}>  </IconButton>
                ) : (
                    <>
                        <Text>{message.text}</Text>
			            {message.trip != undefined && <DisplayTrip trip_data={message.trip.data}></DisplayTrip> }
                    </>
                )}
            </Card.Content>
        </Card>
    );
};

export default MessageBubble;
