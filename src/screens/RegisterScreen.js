import { Button } from '@rneui/base';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, KeyboardAvoidingView, Pressable, ScrollView, ScrollViewComponent, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { navigationRef } from '../navigation/navigationRef';
import SelectDropdown from 'react-native-select-dropdown';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import I18n from 'react-native-i18n';

const RegisterScreen = () => {
    const RegisterDate = firestore.FieldValue.serverTimestamp();
    const [eye,setEye] = useState(true);
    const [eye2,setEye2] = useState(true);
    const [nameSurname,setNameSurname] = useState('');
    const [email,setEmail] = useState('');
    const [phone,setPhone] = useState('');
    const [password,setPassword] = useState('');
    const [passwordRt,setpasswordRt] = useState('');
    const [countryCode,setCountryCode] = useState('+90')
    const phoneList = ['+90','+1','+7','+40','+44','+48','+213','+359','+966',]
    const userNumber = useState("");

    const updateUser = async() =>{
        auth().currentUser.updateProfile({
            displayName: nameSurname,
            phoneNumber: '+905124234567',
          }).then(() => {
            console.log('UPDATED');
          }).catch((error) => {
            console.log('ERROR',error);
          });
    }
    const getUser = async() =>{
        auth().currentUser.updatePhoneNumber('+905124234567').then(() => {
            console.log('UPDATED', auth().currentUser);
          }).catch((error) => {
            console.log('ERROR',error);
          });
    }
    function createNewUser() {
        auth()
          .createUserWithEmailAndPassword(email, password)
          .then((account) => {
            console.log('User account created & signed in!',account.user);
            updateUser();
          })
          .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
              console.log('That email address is already in use!');
            }
    
            if (error.code === 'auth/invalid-email') {
              console.log('That email address is invalid!');
            }
            console.log(error)
            console.error(error);
          });
      }
      const createUser = (userCredential) => {
        const isUserThere = firestore().doc(`users/${email}`);
        isUserThere.get()
        .then( async(querySnapshot) => {
            if (querySnapshot.exists) {
                return Alert.alert(I18n.t('Error'), I18n.t('SameEmail'), [I18n.t('Ok')], {cancelable: false})
            }
            const res = await firestore().collection('users').doc(userCredential.email).set(userCredential);
            navigationRef.navigate('WaitingScreen')
            setEmail('')
            setPhone('')
            setPassword('')
            setpasswordRt('')
            setNameSurname('')
        });
    }
    const isRegisterValid = () =>{
      if (nameSurname && email && password && passwordRt && phone) {
        if (password !== passwordRt) {
          return Alert.alert(I18n.t('PasswordMatch'), I18n.t('PasswordMatchError'), [I18n.t('Ok')], {cancelable: false})
        }
        const regexEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
        
        if (regexEmail.test(String(email).toLowerCase())) {
          createUser(
            {
                isUserApproved:false,
                nameSurname,
                phone:countryCode+' '+phone,
                email,
                password,
                RegisterDate,
                isUserDeleted:false,
            }
          )
        } else{
          return Alert.alert(I18n.t('Error'), I18n.t('EmailError'), [I18n.t('Ok')], {cancelable: false})
        }
      }else {
        return Alert.alert(I18n.t('Error'), I18n.t('FieldError'), [I18n.t('Ok')], {cancelable: false})
      }
    }
    return (
      <View style={styles.container}>
      <Image source={require('../assets/auth/register-img.jpeg')} style={{height:'100%', width:'100%',flex:1,position:'absolute',zIndex:1, opacity:0.2}}/>
      <ScrollView style={{zIndex:5}} >
          <View style={{marginTop:'15%'}} >
            <KeyboardAvoidingView>
              <View style={{aspectRatio: 1 * 1,width:'40%'}}>
                <Image source={require('../assets/auth/xtrap_logo.png')} resizeMethod='scale' resizeMode='contain' style={{width:'100%',height:'100%'}}  />
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  style={styles.inputs}
                  placeholderTextColor={'gray'}
                  placeholder={I18n.t('NameSurname')}
                  value={nameSurname}
                  onChangeText={name =>
                    setNameSurname(name)
                  }
                />
                <FontAwesome
                  name="user"
                  size={24}
                  color="black"
                  style={{marginLeft: 7}}>
                </FontAwesome>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <SelectDropdown
                  data={phoneList}
                  onSelect={(selectedItem, index) => {
                    setCountryCode(selectedItem)
                  }}
                  buttonStyle={styles.selectDropdown}
                  defaultValue={'+90'}
                  rowTextStyle={{fontSize:14,color:'#fff'}}
                  rowStyle={{backgroundColor:'#272829'}}
                  buttonTextStyle={{fontSize:14,color:'#fff'}}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    // text represented after item is selected
                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                    return selectedItem
                  }}
                  rowTextForSelection={(item, index) => {
                    // text represented for each item in dropdown
                    // if data array is an array of objects then return item.property to represent item in dropdown
                    return item
                  }}
                />
                <TextInput
                  style={[styles.inputs,{width:'60%',marginLeft:0}]}
                  placeholderTextColor={'gray'}
                  placeholder={'5xx xxx xx xx'}
                  maxLength={10}
                  keyboardType='numeric'
                  value={phone}
                  onChangeText={phone =>
                    setPhone(phone)
                  }
                />
                <FontAwesome
                  name="phone"
                  size={24}
                  color="black"
                  style={{marginLeft: 7}}>
                </FontAwesome>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  style={styles.inputs}
                  placeholderTextColor={'gray'}
                  placeholder={I18n.t('Email')}
                  value={email}
                  onChangeText={email => {
                    const lowerEmail = String(email).toLowerCase();
                    setEmail(lowerEmail)
                    }
                  }
                />
                <MaterialIcons
                  name="email"
                  size={24}
                  color="black"
                  style={{marginLeft: 3}}>
                </MaterialIcons>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                      style={{marginLeft: 5}}>
                    </FontAwesome>
                  ) : (
                    <FontAwesome
                      name="eye"
                      size={22}
                      color="#307191"
                      style={{marginLeft: 5}}></FontAwesome>
                  )}
                </Pressable>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  autoCapitalize="none"
                  style={styles.inputs}
                  placeholder={I18n.t('PasswordRt')}
                  placeholderTextColor={'gray'}
                  secureTextEntry={eye2}
                  value={passwordRt}
                  onChangeText={password =>
                    setpasswordRt(password)
                  }
                />
                <Pressable
                  onPress={() => {
                    setEye2(!eye2)
                    
                  }}>
                  {eye2 ? (
                    <FontAwesome
                      name="eye-slash"
                      size={22}
                      color="black"
                      style={{marginLeft: 5}}>
                    </FontAwesome>
                  ) : (
                    <FontAwesome
                      name="eye"
                      size={22}
                      color="#307191"
                      style={{marginLeft: 5}}></FontAwesome>
                  )}
                </Pressable>
              </View>
              <View style={{flexDirection: 'row', marginLeft: 10,marginTop:10}}>
              </View>
                <View style={{flexDirection: 'row',justifyContent:'space-between',width:'100%',marginTop:'5%'}}>
                  <TouchableOpacity onPress={()=>{navigationRef.navigate('LoginScreen')}} style={{alignSelf:'flex-end', flexDirection:'row',marginHorizontal:15}}>
                    <FontAwesome
                      name="angle-left"
                      size={24}
                      color="black"
                      style={{marginRight: 7,alignSelf:'center'}}>
                    </FontAwesome>
                    <Text style={{fontSize:15,textAlign:'center',alignSelf:'center',fontWeight:'400'}}>{I18n.t('NavigateLogin')}</Text>
                  </TouchableOpacity>
                  <Button
                    title={I18n.t('Register')}
                    onPress={() => {
                      isRegisterValid(nameSurname,email,password,passwordRt,phone);
                    }}
                    buttonStyle={{marginRight:5, backgroundColor:'#000000',right:0,width:100}}
                    titleStyle={{fontSize:14}}
                    >
                    </Button>
                </View>
            </KeyboardAvoidingView>
          </View>
      </ScrollView>
  </View>
    )
}
export default RegisterScreen;

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
      margin: 5,
      padding:10,
      width: '80%',
      borderTopRightRadius: 15,
      borderTopLeftRadius: 15,
      marginLeft: 15,
      height:45,
      color:'black',
      backgroundColor:'#fff'
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
    selectDropdown:{
      width:'20%',
      backgroundColor:'#272829',
      marginRight:15,
      borderWidth:1,
      borderRadius:4,
      height:45,
      borderRightWidth:0.5,
      borderTopRightRadius:15,
      borderTopLeftRadius:15
    }
  });