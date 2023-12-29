import { Button } from '@rneui/themed';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ImageBackground, Modal, TouchableOpacity } from 'react-native';
import { Dimensions, Image, KeyboardAvoidingView, Pressable, ScrollView, ScrollViewComponent, StyleSheet, Text, TextInput, Touchable, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { navigationRef } from '../navigation/navigationRef';
import firestore from '@react-native-firebase/firestore';
import userStore from '../mobx/userStore';
import { observer } from 'mobx-react';
import I18n from 'react-native-i18n';
import { SET_USER_TO_LOCAL_STORAGE } from '../utils/storageFunctions';
import { isUserThere } from '../utils/commonFunctions';
import ActivityModal from '../components/ActivityModal';

const LoginScreen = observer(() => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [eye, setEye] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <View style={styles.container}>
      {userStore.triggerLangRender}
      <Image source={require('../assets/auth/women-bg.jpeg')} style={{ height: '100%', width: '100%', flex: 1, position: 'absolute', zIndex: 1, opacity: 0.2 }} />
      <ScrollView style={{ zIndex: 5 }} >
        <ActivityModal isModalVisible={isModalVisible} />
        <View style={{ marginTop: '12%' }} >
          <KeyboardAvoidingView>
            <View style={{ aspectRatio: 1 * 1, width: '60%', alignSelf: 'center' }}>
              <Image source={require('../assets/auth/xtrap_logo.png')} resizeMethod='scale' resizeMode='contain' style={{ width: '100%', height: '100%' }} />
              {/*
                  <AnimatedLottieView speed={1} source={require('../../assets/animation/arac_takipAnimation.json')} autoPlay loop style={{ alignSelf: 'center', width: '100%' }}/>
                */
              }
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <TextInput
                style={styles.inputs}
                autoCapitalize='none'
                placeholderTextColor={'gray'}
                placeholder={I18n.t('Email')}
                value={email}
                onChangeText={email =>
                  setEmail(email.toLowerCase())
                }
              />
              <FontAwesome
                name="user"
                size={24}
                color="black"
                style={{ marginLeft: 7 }}>
              </FontAwesome>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                autoCapitalize="none"
                style={styles.inputs}
                placeholder={I18n.t('Password')}
                placeholderTextColor={'gray'}
                secureTextEntry={eye}
                value={password}
                onChangeText={password =>
                  setPassword(password)
                }
              />
              <Pressable
                onPress={() => {
                  setEye(!eye)

                }}>
                {eye ? (
                  <FontAwesome
                    name="eye-slash"
                    size={22}
                    color="black"
                    style={{ marginLeft: 5 }}>
                  </FontAwesome>
                ) : (
                  <FontAwesome
                    name="eye"
                    size={22}
                    color="#307191"
                    style={{ marginLeft: 5 }}></FontAwesome>
                )}
              </Pressable>
            </View>
            <View style={{ flexDirection: 'row', marginLeft: 10, marginTop: 10 }}>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: '5%' }}>
              <Button
                title={I18n.t('Login')}
                onPress={() => {
                  const isUserLoggedIn = isUserThere(email, password);
                  if (isUserLoggedIn) {
                    setEmail('');
                    setPassword('');
                  }
                }}
                buttonStyle={{ marginLeft: 5, backgroundColor: '#000000', width: 100 }}
                titleStyle={{ fontSize: 14 }}
              >
              </Button>
              <Button
                title={I18n.t('Register')}
                onPress={() => {
                  navigationRef.navigate('RegisterScreen')
                }}
                buttonStyle={{ marginRight: 5, backgroundColor: '#000000', right: 0, width: 100 }}
                titleStyle={{ fontSize: 14 }}
              >
              </Button>
            </View>
            <TouchableOpacity onPress={() => { navigationRef.navigate('DrawerNavigator', { screen: 'HomeScreen' }) }} style={{ marginTop: '5%', alignSelf: 'center' }}>
              <Text style={{ textDecorationLine: 'underline', fontSize: 16, fontWeight: '500' }}>{I18n.t('NavigateHome')}</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
      <Modal
        visible={userStore.loadingActivity}
        transparent={true}
        animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '25%', height: '25%', justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={require('../assets/auth/loading.png')}
              resizeMethod='resize'
              resizeMode='contain'
              style={{ height: '100%', width: '100%' }}
            />
            <ActivityIndicator size='small' color='#fff' style={{ zIndex: 1, position: 'absolute', bottom: '30%' }}></ActivityIndicator>
          </View>
        </View>
      </Modal>
    </View>
  )

})
export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#F9F9F9'
  },
  inputs: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#fff',
    margin: 5,
    padding: 10,
    width: '80%',
    borderRadius: 10,
    marginLeft: 15,
    height: 45,
    color: 'black',
  },
  logo: {
    height: '100%',
    width: '100%',
  },
  button: {
    backgroundColor: '#DC0000',
    width: Dimensions.get('window').width,
    marginTop: 10
  },
  loginS: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0008',
  },
  modalView: {
    margin: 20,
    width: 200,
    height: 70,
    backgroundColor: 'white',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginVertical: 15,
    textAlign: 'center',
    fontSize: 17,
    marginLeft: 15,
  },
  centeredActivityI: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});