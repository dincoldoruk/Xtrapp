/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { PropsWithChildren } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert,
  Appearance,
} from 'react-native';
import { getFirestore } from 'firebase/firestore';
import auth from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import Navigation, { UserNavigation } from './src/navigation/navigation';
import AuthNavigation from './src/navigation/navigation';
import { initializeApp } from 'firebase/app';
import messaging from '@react-native-firebase/messaging';
import { getToken, notificationListener, requestUserPermission } from './src/utils/commonUtils';
import I18n from './src/localization/i18n/i18n';


const firebaseConfig = {
  // your new firebase config
};


export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
function App() {
  //I18n.defaulLocale = 'tr'
  useEffect(() => Appearance.setColorScheme('light'),
    []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('mesaj geldi', JSON.stringify(remoteMessage));
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    requestUserPermission();
    notificationListener();
    getToken();
  }, [])

  return (
    <Navigation />
  );
}


const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
