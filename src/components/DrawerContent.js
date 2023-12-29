
import React, { useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert,
  Share,
  StyleSheet,
  Modal,
  Pressable,
  FlatList,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Button } from '@rneui/base';
import { navigationRef } from '../navigation/navigationRef';
import userStore from '../mobx/userStore';
import I18n from 'react-native-i18n';
import SelectDropdown from 'react-native-select-dropdown';
import { observer } from 'mobx-react';
import countryList from '../constants/countryList';
import { changeLanguage } from '../localization/i18n/i18n';
import { DELETE_USER_FROM_LOCAL_STORAGE } from '../utils/storageFunctions';
import firestore from '@react-native-firebase/firestore';

const onShare = async () => {
  try {
    let appLink = '';

    if (Platform.OS === 'android') {
      appLink = 'https://play.google.com/store/apps/details?id=com.xtrapp';
    } else if (Platform.OS === 'ios') {
      // Replace 'YouriOSAppID' with the actual App Store ID for your iOS app
      appLink = 'https://apps.apple.com/tr/app/x-trap-store/id6471013547?l';
    }

    const result = await Share.share({
      message: appLink,
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    Alert.alert(error.message);
  }
};

const DrawerContent = observer((props) => {
  function changeLangCode(country) {
    switch (country) {
      case "Türkçe":
        setSelectedCode("tr"),
        userStore.setUsersLang("tr")
        userStore.setUserCountry("Türkçe")
        break;
      case "English":
        setSelectedCode("tr"),
        userStore.setUsersLang("en")
        userStore.setUserCountry("English")
        break;
      case "Русский":
        setSelectedCode("ru"),
        userStore.setUsersLang("ru")
        userStore.setUserCountry("Русский")
        break;
      case "Română":
        setSelectedCode("ro"),
        userStore.setUsersLang("ro")
        userStore.setUserCountry("Română")
        break;
      case "Dialekt":
        setSelectedCode("pl"),
        userStore.setUsersLang("pl")
        userStore.setUserCountry("Dialekt")
        break;
      case "български":
        setSelectedCode("bg"),
        userStore.setUsersLang("bg")
        userStore.setUserCountry("български")
        break;
      case "عربي":
        setSelectedCode("ar"),
        userStore.setUsersLang("ar")
        userStore.setUserCountry("عربي")
        break;
    }
    I18n.locale = userStore.lang
  }
  
  const [selectedCode, setSelectedCode] = useState('tr');
  const [selectedCountry, setSelectedCountry] = useState('Türkçe');
  const [modalVisible, setModalVisible] = useState(false);
  const [locale,setLocale] = useState("");

  const countryListArr = [
      {key:'turkce',val: "Türkçe"},
      {key:'russian',val: "Русский"} ,
      {key:'roman',val: "Română"} , 
      {key:'arabian',val: "عربي"},
      {key:'english',val:"English"},
      {key:'ukranian',val:"български"}
    ]

  return (
    <View style={{ flex: 1 }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View>
              <SelectDropdown
                data={countryList}
                onSelect={(selectedItem, code) => {
                  changeLangCode(selectedItem.name);
                  changeLanguage(selectedItem.code)
                  console.log(selectedItem);
                }}
                renderCustomizedRowChild={(countryObj)=> <Text style={{padding:3,alignSelf:'center',textAlign:'center'}} >{countryObj.name}</Text>}
                defaultValue={userStore.country}
                defaultButtonText={userStore.country}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem.name
                }}
                rowTextForSelection={(item, index) => {
                  return item.name
                }}
              />
              <TouchableOpacity onPress={() => {
                setModalVisible(!modalVisible);
              }}><Text style={{ color: 'black', fontSize: 16, textAlign: 'center', marginTop: '10%' }}>{I18n.t('ChangeLanguage')}</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <DrawerContentScrollView
        contentContainerStyle={{ backgroundColor: 'white' }}>
        <ImageBackground
          source={require('../assets/auth/xtrap_logo.png')}
          style={{ padding: 70, marginBottom: 10 }}>
        </ImageBackground>
        <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#ccc' }}>
          <TouchableOpacity
            onPress={() => {
              navigationRef.navigate('HomeScreen')
            }}
            style={{ paddingBottom: '6%', flexDirection: 'row', marginTop: 8, marginLeft: 7, alignItems: 'center' }}>
            <Ionicons name="home-outline" size={22} color='#000' />
            <View style={{ marginLeft: '4%' }} disabled={true}>
              <Text style={styles.DrawerItemText }>{I18n.t('HomeScreen')}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              userStore.user ? 
              navigationRef.navigate('Urunler',{parametreVar:false})
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
            }}
            style={{ paddingBottom: '6%', flexDirection: 'row', marginTop: 8, marginLeft: 7, alignItems: 'center' }}>
            <Ionicons name="storefront-outline" size={22} color='#000' />
            <View style={{ marginLeft: '4%' }} disabled={true}>
              <Text style={styles.DrawerItemText }>{I18n.t('Products')}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              userStore.user ? 
              navigationRef.navigate('OrderHistoryScreen')
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
            }}
            style={{ paddingBottom: '6%', flexDirection: 'row', marginTop: 8, marginLeft: 7, alignItems: 'center' }}>
            <Ionicons name="document-outline" size={22} color='#000' />
            <View style={{ marginLeft: '4%' }} disabled={true}>
              <Text style={styles.DrawerItemText }>{I18n.t('OrderHistory')}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
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
            }}
            style={{ paddingBottom: '6%', flexDirection: 'row', marginTop: 8, marginLeft: 7, alignItems: 'center' }}>
            <Ionicons name="cart-outline" size={22} color='#000' />
            <View style={{ marginLeft: '4%' }} disabled={true}>
              <Text style={styles.DrawerItemText }>{I18n.t('MyBag')}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigationRef.navigate('ContactUs')
            }}
            style={{ paddingBottom: '6%', flexDirection: 'row', marginTop: 8, marginLeft: 7, alignItems: 'center' }}>
            <Ionicons name="phone-portrait-outline" size={22} color='#000' />
            <View style={{ marginLeft: '4%' }} disabled={true}>
              <Text style={styles.DrawerItemText }>{I18n.t('Contact')}</Text>
            </View>
          </TouchableOpacity>
          { userStore.user?.isAdmin ? 
            <TouchableOpacity
              onPress={() => {
                navigationRef.navigate('AdminPanel')
              }}
              style={{ paddingBottom: '6%', flexDirection: 'row', marginTop: 8, marginLeft: 7, alignItems: 'center' }}>
              <Ionicons name="desktop-outline" size={22} color='#000' />
              <View style={{ marginLeft: '4%' }} disabled={true}>
                <Text style={styles.DrawerItemText }>Admin Paneli</Text>
              </View>
            </TouchableOpacity>
            : null
          }
        </View>
        
      </DrawerContentScrollView>
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#ccc' }}>
        { !userStore.user ?  
        <TouchableOpacity onPress={() => {navigationRef.navigate('LoginScreen') }} style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="enter-outline" size={22} color='#000' style={{marginLeft:-2}} />
            <Text
              style={styles.DrawerItemText }>
              {I18n.t('Login')}
            </Text>
          </View>
        </TouchableOpacity> : null}
     
        <TouchableOpacity onPress={() => { setModalVisible(true) }} style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="earth-outline" size={22} color='#000' />
            <Text
              style={styles.DrawerItemText }>
              {userStore.country}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{navigationRef.navigate('SettingsScreen')}} style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="settings-outline" size={22} color='#000' />
            <Text style={styles.DrawerItemText }>
              {I18n.t('Settings')}
            </Text>
          </View>
        </TouchableOpacity>
       { userStore.user ? 
       <TouchableOpacity onPress={onShare} style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="share-social-outline" size={22} color='#000' />
            <Text style={styles.DrawerItemText }>
              {I18n.t('Share')}
            </Text>
          </View>
        </TouchableOpacity> : null}
        { userStore.user ? <TouchableOpacity onPress={() => {
          DELETE_USER_FROM_LOCAL_STORAGE();
          navigationRef.navigate('LoginScreen');
          userStore.setUser (null);
        }} style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="exit-outline" size={22} color='#000'/>
            <Text
              style={styles.DrawerItemText }>
              {I18n.t('Logout')}
            </Text>
          </View>
        </TouchableOpacity>: null}
      </View>
    </View>
  );
});

export default DrawerContent

const styles = StyleSheet.create({
  modalView: {
    width: '80%',
    height: '23%',
    backgroundColor: '#fff',
    borderRadius: 10,
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
    bottom: 0,
    padding: 10,
    position: 'relative'

  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: 'black',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rowTextStyle:{
    fontSize: 18,
    marginLeft: '4%',
    fontFamily: 'Roboto-Medium',
    color:'#000'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  DrawerItemText:{
      fontSize: 18,
      marginLeft: '4%',
      fontFamily: 'Roboto-Medium',
      color:'#000'
  }
});