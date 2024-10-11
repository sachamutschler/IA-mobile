import uuid from 'react-native-uuid';

export const uniqueNameFile = (fileType) => {
        const generateId = uuid.v4();
        const timestamp = Date.now();

        switch (fileType) {
            case 'text':
                return `text_${generateId}_${timestamp}.txt`;
            case 'audio':
                return `audio_${generateId}_${timestamp}.wav`
            default:
                return null;
        }
}