import React from 'react';
import { Modal, View, Text, ActivityIndicator, StyleSheet,Image } from 'react-native';
import userStore from '../mobx/userStore';


export default function ActivityModal({}) {
  return (
    <Modal
    visible={userStore.loadingActivity}
    transparent={true}
    animationType="fade">
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{width:'25%',height:'25%',justifyContent:'center',alignItems:'center'}}>
      <Image
        source={require('../assets/auth/loading.png')} 
        resizeMethod='resize'
        resizeMode='contain'
        style={{height:'100%',width:'100%'}}
      />
      <ActivityIndicator size='small' color='#fff' style={{zIndex:1,position:'absolute',bottom:'30%'}}></ActivityIndicator>
      </View>
    </View>
  </Modal>
  );
}
