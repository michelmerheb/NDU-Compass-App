import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

//const API_URL = 'http://10.0.2.2:3000/detect-intent'; // Android emulator
const API_URL = 'http://172.16.2.38:3000/detect-intent'; // Physical device

let sessionId: string | null = null;

// Get or create session ID
const getSessionId = async () => {
  if (!sessionId) {
    sessionId = await AsyncStorage.getItem('dialogflow_session_id');
    if (!sessionId) {
      sessionId = Date.now().toString(); // Simple unique ID
      await AsyncStorage.setItem('dialogflow_session_id', sessionId);
    }
  }
  return sessionId;
};

interface DialogflowResponse {
  text: string;
  isBot: boolean;
  timestamp: number;
  isError?: boolean;
}

export const sendToDialogflow = async (message: string): Promise<DialogflowResponse> => {
  try {
    const sessionId = await getSessionId();
    
    const response = await axios.post(API_URL, {
      message,
      sessionId
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return {
      text: response.data.reply,
      isBot: true,
      timestamp: new Date().getTime()
    };
  } catch (error) {
    console.error('Dialogflow Error:', error);
    return {
      text: "Sorry, I'm having trouble connecting.",
      isBot: true,
      isError: true,
      timestamp: new Date().getTime()
    };
  }
};