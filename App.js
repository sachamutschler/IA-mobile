import { PaperProvider } from 'react-native-paper';
import {View} from "react-native";
import ChatBot from "./src/components/ChatBot";


export default function App() {
  return (
    <PaperProvider>
      <View style={{height: '100%', alignContent: 'center'}}>
        <ChatBot />
      </View>
    </PaperProvider>
  );
}


