import React, { useEffect } from 'react';
import { View, Text, Modal, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GET_USERS_CART_FROM_LOCAL_STORAGE, GET_USER_FROM_LOCAL_STORAGE } from '../utils/storageFunctions';
import { isUserThere } from '../utils/commonFunctions';
import ActivityModal from '../components/ActivityModal';
import userStore from '../mobx/userStore';
import { navigationRef } from '../navigation/navigationRef';


//Dil tercihine göre ve giriş yapılmasına göre yönlendirme yapan ARA sayfa
const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const checkUserChoicesAndInfos = async () => {
      const STORAGED_USER =  await GET_USER_FROM_LOCAL_STORAGE();
      const userLocale = await AsyncStorage.getItem('selectedLocale');
      //const USERS_CART = GET_USERS_CART_FROM_LOCAL_STORAGE();
      if (STORAGED_USER) {
        isUserThere(STORAGED_USER.email,STORAGED_USER.password);
        // if (USERS_CART) {
        //   userStore.setUserCart(USERS_CART);
        // }
      } else {
        if (userLocale) {
          //dil tercihi varsa giriş ekranına yönlendir
          navigationRef.navigate('DrawerNavigator',{screen:'HomeScreen'}); // "MainScreen" doğru yönlendirilecek ekranın adı olmalı
        } else {
          //dil tercihi yoksa dil tercihi ekranına yönlendir
          navigationRef.navigate('WelcomeScreen'); 
        }
      }
    };
    const STORAGED_USER =  GET_USER_FROM_LOCAL_STORAGE();
    checkUserChoicesAndInfos();

  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'#fff' }}>
        <View style={{width:'40%',height:'40%',justifyContent:'center',alignItems:'center'}}>
        <Image
          source={require('../assets/auth/loading.png')} 
          resizeMethod='resize'
          resizeMode='contain'
          style={{height:'100%',width:'100%'}}
        />
        <ActivityIndicator size='small' color='#fff' style={{zIndex:1,position:'absolute',bottom:'30%'}}></ActivityIndicator>
        
        </View>
      </View>
  );
};

export default SplashScreen;