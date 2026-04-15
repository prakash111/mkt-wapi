import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { handleBackgroundMessage, handleBackgroundNotifeeEvent } from './src/services/notifications/background';

messaging().setBackgroundMessageHandler(handleBackgroundMessage);
notifee.onBackgroundEvent(handleBackgroundNotifeeEvent);

AppRegistry.registerComponent(appName, () => App);
