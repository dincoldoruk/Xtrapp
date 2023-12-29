import { View,StyleSheet, TextInput, FlatList, TouchableOpacity, Dimensions,Alert } from 'react-native'
import React, { useEffect, useState } from 'react';
import { Button, Header,Text } from '@rneui/base'
import { RefreshControl, getFirestore, doc, updateDoc, DocumentSnapshot } from "firebase/firestore";
import firestore from '@react-native-firebase/firestore';
import { get } from 'mobx';
import { SafeAreaView } from 'react-native-safe-area-context';
import NewUserLine from '../components/newUserLine';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { navigationRef } from '../navigation/navigationRef';
import NewProblemLine from '../components/newProblemLine';


const Problems = () => {
    const [users, setUsers] = useState([]);
    const userRef = firestore().collection('problems').where("isFormRead", "==", false)
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
          .collection('problems')
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
            const { user,problem,useremail,id,isFormRead} = doc.data()
            userArr.push(
              {
                id: doc.id,
                useremail,
                user,
                problem,
                isFormRead,
              }
            )
            console.log(user,problem,useremail,isFormRead);
          });
          setUsers(userArr);
        }
        )
    },[])
  return (
    
    <SafeAreaView style={{width:'100%'}}>     
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
        <Text h4 h4Style={{fontSize:15, alignSelf:'center', fontWeight:'400',fontStyle:'italic', color:'#fff',marginTop:5}} >Gönderilen Formlar</Text>
      </View>
    }
/>
<FlatList
  style={{height:windowHeight - windowHeight/100 * 13.4 }}
  data={users}
  numColumns={1}
  renderItem = { ({item}) =>  <NewProblemLine item = {item} /> }
></FlatList>   
</SafeAreaView>
)
}


export default Problems

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