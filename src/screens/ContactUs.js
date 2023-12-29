import { Image, ScrollView, StyleSheet, TouchableOpacity, View, ImageBackground, TextInput, SafeareaContext, Linking, Dimensions, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState } from 'react'
import { Button, Header, Text } from '@rneui/base';
import { navigationRef } from '../navigation/navigationRef';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DrawerActions } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { collection, addDoc,db, updateDoc, setDoc, doc, Firestore } from "firebase/firestore";
import firestore from '@react-native-firebase/firestore'; 
import { Alert } from 'react-native';
import I18n from 'react-native-i18n';
import { observer } from 'mobx-react';
import userStore from '../mobx/userStore';

const ContactUs = observer(() => {

  const [user, setUser] = useState('');
  const [useremail, setUserEmail] = useState('');
  const [problem, setProblem] = useState('');
 
const isFormValid = () =>{
  if (user && useremail && problem ) {
    const regexEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
  if (regexEmail.test(String(useremail).toLowerCase())) {
    createUser({
      user,
      useremail,
      problem,
      isFormRead:false,
  })
}else {
  return Alert.alert(I18n.t('Error'), I18n.t('EmailError'), [I18n.t('Ok')], {cancelable: false})
}
} else {
  return Alert.alert(I18n.t('Error'), I18n.t('FieldError'), [I18n.t('Ok')], {cancelable: false})
}
  console.log(user)
}
const createUser = (userCredential) => {
  const isUserThere = firestore().doc(`problems/${useremail}`);
  isUserThere.get()
  .then( async(querySnapshot) => {
      if (querySnapshot.exists) {
          return Alert.alert(I18n.t('Error'), I18n.t('EmailProblem'), [I18n.t('Ok')], {cancelable: false})
      }
      const res = await firestore().collection('problems').doc(userCredential.useremail).set(userCredential);
      Alert.alert(I18n.t('Congratulations'), I18n.t('CreateProblem'), [I18n.t('Ok')], {cancelable: false})
      navigationRef.navigate('ContactUs')
      setUserEmail('')
      setUser('')
      setProblem('')
  });
}
  return (
      <View style={styles.container}>
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
        />
        <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
         
          <View style={{height:'95%' }} >
            <Text style={{opacity:0,height:0}}>{userStore.lang}</Text>
            <Image source={require('../assets/auth/xtrapke.jpg')} style={{ height: '100%', width: '100%' , position: 'absolute', zIndex: 1, opacity: 0.2 }} />
            <View style={{ height: '90%', width: '100%', flexDirection: 'column', alignItems: 'center', zIndex: 5,marginTop:'10%' }}>
            <Image source={require('../assets/auth/xtrap_logo.png')} resizeMethod='scale' resizeMode='cover' style={{width:'80%',height:'20%'}}  />
              <View style={{ flexDirection: 'column', justifyContent: 'center',marginTop:'5%' }}>
              
                <View style={{ alignItems: 'center', justifyContent: 'center' ,marginBottom:10}}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold' ,textAlign:'center'}}>{I18n.t('ContactUs')}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center',}}>           
                <TextInput
                  autoCapitalize="sentences"
                  style={styles.inputs}
                  placeholder={I18n.t('NameSurname')}
                  placeholderTextColor={'gray'}
                  value={user}
                  onChangeText={user =>
                    setUser(user)
                  }
                />
                <TextInput
                  autoCapitalize="none"
                  style={styles.inputs}
                  placeholder={I18n.t('Email')}
                  placeholderTextColor={'gray'}
                  value={useremail}
                  onChangeText={useremail =>
                    setUserEmail(useremail)
                  }
                />
              </View>
              <View style={{ width:'100%',alignItems: 'center', flexDirection: 'column',height:'40%',marginTop:10}}>
                <TextInput
                  textAlignVertical='top'
                  autoCapitalize="sentences"
                  multiline
                  style={styles.inputs1}
                  placeholder={I18n.t('Subject')}
                  placeholderTextColor={'gray'}
                  value={problem}
                  onChangeText={problem =>
                    setProblem(problem)
                  }
                />
                <Button title={I18n.t('Send')}
                  onPress={() => {isFormValid(user,useremail,problem)} }
                  buttonStyle={{ backgroundColor: '#000000', width: 100,height:'auto' }}
                  titleStyle={{ fontSize: 14}}>
                </Button>
              </View>
              <View style={{marginTop:-10}} >
                <Text style={{ fontWeight: 'bold', fontStyle: 'italic', marginLeft: 5,textAlign:'center'}}>{I18n.t('WorkingHour')}</Text>
                <Text style={{ fontWeight: 'bold', fontStyle: 'italic', marginLeft: 5,textAlign:'center',marginTop:'1%'}}>M.Nesih Özmen Mahallesi Çınar Sokak Efendioğlu İş Merkezi no:22 /19</Text>
                <View style={{ flexDirection: 'row',width:'100%',justifyContent:'center',marginTop:'1%'}}>
                  <TouchableOpacity onPress={() => { Linking.openURL('tel:+905373673060') }}>
                    <FontAwesome name='phone' size={32} color='black' style={{ marginRight: '6%' }}></FontAwesome>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { Linking.openURL(`https://wa.me/+905373673060`) }}>
                    <FontAwesome name='whatsapp' size={32} color='black' style={{ marginRight: '6%' }}></FontAwesome>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { Linking.openURL(`https://t.me/MuratHaktanir34`) }}>
                    <FontAwesome name='telegram' size={32} color='black' style={{ marginRight: '6%' }}></FontAwesome>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { Linking.openURL(`https://www.instagram.com/xtrap_store/`) }}>
                    <FontAwesome name='instagram' size={32} color='black' style={{ marginRight: '6%' }}></FontAwesome>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  )
})
export default ContactUs

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  header: {
    width: '100%',
    backgroundColor: 'red',
    marginTop: '6%',
    height: '7%'
  },
  button: {
    marginLeft: 10,
    backgroundColor: 'black',
    right: 0,
    width: 150,
    marginBottom: 30,
    borderColor: '#040D12',
    borderWidth: 0.6,
    opacity: 1
  },
  inputs: {
    borderWidth: 1,
    borderColor: 'black',
    margin: 5,
    padding: 15,
    width: '45%',
    height: '80%',
    color: 'black',
    backgroundColor: '#fff',
    borderRadius:15
  },
  inputs1: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    width: '95%',
    height: '55%',
    color: 'black',
    backgroundColor: '#fff',
    marginBottom: '5%',
    borderRadius:15,
  },
});