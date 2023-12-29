import { View,StyleSheet, TextInput, FlatList, TouchableOpacity, Dimensions,Alert } from 'react-native'
import React, { useEffect, useState } from 'react';
import { Button, Header,Text } from '@rneui/base'
import { RefreshControl, getFirestore, doc, updateDoc, DocumentSnapshot } from "firebase/firestore";
import firestore from '@react-native-firebase/firestore';
import { get } from 'mobx';
import { SafeAreaView } from 'react-native-safe-area-context';
import NewUserLine from '../components/newUserLine';
import { ScrollView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { navigationRef } from '../navigation/navigationRef';
import { DrawerActions } from '@react-navigation/native';


const UserApproveScreen = () => {
  const [users, setUsers] = useState([]);
  const userRef = firestore().collection('users').where("isUserApproved", "==", false)
  const windowHeight = Dimensions.get('window').height
  let userArr = [];
  

  function approveAllUsers() {
    users.forEach((user)=>{
      firestore()
        .collection('users')
        .doc(user.id)
        .update({
          isUserApproved: true,
        })
        .then(() => {
          console.log('başarılı')
        });
    })
  }
  
  function deleteAllUsers() {
    users.forEach((user)=>{
      firestore()
        .collection('users')
        .doc(user.id)
        .delete()
        .then(() => {
          console.log('başarılı')
        });
    })
  }
  useEffect(() => {
    userRef
      .onSnapshot(async querySnapshot => {
        userArr = [];
        setUsers([]);
        querySnapshot.forEach((doc) => {
          const { nameSurname, email, phone, id } = doc.data()
          userArr.push(
            {
              id: doc.id,
              nameSurname,
              email,
              phone,
            }
          )
          //console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
        });
        setUsers(userArr);
      }
      )
  },[])

  return (
    <SafeAreaView style={{width:'100%',flex:1}}>     
          <Header
          backgroundColor={'#000000'}
          leftComponent={
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={{ marginLeft: 10 }}
                onPress={() => { 
                  navigationRef.navigate('AdminPanel')
                }}>
                <Ionicons name="arrow-back" color={'white'} size={26} />
              </TouchableOpacity>
            </View>
          }
          centerComponent={
            <View style={{alignItems:'center', justifyContent:'center'}}>
              <Text h4 h4Style={{fontSize:15, alignSelf:'center', fontWeight:'400',fontStyle:'italic', color:'#fff',marginTop:5}} >Kullanıcı Onaylama Ekranı</Text>
            </View>
          }
      />
      <View style={{flexDirection:'row',borderBottomWidth:0.5}}>
      <TouchableOpacity title='Press me' style={{flex:1,padding:10,alignItems:'center'}} onPress={() => {
              Alert.alert(
                'Kullanıcıyı silmek istediğine emin misin Murat abi ?',
                'Kullanıcı tamamen silinir!',
                [
                  {
                    text: 'Evet', onPress: () => {approveAllUsers()}
                     
                  }, { text: 'Hayır', onPress: () => navigationRef.goBack, style: 'cancel' }],
                { cancelable: false }
              );
            }}><Ionicons name="checkbox-sharp" size={40} color={'green'} /></TouchableOpacity>
            <TouchableOpacity title='Press me' style={{flex:1,padding:10,alignItems:'center'}} onPress={() => {
              Alert.alert(
                'Kullanıcıyı silmek istediğine emin misin Murat abi ?',
                'Kullanıcı tamamen silinir!',
                [
                  {
                    text: 'Evet', onPress: () => {deleteAllUsers()}
                     
                  }, { text: 'Hayır', onPress: () => navigationRef.goBack, style: 'cancel' }],
                { cancelable: false }
              );
            }}><Ionicons name="remove-circle-sharp" size={40} color={'red'} /></TouchableOpacity>
            </View>
      <FlatList
        style={{height:windowHeight - windowHeight/100 * 13.4 }}
        data={users}
        numColumns={1}
        renderItem = { ({item}) =>  <NewUserLine item = {item} /> }
      ></FlatList>   
    </SafeAreaView>
  )
}

export default UserApproveScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#F9F9F9',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: 'black',
    right: 0,
    width: 100,
    marginBottom: 15,
    borderColor: '#040D12',
    borderWidth: 0.6,
    opacity: 1,

  },
  input: {
    backgroundColor: 'red'

  }
});