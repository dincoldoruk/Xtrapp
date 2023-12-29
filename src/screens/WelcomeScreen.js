import { Button } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { FlatList, ImageBackground, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import storage from '@react-native-firebase/storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { navigationRef } from '../navigation/navigationRef';
import { Line } from '../components/countryLine';
import countryList from '../constants/countryList';
import { Avatar } from '@rneui/base';
import userStore from '../mobx/userStore';
import { observer } from 'mobx-react';
import { red } from 'react-native-reanimated';
import { utils } from '@react-native-firebase/app';
import I18n from 'react-native-i18n';
import { changeLanguage } from '../localization/i18n/i18n';

const WelcomeScreen = observer(() => {
  const [selectedCode, setSelectedCode] = useState(userStore.lang);
  const [selectedCountry, setSelectedCountry] = useState('Türkiye');
  const [modalVisible,setModalVisible] = useState(false);
  
  function avatarImage(country){
    switch (country) {
      case "ro":
        return require('../assets/flags/romanian.png');
      case "bg":
        return require('../assets/flags/bulgarian.png');
      case "pl":
        return require('../assets/flags/poland.png');
      case "ar":
        return require('../assets/flags/arabia.png');
      case "en":
        return require('../assets/flags/england.png');
      case "tr":
        return require('../assets/flags/turkey.png');
      case "ru":
        return require('../assets/flags/russia.png');
      default:
        return require('../assets/flags/turkey.png');
    }
  }
  const Country = ({item, onPress, backgroundColor, textColor}) => {
   
    return(
    <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
      <View style={{flexDirection:'row'}}>
        <Image source={avatarImage(item.code)} style={{height:60,width:60,marginTop:5}} />
        <Text style={[styles.title,{color: item.code === selectedCode ? '#fff' : '#000'}]}>{item.name}</Text>
      </View>
    </TouchableOpacity>
    )
  };
  
  const renderItem = ({item}) => {
    const backgroundColor = item.code === selectedCode ? '#000' : '#ffffff';
    const color = item.code === selectedCode ? 'white' : 'black';

    return (
      <Country
        item={item}
        key={item.code}
        onPress={() => {
          setSelectedCode(item.code);
          userStore.setUsersLang(item.code);
          setSelectedCountry(item.name);
          setModalVisible(false)
          userStore.setUserCountry(item.name);
          changeLanguage(item.code)
        }}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

    return (
        <View style={styles.container}>
          {userStore.triggerLangRender}
        <Image source={require('../assets/auth/welcome-img.jpeg')} style={{height:'100%', width:'100%',flex:1,position:'absolute',zIndex:1, opacity:0.2}}/>
        <View style={{zIndex:5,marginTop:30}} >  
                <View style={{aspectRatio: 1 * 1,width:'60%',alignSelf:'center'}}>
                <Image source={require('../assets/auth/xtrap_logo.png')} resizeMethod='scale' resizeMode='contain' style={{aspectRatio: 1 * 1,width:'100%',height:'%100'}}  />
                </View>
                  <Text style={{fontSize:16,textAlign:'center',fontWeight:'bold',paddingHorizontal:10,marginTop:50,color:'#000'}}>{I18n.t('Hello')}</Text>
                  <TouchableOpacity onPress={()=>{setModalVisible(true)}} style={{flexDirection:'row',alignSelf:'center',marginTop:50}}>
                    <Image source={avatarImage(userStore.lang)} style={{height:40,width:40,marginTop:5}} />
                    <Text style={{fontSize:16,textAlign:'center',fontWeight:'bold',alignSelf:'center',marginLeft:'10%',marginTop:4,color:'#000'}}>{userStore.country}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>{navigationRef.navigate('DrawerNavigator', { screen: 'HomeScreen' })}} style={{alignSelf:'flex-end', flexDirection:'row',marginTop:'15%',marginRight:10}}>
                    <Text style={{fontSize:15,textAlign:'center',alignSelf:'center',fontWeight:'400',color:'#000'}}>{I18n.t('Continue')}</Text>
                    <FontAwesome
                      name="angle-right"
                      size={24}
                      color="black"
                      style={{marginLeft: 7,alignSelf:'center'}}>
                    </FontAwesome>
                  </TouchableOpacity>
             
        </View>
        <Modal
          style={{flex:1}}
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}>
          <TouchableOpacity style={{flex:1}} onPress={()=>{setModalVisible(!modalVisible)}} >
            <View style={styles.centeredView}>
              <TouchableWithoutFeedback>
                <View style={styles.modalView}>
                  <View style={{width: '100%',}}>
                    <View style={{backgroundColor:'#242323',padding:10}}> 
                      <Text style={{fontSize: 17, fontWeight: '600', margin: 5, color:'#fff'}}>
                      {I18n.t('Country')}
                      </Text>
                    </View>
                    <FlatList
                      data={countryList}
                      renderItem={renderItem}
                      keyExtractor={item => item.code}
                      extraData={selectedCode}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableOpacity>
        </Modal>
    </View>
    )
})
export default WelcomeScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: '100%',
      width: '100%',
      backgroundColor:'#F9F9F9'
    },
    inputs: {
      borderWidth: 1,
      borderColor: 'black',
      backgroundColor:'#fff',
      margin: 5,
      padding:10,
      width: '80%',
      borderRadius: 10,
      marginLeft: 15,
      height:45,
      color:'black',
    },
    logo: {
      height: '100%',
      width: '100%',
    },
    button: {
      backgroundColor: '#DC0000',
      width:Dimensions.get('window').width,
      marginTop:10
    },
    loginS: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 10,
      alignItems: 'center',
    },
    centeredView: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#0008',
    },
    modalView: {
      margin: 20,
      marginBottom:0,
      width: '100%',
      height: '65%',
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
      bottom:0,
      position:'absolute'
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
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    item:{
      marginBottom:7,
      padding:5
    },
    title:{
      alignSelf:'center',
      marginLeft:'10%'
    }
  });
