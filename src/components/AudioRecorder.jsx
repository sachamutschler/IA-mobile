import React, { useState } from 'react';
import { IconButton } from 'react-native-paper';
import { Audio } from 'expo-av';
import {AndroidAudioEncoder, AndroidOutputFormat, IOSOutputFormat} from "expo-av/build/Audio/RecordingConstants";

const AudioRecorder = ({ onAudioRecorded }) => {
    const [recording, setRecording] = useState(null);

    const startRecording = async () => {
        try {
            console.log('Starting recording..');
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            const { recording } = await Audio.Recording.createAsync(
                {
                    android: {
                        ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
                        extension: '.wav',
                        outputFormat: AndroidOutputFormat.DEFAULT,
                        audioEncoder: AndroidAudioEncoder.DEFAULT,
                    },
                    ios: {
                        ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
                        extension: '.wav',
                        outputFormat: IOSOutputFormat.LINEARPCM,
                    },
                    web: {
                        mimeType: 'audio/wav',
                        bitsPerSecond: 128000,
                    },
                }
            );
            setRecording(recording);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    const stopRecording = async () => {
        console.log('Stopping recording..');
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);

        if (onAudioRecorded) {
            onAudioRecorded(uri);
        }
    };

    return (
        <IconButton
            icon={recording ? 'stop' : 'microphone'}
            mode="contained"
            onPress={recording ? stopRecording : startRecording}
        />
    );
};

export default AudioRecorder;
