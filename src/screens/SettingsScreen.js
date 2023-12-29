import { Linking, StyleSheet,  TextInput, TouchableOpacity, View, Alert } from 'react-native'
import React from 'react'
import { Avatar, Button, Header,Text } from '@rneui/base'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { navigationRef } from '../navigation/navigationRef';
import { DrawerActions } from '@react-navigation/native';
import I18n from '../localization/i18n/i18n';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import userStore from '../mobx/userStore';
import { observer } from 'mobx-react';
import { FlatList } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { DELETE_USER_FROM_LOCAL_STORAGE } from '../utils/storageFunctions';
import firestore from '@react-native-firebase/firestore';


const SettingsScreen = observer(() => {
  return (
    <View style={styles.container}>
      {userStore.triggerLangRender}
      <Header
        backgroundColor={'#fff'}
        leftComponent={
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => {
                navigationRef.dispatch(DrawerActions.toggleDrawer())
              }}>
              <Ionicons name="menu" color={'#000'} size={26} />
            </TouchableOpacity>
          </View>
        }
        centerComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text h4 h4Style={{ fontSize: 21, alignSelf: 'center', fontWeight: '400', color: '#000' }} >X-TRAP</Text>
          </View>
        }
        rightComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => {
                userStore.user ?
                  navigationRef.navigate('MyBag')
                  :
                  Alert.alert(
                    I18n.t('Sorry'),
                     I18n.t('NotLogin'),
                    [
                      {
                        text: I18n.t('Login'), onPress: () =>
                          navigationRef.navigate('LoginScreen')
                      }, { text: I18n.t('Continue'), onPress: () => navigationRef.goBack, style: 'cancel' }],
                    { cancelable: false }
                  );

              }}>
              <Ionicons name="cart-outline" size={26} color='#000' />
            </TouchableOpacity>
          </View>
        }
      />
      <View style={{ alignItems: 'center' }}>
        <View style={{ marginTop: '10%', width: '100%', alignItems: 'center' }}>
          <Avatar
            rounded
            source={require('../../src/assets/auth/icon.jpg')}
            size={150}
            imageProps={{ resizeMode: 'contain', resizeMethod: 'scale' }}
            containerStyle={{ padding: 10, }}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '10%' }}>
            <View style={{ width: '13%' }}>
              <FontAwesome6 style={{ marginRight: '2%' }} name='user-tag' size={26} />
            </View>
            <View style={{ width: '75%' }}>
              <Text
                style={{ padding: 15, width: '80%', borderLeftWidth: 2, fontWeight: '500', borderStyle: "solid", fontSize: 16 }}
              >{userStore.user ? userStore.user.nameSurname : <TouchableOpacity onPress={()=>{navigationRef.navigate('LoginScreen')}}><Text style={{ padding: 15, width: '100%',fontWeight: '500', borderStyle: "solid", fontSize: 16,textAlign:'center'}}>{I18n.t('NavigateLogin')}</Text></TouchableOpacity>}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '10%' }}>
            <View style={{ width: '13%' }}>
              <FontAwesome6 style={{ marginRight: '2%' }} name='envelope' size={26} />
            </View>
            <View style={{ width: '75%' }}>
              <Text
                style={{ padding: 15, width: '80%', borderLeftWidth: 2, fontWeight: '500', borderStyle: "solid", fontSize: 17 }}
              >{userStore.user ? userStore.user.email: <TouchableOpacity onPress={()=>{navigationRef.navigate('LoginScreen')}}><Text style={{ padding: 15, width: '100%',fontWeight: '500', borderStyle: "solid", fontSize: 16}}>{I18n.t('NavigateLogin')}</Text></TouchableOpacity>}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '10%' }}>
            <View style={{ width: '13%' }}>
              <FontAwesome6 style={{ marginRight: '2%' }} name='phone' size={26} />
            </View>
            <View style={{ width: '75%' }}>
              <Text
                style={{ padding: 15, width: '80%', borderLeftWidth: 2, fontWeight: '500', borderStyle: "solid", fontSize: 17 }}
              >{userStore.user ? userStore.user.phone: <TouchableOpacity onPress={()=>{navigationRef.navigate('LoginScreen')}}><Text style={{ padding: 15, width: '100%',fontWeight: '500', borderStyle: "solid", fontSize: 16}}>{I18n.t('NavigateLogin')}</Text></TouchableOpacity>}</Text>
            </View>
          </View>

        </View>
      </View>
      {
        userStore.user ? 
      <Button onPress={() => {
        Alert.alert(
          I18n.t('Delete'),
          I18n.t('DeletePermanent'),
          [
            {
              text: I18n.t('Confirm'), onPress: () =>
                firestore()
                  .collection('users')
                  .doc(userStore.user.email)
                  .update({
                    isUserDeleted: true,
                  })
                  .then(() => {
                    Alert.alert('', I18n.t('DeletedPermanently'), [{ text: 'Ok' }], { cancelable: false })
                    userStore.setUser({});
                    DELETE_USER_FROM_LOCAL_STORAGE();
                    navigationRef.navigate('LoginScreen');
                  })
            }, { text: I18n.t('Decline'), onPress: () => navigationRef.goBack, style: 'cancel' }],
          { cancelable: false }
        );
      }}
        buttonStyle={{ marginTop: '5%', width: '95%', alignSelf: 'center', }} color='black'>Hesabımı Sil</Button>
      :<View style={{marginTop:'5%'}}/>}
      
      <Button onPress={() => { Linking.openURL(url = 'https://www.xtrapstore.com/privacy-policy') }} buttonStyle={{ marginTop: '3%', width: '95%', alignSelf: 'center' }} color='black' >Gizlilik Politikası</Button>
      <View style={{ flexDirection: 'row', justifyContent: 'center', height: '12%', alignItems: 'flex-end' }}>
        <TouchableOpacity onPress={() => { Linking.openURL(`https://wa.me/+905373673060`) }}>
          <FontAwesome name='whatsapp' size={32} color='black' style={{ marginRight: '1%' }}></FontAwesome>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { Linking.openURL(`https://t.me/MuratHaktanir34`) }}>
          <FontAwesome name='telegram' size={32} color='black' style={{ marginRight: '1%' }}></FontAwesome>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { Linking.openURL(`https://www.instagram.com/xtrap_store/`) }}>
          <FontAwesome name='instagram' size={32} color='black' style={{ marginRight: '1%' }}></FontAwesome>
        </TouchableOpacity>
      </View>
      <Text style={{ textAlign: 'center', marginTop: '2%' }}>Copyright © 2023 Tüm Hakları Saklıdır</Text>
    </View>
  )
}
)
export default SettingsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#F9F9F9',
  },
})