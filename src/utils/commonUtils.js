import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';

export async function requestUserPermission() {
  if(Platform.OS == 'android'){
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  } else{

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
  }  
}

export const notificationListener = () => {

    messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
    );
    navigation.navigate(remoteMessage.data.type);
    });

    // Check whether an initial notification is available
    messaging()
    .getInitialNotification()
    .then(remoteMessage => {
        if (remoteMessage) {
            console.log(
                'Notification caused app to open from quit state:',
                remoteMessage.notification,
            );
            setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
});
};

export const getToken= async () => {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    console.log(token);
}