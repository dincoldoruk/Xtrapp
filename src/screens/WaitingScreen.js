import { Image, ScrollView, StyleSheet, View,Text, TouchableOpacity } from 'react-native';
import React from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Button, Header } from '@rneui/base';
import { navigationRef } from '../navigation/navigationRef';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import userStore from '../mobx/userStore';


const WaitingScreen = () => {
  return (
    <View style={styles.container}>
       <Header
        backgroundColor={'#fff'}
        leftComponent={
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => {
                navigationRef.navigate('LoginScreen')
              }}>
              <Ionicons name="return-up-back-sharp" color={'#000'} size={26} />
            </TouchableOpacity>
          </View>
        }
      />
        <View style={{alignItems:'center',backgroundColor:'white',justifyContent:'center',flex:1}}>
        <Image source={require('../assets/auth/bg.jpeg')} style={{height:'100%', width:'100%',flex:1,position:'absolute',zIndex:1, opacity:0.4}}/> 
        <FontAwesome name="envelope-open-o" size={100} color="black" style={{marginBottom: 20,alignSelf:'center'}}/>
        <Text style={{fontWeight:'bold',fontSize:24,color:'black',marginBottom:10}}>Üyeliğiniz Onay İçin Beklemektedir!</Text>
        {/* { userStore.user.isUserApproved ? 
            <TouchableOpacity
              onPress={() => {navigationRef.navigate('LoginScreen')}}
              style={{ alignItems: 'center' }}>
                <Text >Üyeliğin Onaylandı Hemen Giriş Yap!</Text>
            </TouchableOpacity>
          : null
            }   */}
        </View>
    </View>
  )
}
export default WaitingScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        backgroundColor:'#F9F9F9'
    },
    header:{
        width:'100%',
        backgroundColor:'red',
        marginTop:'6%',
        height:'7%'
    }
  });