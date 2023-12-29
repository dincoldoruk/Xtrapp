import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Button, Header } from '@rneui/base';
import messaging from '@react-native-firebase/messaging';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { navigationRef } from '../navigation/navigationRef';
import { DrawerActions } from '@react-navigation/native';
const message = {
    notification: {
        title:'Dorukke',
        body:'Dorukke5'
    },
};

const PushNotification = () => {
   

    const handleSendNotification = () => {
        messaging().sendMessage(message)
            .then((response) => {
                console.log('Successfully sent message:', JSON.stringify(message));
            })
            .catch((error) => {
                console.error('Error sending message:', error);
            });
    };


    return (
        <View style={{ }}>
            <Header
        backgroundColor={'#000000'}
        leftComponent={
          <View >
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => {
                navigationRef.dispatch(DrawerActions.toggleDrawer())
              }}>
              <Ionicons name="menu" color={'white'} size={26} />
            </TouchableOpacity>
          </View>
        }
        centerComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text h4 h4Style={{ fontSize: 15, alignSelf: 'center', fontWeight: '400', fontStyle: 'italic', color: '#fff', marginTop: 5 }} >Yeni Model</Text>
          </View>
        }
      />
            <Button title="bildirim gönder" buttonStyle={{marginTop:200}} onPress={handleSendNotification} />
        </View>
    );
};

export default PushNotification;





